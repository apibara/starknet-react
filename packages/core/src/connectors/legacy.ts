import {
  Permission,
  type RequestFnCall,
  type RpcMessage,
  type RpcTypeToMessageMap,
  type WalletEventListener,
} from "@starknet-io/types-js";
import { mainnet, sepolia } from "@starknet-react/chains";
import type { AccountInterface, ProviderInterface } from "starknet";
import {
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  UserNotConnectedError,
  UserRejectedRequestError,
} from "../errors";
import {
  type ConnectArgs,
  Connector,
  type ConnectorData,
  type ConnectorIcons,
} from "./base";

export interface LegacyStarknetWindowObject {
  id: string;
  name: string;
  version: string;
  icon:
    | string
    | {
        dark: string;
        light: string;
      };
  provider?: ProviderInterface;
  account?: AccountInterface;
  on: WalletEventListener;
  off: WalletEventListener;
  enable: (options?: { starknetVersion?: "v4" | "v5" }) => Promise<string[]>;
  isPreauthorized: () => Promise<boolean>;
  selectedAddress?: string;
  chainId?: string;
  isConnected: boolean;
}

/** Injected connector options. */
export interface LegacyInjectedConnectorOptions {
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

//  Icons used when the injected wallet is not installed
//  Icons from media kits
const walletIcons = {
  argentX:
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA2NS4xOTUwOCA1Ny43MzU2MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjUuMTk1MDggNTcuNzM1NjI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkY4NzVCO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQwLjk4NTkyLDBIMjQuMjA4ODhjLTAuNTYsMC0xLjAxMDAxLDAuNDUxMDItMS4wMjE5NywxLjAxMjAyCgljLTAuMzM4OTksMTUuNzU1LTguNTgyMDMsMzAuNzA4OTgtMjIuNzcwMDIsNDEuMzAwOTljLTAuNDUwMDEsMC4zMzcwMS0wLjU1Mjk4LDAuOTY3OTktMC4yMjQsMS40MjNsOS44MTU5OCwxMy41NzMKCWMwLjMzNDA1LDAuNDYyMDEsMC45ODUwNSwwLjU2NTk4LDEuNDQyOTksMC4yMjY5OWM4Ljg3MTAzLTYuNTc5MDEsMTYuMDA3MDItMTQuNTE3LDIxLjE0NjA2LTIzLjMxNQoJYzUuMTM4LDguNzk4LDEyLjI3Mzk5LDE2LjczNTk5LDIxLjE0NiwyMy4zMTVjMC40NTY5NywwLjMzODk5LDEuMTA3OTcsMC4yMzUwMiwxLjQ0MTk2LTAuMjI2OTlsOS44MTYwNC0xMy41NzMKCWMwLjMyODk4LTAuNDU1MDIsMC4yMjY5OS0xLjA4Ni0wLjIyNC0xLjQyM0M1MC41ODk4NiwzMS43MjEwMSw0Mi4zNDY4OCwxNi43NjcwMyw0Mi4wMDc4OSwxLjAxMjAyCglDNDEuOTk1ODcsMC40NTEwMiw0MS41NDY4OSwwLDQwLjk4NTkyLDAiLz4KPC9zdmc+Cg==",
  braavos:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zMjMuNDQgNDEuMzg4NkMzMjQuMTk4IDQyLjY3MjggMzIzLjE5NSA0NC4yNjAzIDMyMS43MDQgNDQuMjYwM0MyOTEuNTEgNDQuMjYwMyAyNjYuOTY1IDY4LjE2NTYgMjY2LjM4OSA5Ny44NzFDMjU2LjA1IDk1Ljk0MDcgMjQ1LjMzNyA5NS43OTU2IDIzNC43NTQgOTcuNTc4N0MyMzQuMDIzIDY4LjAwOSAyMDkuNTQgNDQuMjYwMyAxNzkuNDQ1IDQ0LjI2MDNDMTc3Ljk1MyA0NC4yNjAzIDE3Ni45NDkgNDIuNjcxNiAxNzcuNzA3IDQxLjM4NjVDMTkyLjMyMyAxNi42MzMgMjE5LjQ4MyAwIDI1MC41NzMgMEMyODEuNjY0IDAgMzA4LjgyNCAxNi42MzM5IDMyMy40NCA0MS4zODg2WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzIzMjRfNjE4NjkpIi8+CjxwYXRoIGQ9Ik00MTguNzU2IDIyNi44OTRDNDI2LjM3IDIyOS4yIDQzMy41ODEgMjIyLjUxNyA0MzEuMDM2IDIxNC45NzlDNDA0LjUwNyAxMzYuNDAxIDMxNi41MzUgMTA0LjM1OCAyNTAuMTU5IDEwNC4zNThDMTgzLjY3NCAxMDQuMzU4IDkzLjczOTEgMTM3LjQxOCA2OS4zMDUxIDIxNS4zMzFDNjYuOTU3NCAyMjIuODE4IDc0LjE0NjUgMjI5LjI3NSA4MS42NDc5IDIyNi45NzdMMjQ0LjI1IDE3Ny4xNTFDMjQ3LjU2OSAxNzYuMTM0IDI1MS4xMTYgMTc2LjEyOCAyNTQuNDM5IDE3Ny4xMzVMNDE4Ljc1NiAyMjYuODk0WiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzIzMjRfNjE4NjkpIi8+CjxwYXRoIGQ9Ik02OS43MTY1IDIzOS40MjZMMjQ0LjM3IDE4Ni40NTZDMjQ3LjY2OSAxODUuNDU2IDI1MS4xOTEgMTg1LjQ1MyAyNTQuNDkyIDE4Ni40NDhMNDMwLjIzMiAyMzkuNDUyQzQ0NC43NiAyNDMuODMzIDQ1NC43MDEgMjU3LjIxNiA0NTQuNzAxIDI3Mi4zOVY0MzAuNDgxQzQ1NC4wMjggNDY5LjA3IDQxOS4zNjIgNTAwIDM4MC43ODYgNTAwSDMxNi43MTJDMzEwLjM3OSA1MDAgMzA1LjI1IDQ5NC44NzcgMzA1LjI1IDQ4OC41NDNWNDMzLjExNUMzMDUuMjUgNDExLjI4OSAzMTguMTY3IDM5MS41MzUgMzM4LjE1NSAzODIuNzkyQzM2NC45NDkgMzcxLjA3MSAzOTYuNjQ2IDM1NS4yMTggNDAyLjYwOCAzMjMuNDA2QzQwNC41MzIgMzEzLjEzOCAzOTcuODM3IDMwMy4yMzQgMzg3LjU5NSAzMDEuMTk4QzM2MS42OTkgMjk2LjA1MSAzMzIuOTg5IDI5OC4wMzkgMzA4LjcxMSAzMDguODk4QzI4MS4xNSAzMjEuMjI1IDI3My45NCAzNDEuNzMxIDI3MS4yNzEgMzY5LjI3TDI2OC4wMzYgMzk4LjkzOEMyNjcuMDQ3IDQwOC4wMDUgMjU4LjU0NiA0MTQuOTUyIDI0OS40MjkgNDE0Ljk1MkMyMzkuOTk4IDQxNC45NTIgMjMyLjkyNiA0MDcuNzY5IDIzMS45MDMgMzk4LjM4OEwyMjguNzI4IDM2OS4yN0MyMjYuNDQyIDM0NS42ODEgMjIyLjI5OCAzMjIuNzY3IDE5Ny45MTIgMzExLjg2QzE3MC4wOTUgMjk5LjQxOSAxNDIuMTQxIDI5NS4yODcgMTEyLjQwNCAzMDEuMTk4QzEwMi4xNjIgMzAzLjIzNCA5NS40NjcgMzEzLjEzOCA5Ny4zOTEzIDMyMy40MDZDMTAzLjQwNSAzNTUuNDk1IDEzNC44NTQgMzcwLjk4NSAxNjEuODQ0IDM4Mi43OTJDMTgxLjgzMyAzOTEuNTM1IDE5NC43NSA0MTEuMjg5IDE5NC43NSA0MzMuMTE1VjQ4OC41MzNDMTk0Ljc1IDQ5NC44NjcgMTg5LjYyMiA1MDAgMTgzLjI4OSA1MDBIMTE5LjIxNEM4MC42Mzc0IDUwMCA0NS45NzE2IDQ2OS4wNyA0NS4yOTc5IDQzMC40ODFWMjcyLjM0OUM0NS4yOTc5IDI1Ny4xOTQgNTUuMjE0MiAyNDMuODI0IDY5LjcxNjUgMjM5LjQyNloiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl8yMzI0XzYxODY5KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzIzMjRfNjE4NjkiIHgxPSIyNDUuOTg2IiB5MT0iLTI3IiB4Mj0iNDI1LjQ5NiIgeTI9IjUwMi4zNzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Y1RDQ1RSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk2MDAiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzIzMjRfNjE4NjkiIHgxPSIyNDUuOTg2IiB5MT0iLTI3IiB4Mj0iNDI1LjQ5NiIgeTI9IjUwMi4zNzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Y1RDQ1RSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk2MDAiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDJfbGluZWFyXzIzMjRfNjE4NjkiIHgxPSIyNDUuOTg2IiB5MT0iLTI3IiB4Mj0iNDI1LjQ5NiIgeTI9IjUwMi4zNzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Y1RDQ1RSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk2MDAiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4=",
};

export class LegacyInjectedConnector extends Connector {
  private _wallet?: LegacyStarknetWindowObject;
  private _options: LegacyInjectedConnectorOptions;

