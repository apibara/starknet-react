import { StarknetWindowObject } from "get-starknet-core";
import { AccountInterface } from "starknet";
import {
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  UserNotConnectedError,
  UserRejectedRequestError,
} from "../errors";
import { Connector, ConnectorIcons } from "./base";

/** Injected connector options. */
export interface InjectedConnectorOptions {
  /** The wallet id. */
  id: string;
  /** Wallet human readable name. */
  name: string;
  /** Wallet icons. */
  icon: ConnectorIcons;
}

export class InjectedConnector extends Connector {
  private _wallet?: StarknetWindowObject;
  private _options: InjectedConnectorOptions;

  constructor({ options }: { options: InjectedConnectorOptions }) {
    super();
    this._options = options;
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
    this.ensureWallet();
    return this._wallet !== undefined;
  }

  async ready(): Promise<boolean> {
    this.ensureWallet();

    if (!this._wallet) return false;
    return await this._wallet.isPreauthorized();
  }

  async connect(): Promise<AccountInterface> {
    this.ensureWallet();

    if (!this._wallet) {
      throw new ConnectorNotFoundError();
    }

    try {
      await this._wallet.enable({ starknetVersion: "v5" });
    } catch {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError();
    }

    if (!this._wallet.isConnected) {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError();
    }

    this._wallet.on("accountsChanged", (accounts: string[] | string) => {
      let account;
      if (typeof accounts === "string") {
        account = accounts;
      } else {
        account = accounts[0];
      }

      if (account) {
        this.emit("change", { account });
      } else {
        this.emit("disconnect");
      }
    });

    this._wallet.on("networkChanged", (_network?: string) => {
      // TODO: Handle network change.
    });

    return this._wallet.account;
  }

  async disconnect(): Promise<void> {
    this.ensureWallet();

    if (!this.available()) {
      throw new ConnectorNotFoundError();
    }

    if (!this._wallet?.isConnected) {
      throw new UserNotConnectedError();
    }
  }

  async account(): Promise<AccountInterface | null> {
    this.ensureWallet();

    if (!this._wallet) {
      throw new ConnectorNotConnectedError();
    }

    if (!this._wallet.account) {
      return null;
    }

    return this._wallet.account;
  }

  private ensureWallet() {
    const installed = getAvailableWallets(globalThis);
    const wallet = installed.filter((w) => w.id === this._options.id)[0];
    if (wallet) {
      this._wallet = wallet;
    }
  }
}

// biome-ignore lint: window could contain anything
function getAvailableWallets(obj: Record<string, any>): StarknetWindowObject[] {
  return Object.values(
    Object.getOwnPropertyNames(obj).reduce<
      Record<string, StarknetWindowObject>
    >((wallets, key) => {
      if (key.startsWith("starknet")) {
        const wallet = obj[key];

        if (isWalletObject(wallet) && !wallets[wallet.id]) {
          wallets[wallet.id] = wallet as StarknetWindowObject;
        }
      }
      return wallets;
    }, {}),
  );
}

// biome-ignore lint: wallet could be anything
function isWalletObject(wallet: any): boolean {
  try {
    return (
      wallet &&
      [
        // wallet's must have methods/members, see IStarknetWindowObject
        "request",
        "isConnected",
        "provider",
        "enable",
        "isPreauthorized",
        "on",
        "off",
        "version",
        "id",
        "name",
        "icon",
      ].every((key) => key in wallet)
    );
  } catch (err) {}
  return false;
}
