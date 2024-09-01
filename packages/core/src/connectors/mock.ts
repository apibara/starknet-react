import {
  type AddDeclareTransactionParameters,
  type AddInvokeTransactionParameters,
  Permission,
  type Call as RequestCall,
  type RequestFnCall,
  type RpcMessage,
  type RpcTypeToMessageMap,
  type SwitchStarknetChainParameters,
  type TypedData,
} from "@starknet-io/types-js";
import { devnet, mainnet } from "@starknet-react/chains";
import type {
  AccountInterface,
  Call,
  ProviderInterface,
  ProviderOptions,
} from "starknet";
import {
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  UserRejectedRequestError,
} from "../errors";
import { Connector, type ConnectorData, type ConnectorIcons } from "./base";

export type MockConnectorOptions = {
  /** The wallet id. */
  id: string;
  /** Wallet human readable name. */
  name: string;
  /** Wallet icons. */
  icon?: ConnectorIcons;
  /** Whether the connector is available for use. */
  available?: boolean;
  /** Whether the connector should fail to connect. */
  failConnect?: boolean;
  /** Include account when switching chain. */
  unifiedSwitchAccountAndChain?: boolean;
  /** Emit change account event when switching chain. */
  emitChangeAccountOnChainSwitch?: boolean;
  /** Reject request calls */
  rejectRequest?: boolean;
};

export type MockConnectorAccounts = {
  sepolia: AccountInterface[];
  mainnet: AccountInterface[];
};

export class MockConnector extends Connector {
  private _accounts: MockConnectorAccounts;
  private _accountIndex = 0;
  private _connected = false;
  private _chainId: bigint = devnet.id;
  public options: MockConnectorOptions;

  constructor({
    accounts,
    options,
  }: {
    accounts: MockConnectorAccounts;
    options: MockConnectorOptions;
  }) {
    super();

    if (accounts.mainnet.length === 0 || accounts.sepolia.length === 0) {
      throw new Error("MockConnector: accounts must not be empty");
    }

    this._accounts = accounts;
    this.options = options;
  }

  switchChain(chainId: bigint): void {
    this._chainId = chainId;
    this._accountIndex = 0;
    let account: string | undefined;
    if (this.options.unifiedSwitchAccountAndChain) {
      account = this._account.address;
    }

    this.emit("change", { chainId, account });

    if (this.options.emitChangeAccountOnChainSwitch ?? true) {
      this.switchAccount(this._accountIndex);
    }
  }

  switchAccount(accountIndex: number): void {
    this._accountIndex = accountIndex;
    this.emit("change", { account: this._account.address });
  }

  get id(): string {
    return this.options.id;
  }

  get name(): string {
    return this.options.name;
  }

  get icon(): ConnectorIcons {
    return this.options.icon ?? "";
  }

  available(): boolean {
    return this.options.available ?? true;
  }

  async chainId(): Promise<bigint> {
    const chainIdHex = await this.request({ type: "wallet_requestChainId" });
    const chainId = BigInt(chainIdHex);
    return chainId;
  }

  async ready(): Promise<boolean> {
    const permissions: Permission[] = await this.request({
      type: "wallet_getPermissions",
    });
    if (!permissions?.includes(Permission.ACCOUNTS)) {
      return false;
    }

    return true;
  }

  async connect(): Promise<ConnectorData> {
    if (this.options.failConnect) {
      throw new UserRejectedRequestError();
    }

    this._connected = true;

    const accounts = await this.request({
      type: "wallet_requestAccounts",
      params: { silent_mode: true },
    });

    const chainId = await this.chainId();

    const [account] = accounts;

    return { account, chainId };
  }

  async disconnect(): Promise<void> {
    this._connected = false;

    this.emit("disconnect");
  }

  async request<T extends RpcMessage["type"]>(
    call: RequestFnCall<T>,
  ): Promise<RpcTypeToMessageMap[T]["result"]> {
    const { type, params } = call;

    if (!this.available()) {
      throw new ConnectorNotFoundError();
    }

    if (this.options.rejectRequest) {
      throw new UserRejectedRequestError();
    }

    switch (type) {
      case "wallet_requestChainId":
        return this._chainId.toString();
      case "wallet_getPermissions":
        if (this._connected) return [Permission.ACCOUNTS];
        return [];
      case "wallet_requestAccounts":
        return [this._account.address];
      case "wallet_addStarknetChain":
        return true;
      case "wallet_watchAsset":
        return true;
      case "wallet_switchStarknetChain": {
        if (!params) throw new Error("Params are missing");

        const { chainId } = params as SwitchStarknetChainParameters;

        this.switchChain(BigInt(chainId));

        return true;
      }
      case "wallet_addDeclareTransaction": {
        if (!params) throw new Error("Params are missing");

        const { compiled_class_hash, contract_class, class_hash } =
          params as AddDeclareTransactionParameters;

        return await this._account.declare({
          compiledClassHash: compiled_class_hash,
          contract: {
            ...contract_class,
            abi: JSON.parse(contract_class.abi),
          },
          classHash: class_hash,
        });
      }
      case "wallet_addInvokeTransaction": {
        if (!params) throw new Error("Params are missing");

        const { calls } = params as AddInvokeTransactionParameters;

        return await this._account.execute(transformCalls(calls));
      }
      case "wallet_signTypedData": {
        if (!params) throw new Error("Params are missing");

        const { domain, message, primaryType, types } = params as TypedData;

        return (await this._account.signMessage({
          domain,
          message,
          primaryType,
          types,
        })) as string[];
      }
      default:
        throw new Error("Unknown request type");
    }
  }

  async account(
    provider: ProviderOptions | ProviderInterface,
  ): Promise<AccountInterface> {
    if (!this.available()) {
      throw new ConnectorNotFoundError();
    }

    if (!this._connected) {
      throw new ConnectorNotConnectedError();
    }

    return this._account;
  }

  private get _account(): AccountInterface {
    let account: AccountInterface | undefined;
    if (this._chainId === mainnet.id) {
      account = this._accounts.mainnet[this._accountIndex];
    } else {
      account = this._accounts.sepolia[this._accountIndex];
    }

    if (!account) {
      throw new ConnectorNotConnectedError();
    }

    return account;
  }
}

function transformCalls(calls: RequestCall[]) {
  return calls.map(
    (call) =>
      ({
        contractAddress: call.contract_address,
        entrypoint: call.entry_point,
        calldata: call.calldata,
      }) as Call,
  );
}
