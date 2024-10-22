import type {
  AddInvokeTransactionParameters,
  Call as RequestCall,
  RequestFnCall,
  RpcMessage,
  RpcTypeToMessageMap,
  SwitchStarknetChainParameters,
  TypedData,
} from "@starknet-io/types-js";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  ConnectorNotFoundError,
  InjectedConnector,
} from "@starknet-react/core";
import type { ConnectorData } from "@starknet-react/core/src/connectors/base";
import type { EIP6963ProviderDetail } from "mipd";
import {
  Account,
  type AccountInterface,
  type ProviderInterface,
  type ProviderOptions,
  hash,
} from "starknet";
import {
  type ProviderConnectInfo,
  type ProviderMessage,
  type RpcError,
  type WalletClient,
  encodeAbiParameters,
  getAddress,
  numberToHex,
  toHex,
} from "viem";
import { kakarotSepolia } from "./chains";

class ProviderNotFoundError extends Error {
  constructor() {
    super("Provider not found.");
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

export class KakarotConnector extends InjectedConnector {
  public ethereumConnector: WalletClient | undefined;
  public ethProvider: any;

  constructor(ethProviderDetail: EIP6963ProviderDetail) {
    super({
      options: {
        id: ethProviderDetail.info.rdns,
        name: ethProviderDetail.info.name,
        icon: ethProviderDetail.info.icon,
      },
    });
    this.ethProvider = ethProviderDetail.provider;
  }

  async connect(): Promise<ConnectorData> {
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

    //TODO: how to ensure that the chain is correctly set upon connection?
    // const currentChainId = await this.ethereumConnector.getChainId();
    // if (chainId && currentChainId !== chainId) {
    //     await this.switchChain({ chainId });
    // }

    const res = {
      account: address,
      chainId: BigInt(await this.getChainId()),
    };
    this.emit("connect", res);
    return res;
  }

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

    this.ethereumConnector = undefined;
    this.emit("disconnect");
  }

  async getProvider(): Promise<any | undefined> {
    if (typeof window === "undefined") return undefined;
    return this.ethProvider;
  }

  private async getChainId() {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();
    const kakarotChainId = Number(
      await provider.request({ method: "eth_chainId" }),
    );
    if (kakarotChainId === kakarotSepolia.id) {
      return sepolia.id;
    } else if (kakarotChainId === 0x1) {
      // TODO for debug purpose
      return mainnet.id;
    }
    throw new Error(`Unknown chain id: ${kakarotChainId}`);
  }

  private async getEvmChainId() {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();
    const kakarotChainId = await provider.request({ method: "eth_chainId" });
    return kakarotChainId;
  }

  async getAccounts(): Promise<`0x${string}`[]> {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();
    const accounts = await provider.request({ method: "eth_accounts" });
    return accounts.map((x: string) => getAddress(x));
  }

  async switchChain(starknetChainId: bigint): Promise<void> {
    const provider = await this.getProvider();
    if (!provider) throw new ProviderNotFoundError();

    let kakarotChainId = 1;
    if (starknetChainId === sepolia.id) {
      console.log("switch to sepolia");
      kakarotChainId = kakarotSepolia.id;
    } else if (starknetChainId === mainnet.id) {
      // throw new Error("Kakarot Mainnet not supported");
      // TODO for debug purpose
      kakarotChainId = 1;
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
          const currentChainId = await this.getChainId();
          if (currentChainId === starknetChainId)
            this.emit("change", { chainId: BigInt(starknetChainId) });
        }),
      new Promise<void>((resolve) => {
        const listener = (data: any) => {
          if ("chainId" in data && data.chainId === starknetChainId) {
            this.emit("change", { chainId: BigInt(starknetChainId) });
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

  async chainId(): Promise<bigint> {
    return Promise.resolve(1n);
  }

  async ready(): Promise<boolean> {
    //TODO fix this one
    return this.ethProvider !== undefined;
  }

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
        return await this.getChainId().toString();
      case "wallet_getPermissions":
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
      case "wallet_requestAccounts":
        if (!provider) throw new ProviderNotFoundError();
        const requestedAccounts = await provider.request({
          method: "eth_requestAccounts",
        });
        return requestedAccounts.map((x: string) => getAddress(x));
      case "wallet_addStarknetChain":
        return false;
      case "wallet_watchAsset":
        return false;
      case "wallet_switchStarknetChain": {
        if (!params) throw new Error("Params are missing");

        const { chainId } = params as SwitchStarknetChainParameters;

        this.switchChain(BigInt(chainId));
        return true;
      }
      case "wallet_addDeclareTransaction": {
        return false;
      }
      case "wallet_addInvokeTransaction": {
        if (!params) throw new Error("Params are missing");
        const { calls } = params as AddInvokeTransactionParameters;
        return await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: "0x0000000000000000000000000000000000750003",
              data: prepareTransactionData(calls),
            },
          ],
        });
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
        return provider.request({
          method: "eth_signTypedData_v4",
          params: [accounts[0], domain, message, primaryType, types],
        });
      }
      default:
        throw new Error("Unknown request type");
    }
  }

  async account(
    provider: ProviderOptions | ProviderInterface,
  ): Promise<AccountInterface> {
    //TODO: is returning an empty account okay?
    if (!this.available()) {
      throw new ConnectorNotFoundError();
    }
    return new Account(provider, "", "");
  }

  // Listeners for wallet events

  protected async onAccountsChanged(accounts?: string[]) {
    if (!accounts) {
      this.disconnect();
      return;
    }
    // Disconnect if there are no accounts
    if (accounts.length === 0) {
      this.disconnect();
      return;
    }
    this.emit("change", {
      account: accounts[0],
    });
  }

  private async onChainChanged(chain: string) {
    const kakarotChainId = BigInt(chain);
    if (kakarotChainId === BigInt(kakarotSepolia.id)) {
      this.emit("change", { chainId: sepolia.id });
      return;
    } else if (kakarotChainId === BigInt(1)) {
      this.emit("change", { chainId: mainnet.id });
      return;
    }
    throw new Error(`Unknown chain id: ${kakarotChainId}`);
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
  private async onDisconnect(error: any) {
    const provider = await this.getProvider();

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
}

const prepareTransactionData = (calls: RequestCall[]) => {
  const encodedCalls = calls.map((call) => {
    return encodeAbiParameters(
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
  });

  const concatenatedCalls = encodedCalls.join("");
  const callCount = toHex(calls.length, { size: 32 });
  return `${callCount}${concatenatedCalls.slice(2)}` as `0x${string}`;
};
