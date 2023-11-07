import { goerli, mainnet } from "@starknet-react/chains";
import { StarknetWindowObject } from "get-starknet-core";
import { AccountInterface } from "starknet";
import {
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  UserNotConnectedError,
  UserRejectedRequestError,
} from "../errors";
import { Connector, ConnectorData, ConnectorIcons } from "./base";

/** Injected connector options. */
export interface InjectedConnectorOptions {
  /** The wallet id. */
  id: string;
  /** Wallet human readable name. */
  name?: string;
  /** Wallet icons. */
  icon?: ConnectorIcons;
}

// Icons used when the injected wallet is not found and no icon is provided.
// question-mark-circle from heroicons with color changed to black/white.
const WALLET_NOT_FOUND_ICON_LIGHT =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iYmxhY2siPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTkuODc5IDcuNTE5YzEuMTcxLTEuMDI1IDMuMDcxLTEuMDI1IDQuMjQyIDAgMS4xNzIgMS4wMjUgMS4xNzIgMi42ODcgMCAzLjcxMi0uMjAzLjE3OS0uNDMuMzI2LS42Ny40NDItLjc0NS4zNjEtMS40NS45OTktMS40NSAxLjgyN3YuNzVNMjEgMTJhOSA5IDAgMTEtMTggMCA5IDkgMCAwMTE4IDB6bS05IDUuMjVoLjAwOHYuMDA4SDEydi0uMDA4eiIgLz4KPC9zdmc+";
const WALLET_NOT_FOUND_ICON_DARK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0id2hpdGUiPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTkuODc5IDcuNTE5YzEuMTcxLTEuMDI1IDMuMDcxLTEuMDI1IDQuMjQyIDAgMS4xNzIgMS4wMjUgMS4xNzIgMi42ODcgMCAzLjcxMi0uMjAzLjE3OS0uNDMuMzI2LS42Ny40NDItLjc0NS4zNjEtMS40NS45OTktMS40NSAxLjgyN3YuNzVNMjEgMTJhOSA5IDAgMTEtMTggMCA5IDkgMCAwMTE4IDB6bS05IDUuMjVoLjAwOHYuMDA4SDEydi0uMDA4eiIgLz4KPC9zdmc+Cg==";

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
    return this._options.name ?? this._wallet?.name ?? this._options.id;
  }

  get icon(): ConnectorIcons {
    let defaultIcon = {
      dark: WALLET_NOT_FOUND_ICON_DARK,
      light: WALLET_NOT_FOUND_ICON_LIGHT,
    };

    if (this._wallet?.icon) {
      defaultIcon = {
        dark: this._wallet.icon,
        light: this._wallet.icon,
      };
    }

    return this._options.icon ?? defaultIcon;
  }

  available(): boolean {
    this.ensureWallet();
    return this._wallet !== undefined;
  }

  async chainId(): Promise<bigint> {
    this.ensureWallet();

    if (!this._wallet) {
      throw new ConnectorNotConnectedError();
    }

    const chainIdHex = await this._wallet.provider.getChainId();
    const chainId = BigInt(chainIdHex);
    return chainId;
  }

  async ready(): Promise<boolean> {
    this.ensureWallet();

    if (!this._wallet) return false;
    return await this._wallet.isPreauthorized();
  }

  async connect(): Promise<ConnectorData> {
    this.ensureWallet();

    if (!this._wallet) {
      throw new ConnectorNotFoundError();
    }

    let accounts;
    try {
      accounts = await this._wallet.enable({ starknetVersion: "v5" });
    } catch {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError();
    }

    if (!this._wallet.isConnected || !accounts) {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError();
    }

    this._wallet.on("accountsChanged", async (accounts: string[] | string) => {
      await this.onAccountsChanged(accounts);
    });

    this._wallet.on("networkChanged", (network?: string) => {
      this.onNetworkChanged(network);
    });

    await this.onAccountsChanged(accounts);

    const account = this._wallet.account.address;
    const chainId = await this.chainId();

    this.emit("connect", { account, chainId });

    return {
      account,
      chainId,
    };
  }

  async disconnect(): Promise<void> {
    this.ensureWallet();

    if (!this.available()) {
      throw new ConnectorNotFoundError();
    }

    if (!this._wallet?.isConnected) {
      throw new UserNotConnectedError();
    }

    this.emit("disconnect");
  }

  async account(): Promise<AccountInterface> {
    this.ensureWallet();

    if (!this._wallet || !this._wallet.account) {
      throw new ConnectorNotConnectedError();
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

  private async onAccountsChanged(accounts: string[] | string): Promise<void> {
    let account;
    if (typeof accounts === "string") {
      account = accounts;
    } else {
      account = accounts[0];
    }

    if (account) {
      const chainId = await this.chainId();
      this.emit("change", { account, chainId });
    } else {
      this.emit("disconnect");
    }
  }

  private onNetworkChanged(network?: string): void {
    switch (network) {
      // Argent
      case "SN_MAIN":
        this.emit("change", { chainId: mainnet.id });
        break;
      case "SN_GOERLI":
        this.emit("change", { chainId: goerli.id });
        break;
      // Braavos
      case "mainnet-alpha":
        this.emit("change", { chainId: mainnet.id });
        break;
      case "goerli-alpha":
        this.emit("change", { chainId: goerli.id });
        break;
      default:
        this.emit("change", {});
        break;
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
