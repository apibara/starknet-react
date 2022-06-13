import { AccountInterface } from 'starknet'
import { Connector } from './base'
import { IStarknetWindowObject } from 'get-starknet'
import {
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  UserNotConnectedError,
  UserRejectedRequestError,
} from '../errors'

export interface InjectedConnectorOptions {
  id: string
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

  async account(): Promise<AccountInterface> {
    this.ensureWallet()

    if (!this._wallet) {
      throw new ConnectorNotConnectedError()
    }

    // FIXME This type is wrong. account can be null if user didn't connect wallet
    return this._wallet.account
  }

  id(): string {
    this.ensureWallet()
    if (!this._wallet) {
      throw new ConnectorNotConnectedError()
    }
    return this._wallet.id
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
