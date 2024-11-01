// Credits to https://github.com/wevm/wagmi for the inspiration on the implementation
// for the kakarot connector

import type {
  AddInvokeTransactionParameters,
  Call as RequestCall,
  RequestFnCall,
  RpcMessage,
  RpcTypeToMessageMap,
  SwitchStarknetChainParameters,
  TypedData,
} from "@starknet-io/types-js";
import {
  type ChainProviderFactory,
  type ConnectArgs,
  Connector,
  ConnectorNotFoundError,
} from "@starknet-react/core";
import type {
  ConnectorData,
  ConnectorIcons,
} from "@starknet-react/core/src/connectors/base";
import type { EIP6963ProviderDetail } from "mipd";
import {
  Account,
  type AccountInterface,
  type ProviderInterface,
  type ProviderOptions,
  type RpcProvider,
  hash,
} from "starknet";
import {
  type EIP1193Provider,
  type ProviderConnectInfo,
  type ProviderMessage,
  type RpcError,
  type WalletClient,
  encodeAbiParameters,
  getAddress,
  numberToHex,
  toHex,
  withTimeout,
} from "viem";
import {
  CHAIN_CONFIGS,
  DEFAULT_CHAIN,
  KAKAROT_DEPLOYMENTS,
  getCorrespondingKakarotChain,
  getCorrespondingStarknetChain,
} from "./chains";

const MULTICALL_CAIRO_PRECOMPILE = "0x0000000000000000000000000000000000075003";

class ProviderNotFoundError extends Error {
  constructor() {
    super("Provider not found.");
  }
}

class ChainIdInvalidError extends Error {
  constructor(chainId: number) {
    super(`Chain id invalid: ${chainId}`);
  }
}

type EthereumConnectorEvents = {
  onAccountsChanged(accounts: string[]): void;
  onChainChanged(chainId: string): void;
  onConnect?(connectInfo: ProviderConnectInfo): void;
  onDisconnect(error?: Error | undefined): void;
  onMessage?(message: ProviderMessage): void;
};

let accountsChanged: EthereumConnectorEvents["onAccountsChanged"] | undefined;
let chainChanged: EthereumConnectorEvents["onChainChanged"] | undefined;
let connect: EthereumConnectorEvents["onConnect"] | undefined;
let disconnect: EthereumConnectorEvents["onDisconnect"] | undefined;

export interface KakarotConnectorOptions {
  id: string;
  name: string;
  icon: ConnectorIcons;
}
export class KakarotConnector extends Connector {
  private _options: KakarotConnectorOptions;
  public ethProvider: EIP1193Provider;
  public starknetRpcProvider: ChainProviderFactory<RpcProvider>;

  constructor(
    ethProviderDetail: EIP6963ProviderDetail,
    starknetRpcProvider: ChainProviderFactory<RpcProvider>,
  ) {
    super();
    this._options = {
      id: ethProviderDetail.info.rdns,
      name: ethProviderDetail.info.name,
      icon: ethProviderDetail.info.icon,
    };
    this.ethProvider = ethProviderDetail.provider;
    this.starknetRpcProvider = starknetRpcProvider;
  }

  get id(): string {
    return this._options.id;
  }

  get name(): string {
    return this._options.name;
  }

  get icon(): ConnectorIcons {
    return this._options.icon;
  }

  /**
   * Connects to an EVM wallet and resolves the corresponding Starknet address
   * @param chainIdHint - The target Starknet chain ID to connect to. This ensures a compatible kakarot compatible chain is set.
   * If not provided, the DEFAULT_CHAIN will be used.
   * @returns ConnectorData containing the resolved Starknet address and chain ID
   * @throws Error if provider not found or chain switch fails
   */
  async connect({ chainIdHint }: ConnectArgs = {}): Promise<ConnectorData> {
    if (!chainIdHint) {
      chainIdHint = DEFAULT_CHAIN.starknetChain.id;
    }
    const provider = await this.getProvider();
    if (!provider) throw new Error("Provider not found");

    const requestedAccounts = await provider.request({
      method: "eth_requestAccounts",
    });
    const accounts = requestedAccounts.map((x: string) => getAddress(x));
    const address = getAddress(accounts[0]);

    // Manage EIP-1193 event listeners
    // https://eips.ethereum.org/EIPS/eip-1193#events
    if (connect) {
      provider.removeListener("connect", connect);
      connect = undefined;
    }
    if (!accountsChanged) {
      accountsChanged = this.onAccountsChanged.bind(this);
      provider.on("accountsChanged", accountsChanged);
    }
    if (!chainChanged) {
      chainChanged = this.onChainChanged.bind(this);
      provider.on("chainChanged", chainChanged);
    }
    if (!disconnect) {
      disconnect = this.onDisconnect.bind(this);
      provider.on("disconnect", disconnect);
    }

    // Ensure a compatible chain is set
    try {
      await this.switchChain(chainIdHint);
    } catch (error) {
      this.disconnect();
      throw new Error("Could not connect to the requested chain");
    }

    const starknetAddress = await this.resolveStarknetAddress(address);
    const res = {
      account: starknetAddress,
      chainId: BigInt(await this.chainId()),
    };
    this.emit("connect", res);
    return res;
  }

