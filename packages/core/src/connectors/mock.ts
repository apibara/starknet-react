import { devnet, mainnet } from "@starknet-react/chains";
import { AccountInterface, ProviderInterface, ProviderOptions } from "starknet";
import {
  AddDeclareTransactionResult,
  AddInvokeTransactionResult,
  Permission,
  RequestFnCall,
  RpcMessage,
  RpcTypeToMessageMap,
  Signature,
} from "starknet-types";
import {
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  UserRejectedRequestError,
} from "../errors";
import { Connector, ConnectorData, ConnectorIcons } from "./base";

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
  /** Reject request signing */
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
  _options: MockConnectorOptions;

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
    this._options = options;
  }

  switchChain(chainId: bigint): void {
    this._chainId = chainId;
    this._accountIndex = 0;
    let account: string | undefined;
    if (this._options.unifiedSwitchAccountAndChain) {
      account = this._account.address;
    }

    this.emit("change", { chainId, account });

    if (this._options.emitChangeAccountOnChainSwitch ?? true) {
      this.switchAccount(this._accountIndex);
    }
  }

  switchAccount(accountIndex: number): void {
    this._accountIndex = accountIndex;
    this.emit("change", { account: this._account.address });
  }

  get id(): string {
    return this._options.id;
  }

  get name(): string {
    return this._options.name;
  }

  get icon(): ConnectorIcons {
    return this._options.icon ?? "";
  }

  available(): boolean {
    return this._options.available ?? true;
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
    if (!permissions?.includes(Permission.Accounts)) {
      return false;
    }

    return true;
  }

  async connect(): Promise<ConnectorData> {
    if (this._options.failConnect) {
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

    if (this._options.rejectRequest) {
      throw new UserRejectedRequestError();
    }

    switch (type) {
      case "wallet_requestChainId":
        return this._chainId.toString();
      case "wallet_getPermissions":
        if (this._connected) return [Permission.Accounts];
        return [];
      case "wallet_requestAccounts":
        return [this._account.address];
      case "wallet_addStarknetChain":
        return true;
      case "wallet_switchStarknetChain":
        return true;
      case "wallet_addDeclareTransaction":
        // TODO
        return {
          class_hash: "",
          transaction_hash: "",
        } satisfies AddDeclareTransactionResult;
      case "wallet_addInvokeTransaction":
        // TODO
        return {
          transaction_hash: "",
        } satisfies AddInvokeTransactionResult;
      case "wallet_signTypedData":
        // TODO
        return [""] satisfies Signature;
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
