import { AccountInterface, ProviderInterface } from 'starknet'
import { Connector } from './base'
import {
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  UserNotConnectedError,
  UserRejectedRequestError,
} from '../errors'

/** Injected connector options. */
export interface InjectedConnectorOptions {
  /** The wallet id. */
  id: string
}

/** Wallet event type. */
export type EventType = 'accountsChanged' | 'networkChanged'

/** Wallet event handler. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventHandler = (data: any) => void

/** Interface implemented by all injected starknet wallets. */
export interface IStarknetWindowObject {
  enable: (options?: { showModal?: boolean }) => Promise<string[]>
  isPreauthorized: () => Promise<boolean>
  on: (event: EventType, handleEvent: EventHandler) => void
  off: (event: EventType, handleEvent: EventHandler) => void

  id: string
  name: string
  version: string
  icon: string
  provider: ProviderInterface
  isConnected: boolean
  account: AccountInterface
  selectedAddress?: string
}

export class InjectedConnector extends Connector<InjectedConnectorOptions> {
  private _wallet?: IStarknetWindowObject

  constructor({ options }: { options: InjectedConnectorOptions }) {
    super({ options })
  }

  available(): boolean {
    this.ensureWallet()
    return this._wallet !== undefined
  }

  async ready(): Promise<boolean> {
    this.ensureWallet()

    if (!this._wallet) return false
    return await this._wallet.isPreauthorized()
  }

  async connect(): Promise<AccountInterface> {
    this.ensureWallet()

    if (!this._wallet) {
      throw new ConnectorNotFoundError()
    }

    try {
      await this._wallet.enable()
    } catch {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError()
    }

    if (!this._wallet.isConnected) {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError()
    }

    return this._wallet.account
  }

  async disconnect(): Promise<void> {
    this.ensureWallet()

    if (!this.available()) {
      throw new ConnectorNotFoundError()
    }

    if (!this._wallet?.isConnected) {
      throw new UserNotConnectedError()
    }
  }

  async account(): Promise<AccountInterface | null> {
    this.ensureWallet()

    if (!this._wallet) {
      throw new ConnectorNotConnectedError()
    }

    if (!this._wallet.account) {
      return null
    }

    return this._wallet.account
  }

  id(): string {
    return this.options.id
  }

  name(): string {
    this.ensureWallet()
    if (!this._wallet) {
      throw new ConnectorNotConnectedError()
    }
    return this._wallet.name
  }

  private ensureWallet() {
    const installed = getInstalledWallets()
    const wallet = installed[this.options.id]
    if (wallet) {
      this._wallet = wallet
    }
  }
}

/**
 * Returns all injected connectors installed by the user.
 *
 * @remarks
 *
 * Because of how wallets are injected in the window context, this
 * function is not guaranteed to return the actual installed wallets.
 *
 * @deprecated
 *
 * Don't use this function for new applications, manually specify the supported
 * wallets instead.
 */
export function getInstalledInjectedConnectors(): InjectedConnector[] {
  const installed = Object.keys(getInstalledWallets())
  const shuffled = shuffle(installed)
  return shuffled.map((id) => new InjectedConnector({ options: { id } }))
}

// The code below comes from get-starknet and it's just to show what
// we need from that library
function getInstalledWallets(): Record<string, IStarknetWindowObject> {
  // no browser wallets on server
  if (typeof window === 'undefined') {
    return {}
  }

  return Object.getOwnPropertyNames(window).reduce<Record<string, IStarknetWindowObject>>(
    (wallets, key) => {
      if (key.startsWith('starknet')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wallet = (window as Record<string, any>)[key]
        if (isWalletObj(key, wallet) && !wallets[wallet.id]) {
          wallets[wallet.id] = wallet
        }
      }
      return wallets
    },
    {}
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isWalletObj = (key: string, wallet: any): boolean => {
  try {
    if (
      wallet &&
      [
        // wallet's must have methods/members, see IStarknetWindowObject
        'request',
        'isConnected',
        'provider',
        'enable',
        'isPreauthorized',
        'on',
        'off',
        'version',
      ].every((key) => key in wallet)
    ) {
      if (key === 'starknet' && (!wallet.id || !wallet.name || !wallet.icon)) {
        wallet.name = 'Argent X'
        wallet.icon = ''
      }

      // test for new fields only after attempting
      // to enrich the legacy wallet ->
      return ['id', 'name', 'icon'].every((key) => key in wallet)
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}
  return false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffle = <T extends any[]>(arr: T): T => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
