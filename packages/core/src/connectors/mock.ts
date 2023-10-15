import { goerli, mainnet } from "@starknet-react/chains";
import { AccountInterface } from "starknet";
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
  icon: ConnectorIcons;
  /** Whether the connector is available for use. */
  available?: boolean;
  /** Whether the connector should fail to connect. */
  failConnect?: boolean;
  /** Include account when switching chain. */
  unifiedSwitchAccountAndChain?: boolean;
  /** Emit change account event when switching chain. */
  emitChangeAccountOnChainSwitch?: boolean;
};

export type MockConnectorAccounts = {
  goerli: AccountInterface[];
  mainnet: AccountInterface[];
};

export class MockConnector extends Connector {
  private _accounts: MockConnectorAccounts;
  private _accountIndex = 0;
  private _options: MockConnectorOptions;
  private _connected = false;
  private _chainId: bigint = goerli.id;

  constructor({
    accounts,
    options,
  }: { accounts: MockConnectorAccounts; options: MockConnectorOptions }) {
    super();

    if (accounts.mainnet.length === 0 || accounts.goerli.length === 0) {
      throw new Error("MockConnector: accounts must not be empty");
    }

    this._accounts = accounts;
    this._options = options;
  }

  switchChain(chainId: bigint): void {
    this._chainId = chainId;
    this._accountIndex = 0;
    let account;
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
    return this._options.icon;
  }

  available(): boolean {
    return this._options.available ?? true;
  }

  async chainId(): Promise<bigint> {
    return this._chainId;
  }

  async ready(): Promise<boolean> {
    return this._connected;
  }

  async connect(): Promise<ConnectorData> {
    if (this._options.failConnect) {
      throw new UserRejectedRequestError();
    }

    this._connected = true;

    return {
      account: this._account.address,
      chainId: this._chainId,
    };
  }

  async disconnect(): Promise<void> {
    this._connected = false;

    this.emit("disconnect");
  }

  async account(): Promise<AccountInterface> {
    if (!this.available()) {
      throw new ConnectorNotFoundError();
    }

    if (!this._connected) {
      throw new ConnectorNotConnectedError();
    }

    return this._account;
  }

  private get _account(): AccountInterface {
    let account;
    if (this._chainId === mainnet.id) {
      account = this._accounts.mainnet[this._accountIndex];
    } else {
      account = this._accounts.goerli[this._accountIndex];
    }

    if (!account) {
      throw new ConnectorNotConnectedError();
    }

    return account;
  }
}