  /**
   * Disconnects from the EVM wallet and cleans up event listeners
   * @throws ProviderNotFoundError if no provider is available
   */
  async disconnect(): Promise<void> {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();

    // Manage EIP-1193 event listeners
    if (chainChanged) {
      provider.removeListener("chainChanged", chainChanged);
      chainChanged = undefined;
    }
    if (disconnect) {
      provider.removeListener("disconnect", disconnect);
      disconnect = undefined;
    }
    if (!connect) {
      connect = this.onConnect.bind(this);
      provider.on("connect", connect);
    }

    // Experimental support for MetaMask disconnect
    // https://github.com/MetaMask/metamask-improvement-proposals/blob/main/MIPs/mip-2.md
    try {
      // Adding timeout as not all wallets support this method and can hang
      // https://github.com/wevm/wagmi/issues/4064
      await withTimeout(
        () =>
          // TODO: Remove explicit type for viem@3
          provider.request<{
            Method: "wallet_revokePermissions";

            Parameters: [
              permissions: { eth_accounts: Record<string, unknown> },
            ];
            ReturnType: null;
          }>({
            // `'wallet_revokePermissions'` added in `viem@2.10.3`
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} }],
          }),
        { timeout: 100 },
      );
    } catch {}

    this.emit("disconnect");
  }

  /**
   * @returns The EIP1193 provider
   */
  async getProvider(): Promise<EIP1193Provider | undefined> {
    if (typeof window === "undefined") return undefined;
    return this.ethProvider;
  }

  /**
   * Queries the active chain ID in the wallet and returns the corresponding Starknet chain ID
   * @returns The current Starknet chain ID
   * @throws ProviderNotFoundError if no provider is available
   */
  async chainId() {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();
    const kakarotChainId = Number(
      await provider.request({ method: "eth_chainId" }),
    );
    const correspondingStarknetChain =
      getCorrespondingStarknetChain(kakarotChainId);
    if (!correspondingStarknetChain) {
      throw new Error(`Unknown chain id: ${kakarotChainId}`);
    }
    return correspondingStarknetChain.id;
  }

  /**
   * @returns The connected EVM wallet accounts
   * @throws ProviderNotFoundError if no provider is available
   */
  async getAccounts(): Promise<`0x${string}`[]> {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();
    const accounts = await provider.request({ method: "eth_accounts" });
    return accounts.map((x: string) => getAddress(x));
  }

  /**
   * Switches the connected EVM wallet to the corresponding kakarot chain for the given Starknet chain ID
   * @param starknetChainId - Target Starknet chain ID
   * @throws ProviderNotFoundError if no provider is available
   * @throws Error if Kakarot does not support the given Starknet chain ID
   */
  async switchChain(starknetChainId: bigint): Promise<void> {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();

    const kakarotChainId = getCorrespondingKakarotChain(
      Number(starknetChainId),
    )?.id;
    if (!kakarotChainId) {
      throw new Error(`Unsupported chain id: ${starknetChainId}`);
    }

    await Promise.all([
      provider
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(kakarotChainId) }],
        })
        // During `'wallet_switchEthereumChain'`, MetaMask makes a `'net_version'` RPC call to the target chain.
        // If this request fails, MetaMask does not emit the `'chainChanged'` event, but will still switch the chain.
        // To counter this behavior, we request and emit the current chain ID to confirm the chain switch either via
        // this callback or an externally emitted `'chainChanged'` event.
        // https://github.com/MetaMask/metamask-extension/issues/24247
        .then(async () => {
          const currentChainId = await this.chainId();
          if (currentChainId === starknetChainId)
            this.emit("change", { chainId: BigInt(starknetChainId) });
        }),
      new Promise<void>((resolve) => {
        const listener = (data: { chainId?: bigint }) => {
          if ("chainId" in data && data.chainId === starknetChainId) {
            this.off("change", listener);
            resolve();
          }
        };
        this.on("change", listener);
      }),
    ]);
  }

  available(): boolean {
    if (typeof window === "undefined") return false;
    return this.ethProvider !== undefined;
  }

  async ready(): Promise<boolean> {
    const provider = await this.getProvider();
    if (!provider) return false;

    const permissions = await provider.request({
      method: "wallet_getPermissions",
    });
    const accounts = (permissions[0]?.caveats?.[0]?.value as string[])?.map(
      (x) => getAddress(x),
    );
    return accounts.length > 0;
  }

  /**
   * Handles RPC requests by mapping Starknet wallet API calls to corresponding EVM wallet methods
   * Some starknet-specific methods are not implemented.
   * @param call - The RPC request call containing type and parameters
   * @returns The result of the RPC call, typed according to the request type
   * @throws ProviderNotFoundError if no provider is available
   * @throws ConnectorNotFoundError if wallet is not available
   * @throws Error for unknown request types or missing parameters
   */
  async request<T extends RpcMessage["type"]>(
    call: RequestFnCall<T>,
  ): Promise<RpcTypeToMessageMap[T]["result"]> {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();
    const { type, params } = call;

    if (!this.available()) {
      throw new ConnectorNotFoundError();
    }

    const account = (await this.getAccounts())[0];

    switch (type) {
      case "wallet_requestChainId":
        return await this.chainId().toString();
      case "wallet_getPermissions": {
        //TODO: check if this is the expected returndata
        const permissions = await provider.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        let accounts = (permissions[0]?.caveats?.[0]?.value as string[])?.map(
          (x) => getAddress(x),
        );
        // `'wallet_requestPermissions'` can return a different order of accounts than `'eth_accounts'`
        // switch to `'eth_accounts'` ordering if more than one account is connected
        // https://github.com/wevm/wagmi/issues/4140
        if (accounts.length > 0) {
          const sortedAccounts = await this.getAccounts();
          accounts = sortedAccounts;
        }
        return accounts;
      }
      case "wallet_requestAccounts": {
        if (!provider) throw new ProviderNotFoundError();
        const requestedAccounts = await provider.request({
          method: "eth_requestAccounts",
        });
        return requestedAccounts.map((x: string) => getAddress(x));
      }
      case "wallet_addStarknetChain":
        throw new Error(
          "wallet_addStarknetChain not implemented for Kakarot connectors",
        );
      case "wallet_watchAsset":
        throw new Error(
          "wallet_watchAsset not implemented for Kakarot connectors",
        );
      case "wallet_switchStarknetChain": {
        if (!params) throw new Error("Params are missing");

        const { chainId } = params as SwitchStarknetChainParameters;

        await this.switchChain(BigInt(chainId));
        return true;
      }
      case "wallet_addDeclareTransaction": {
        throw new Error(
          "wallet_addDeclareTransaction not implemented for Kakarot connectors",
        );
      }
      case "wallet_addInvokeTransaction": {
        if (!params) throw new Error("Params are missing");
        const { calls } = params as AddInvokeTransactionParameters;
        const transaction_hash = await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: MULTICALL_CAIRO_PRECOMPILE,
              data: prepareTransactionData(calls),
            },
          ],
        });
        return {
          transaction_hash: transaction_hash,
        };
      }
      case "wallet_signTypedData": {
        if (!params) throw new Error("Params are missing");

        // authorize signTypedData
        const permissions = await provider.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {
                requiredMethods: ["signTypedData_v4"],
              },
            },
          ],
        });

        //TODO: is it the right typing?
        const { domain, message, primaryType, types } = params as TypedData;
        const accounts = await this.getAccounts();

        //TODO: figure out a way of getting this to work due to different data format ?
        // return provider.request({
        //   method: "eth_signTypedData_v4",
        //   params: [accounts[0], domain, message, primaryType, types],
        // });
        throw new Error(
          "wallet_signTypedData not implemented for Kakarot connectors",
        );
      }
      default:
        throw new Error("Unknown request type");
    }
  }

  /**
   * @returns An empty starknet account object. Forced by the starknet-react connection flow, but not used.
   * @throws ConnectorNotFoundError if wallet is not available
   */
  async account(
    provider: ProviderOptions | ProviderInterface,
  ): Promise<AccountInterface> {
    //TODO: is returning an empty account okay?
    if (!this.available()) {
      throw new ConnectorNotFoundError();
    }
    return new Account(provider, "", "");
  }

  // Listeners for EVM wallet events
  protected async onAccountsChanged(accounts?: string[]) {
    if (!accounts || accounts.length === 0) {
      this.onDisconnect();
      return;
    }

    // Connect if emitter is listening for connect event (e.g. is disconnected and connects through wallet interface)
    if (this.listenerCount("connect")) {
      const chainId = (await this.chainId()).toString();
      this.onConnect({ chainId });
    } else {
      this.emit("change", {
        account: accounts[0],
      });
    }
  }

  private async onChainChanged(chain: string) {
    const chainId = Number(chain);
    const correspondingStarknetChain = getCorrespondingStarknetChain(chainId);
    if (correspondingStarknetChain) {
      this.emit("change", { chainId: correspondingStarknetChain.id });
      return;
    }

    // If the chain is not a kakarot-supported chain, emit the chainId as is
    // The dApp will have to handle the chain switch.
    this.emit("change", { chainId: BigInt(chainId) });
  }

  private async onConnect(connectInfo: ProviderConnectInfo) {
    const accounts = await this.getAccounts();
    if (accounts.length === 0) return;

    const chainId = BigInt(connectInfo.chainId);
    this.emit("connect", { account: accounts[0], chainId });

    // Manage EIP-1193 event listeners
    const provider = await this.getProvider();
    if (provider) {
      if (connect) {
        provider.removeListener("connect", connect);
        connect = undefined;
      }
      if (!accountsChanged) {
        accountsChanged = this.onAccountsChanged.bind(this);
        provider.on("accountsChanged", accountsChanged);
      }
      if (!chainChanged) {
        chainChanged = this.onChainChanged.bind(this);
        provider.on("chainChanged", chainChanged);
      }
      if (!disconnect) {
        disconnect = this.onDisconnect.bind(this);
        provider.on("disconnect", disconnect);
      }
    }
  }

  private async onDisconnect(error?: Error) {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();

    // If MetaMask emits a `code: 1013` error, wait for reconnection before disconnecting
    // https://github.com/MetaMask/providers/pull/120
    if (error && (error as RpcError<1013>).code === 1013) {
      if (provider && !!(await this.getAccounts()).length) return;
    }

    // No need to remove `${this.id}.disconnected` from storage because `onDisconnect` is typically
    // only called when the wallet is disconnected through the wallet's interface, meaning the wallet
    // actually disconnected and we don't need to simulate it.
    this.emit("disconnect");

    // Manage EIP-1193 event listeners
    if (provider) {
      if (chainChanged) {
        provider.removeListener("chainChanged", chainChanged);
        chainChanged = undefined;
      }
      if (disconnect) {
        provider.removeListener("disconnect", disconnect);
        disconnect = undefined;
      }
      if (!connect) {
        connect = this.onConnect.bind(this);
        provider.on("connect", connect);
      }
    }
  }

  /**
   * Resolves an EVM address to its corresponding Starknet address using the Kakarot contract
   * @param address - The EVM address to resolve
   * @returns The corresponding Starknet address
   * @throws Error if chain is unsupported or resolution fails
   * @private
   */
  private async resolveStarknetAddress(address: string): Promise<string> {
    const starknetChainId = await this.chainId();
    const starknetChain = CHAIN_CONFIGS[Number(starknetChainId)].starknetChain;
    if (!starknetChain)
      throw new Error(`Unsupported chain id: ${starknetChainId}`);
    const kakarotAddress = KAKAROT_DEPLOYMENTS[Number(starknetChainId)];
    const response = await this.starknetRpcProvider(
      starknetChain,
    )?.callContract({
      contractAddress: kakarotAddress,
      entrypoint: "get_starknet_address",
      calldata: [address],
    });
    if (!response) throw new Error("Failed to resolve starknet address");
    const starknetAddress = response[0];
    return starknetAddress;
  }
}

/**
 * Prepares the transaction data for a multicall targeting the Kakarot MulticallCairo precompile.
 * @param calls - The calls to prepare
 * @returns The prepared transaction data
 */
const prepareTransactionData = (calls: RequestCall[]) => {
  const encodedCalls = calls.map((call) => {
    const encoded = encodeAbiParameters(
      [
        { type: "uint256", name: "contractAddress" },
        { type: "uint256", name: "selector" },
        { type: "uint256[]", name: "calldata" },
      ],
      [
        BigInt(call.contract_address),
        BigInt(hash.getSelectorFromName(call.entry_point)),
        (call.calldata as string[]).map((data: string) => BigInt(data)),
      ],
    );
    return encoded.slice(2); // Remove the '0x' prefix from each encoded call
  });

  const concatenatedCalls = encodedCalls.join("");
  const callCount = toHex(calls.length, { size: 32 }).slice(2); // Remove the '0x' prefix from the call count
  return `0x${callCount}${concatenatedCalls}` as `0x${string}`;
};