  constructor({ options }: { options: LegacyInjectedConnectorOptions }) {
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
    const defaultIcon = {
      dark:
        walletIcons[this.id as keyof typeof walletIcons] ||
        WALLET_NOT_FOUND_ICON_DARK,
      light:
        walletIcons[this.id as keyof typeof walletIcons] ||
        WALLET_NOT_FOUND_ICON_LIGHT,
    };

    return this._options.icon || this._wallet?.icon || defaultIcon;
  }

  available(): boolean {
    this.ensureWallet();
    return this._wallet !== undefined;
  }

  async chainId(): Promise<bigint> {
    this.ensureWallet();

    if (!this._wallet || !this._wallet.provider) {
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

  async connect(_args: ConnectArgs = {}): Promise<ConnectorData> {
    this.ensureWallet();

    if (!this._wallet) {
      throw new ConnectorNotFoundError();
    }

    let accounts: string[];
    try {
      accounts = await this._wallet.enable({ starknetVersion: "v5" });
    } catch {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError();
    }

    if (!this._wallet.isConnected || !this._wallet.account || !accounts) {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError();
    }

    this._wallet.on(
      "accountsChanged",
      async (accounts: string[] | undefined) => {
        if (!accounts) return;
        await this.onAccountsChanged(accounts);
      },
    );

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

  async request<T extends RpcMessage["type"]>(
    call: RequestFnCall<T>,
  ): Promise<RpcTypeToMessageMap[T]["result"]> {
    this.ensureWallet();

    if (!this._wallet) {
      throw new ConnectorNotConnectedError();
    }

    try {
      switch (call.type) {
        case "wallet_getPermissions": {
          if (this._wallet) {
            return [Permission.ACCOUNTS];
          }
          return [];
        }
        case "wallet_requestAccounts": {
          if (this._wallet.account) {
            return [this._wallet.account.address];
          }
          return [];
        }
        case "wallet_requestChainId": {
          if (this._wallet.chainId) {
            return this._wallet.chainId;
          }
          // @ts-ignore
          return null;
        }
        case "wallet_addInvokeTransaction": {
          if (!this._wallet) {
            throw new Error("Send transaction failed");
          }

          // @ts-ignore
          const calls = (call.params.calls ?? []).map(
            // @ts-ignore
            ({ calldata, contract_address, entry_point }) => ({
              calldata,
              contractAddress: contract_address,
              entrypoint: entry_point,
            }),
          );
          // @ts-ignore
          return await this._wallet.account?.execute(calls);
        }
        default: {
          throw new Error(`Wallet API method ${call.type} is not supported.`);
        }
      }
    } catch {
      throw new UserRejectedRequestError();
    }
  }

  private ensureWallet() {
    const installed = getAvailableWallets(globalThis);
    const wallet = installed.filter((w) => w.id === this._options.id)[0];
    if (wallet) {
      this._wallet = wallet;
    }
  }

  private async onAccountsChanged(accounts: string[] | string): Promise<void> {
    let account: string;
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
      case "SN_SEPOLIA":
        this.emit("change", { chainId: sepolia.id });
        break;
      // Braavos
      case "mainnet-alpha":
        this.emit("change", { chainId: mainnet.id });
        break;
      case "sepolia-alpha":
        this.emit("change", { chainId: sepolia.id });
        break;
      default:
        this.emit("change", {});
        break;
    }
  }
}

function getAvailableWallets(
  // biome-ignore lint: window could contain anything
  obj: Record<string, any>,
): LegacyStarknetWindowObject[] {
  return Object.values(
    Object.getOwnPropertyNames(obj).reduce<
      Record<string, LegacyStarknetWindowObject>
    >((wallets, key) => {
      if (key.startsWith("starknet")) {
        const wallet = obj[key];

        if (isWalletObject(wallet) && !wallets[wallet.id]) {
          wallets[wallet.id] = wallet as LegacyStarknetWindowObject;
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
