import { getStarknet } from 'get-starknet'

import { Connector } from './index'
import {
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  UserNotConnectedError,
  UserRejectedRequestError,
} from '../errors'

type InjectedConnectorOptions = {
  showModal?: boolean
}

export class InjectedConnector extends Connector<InjectedConnectorOptions> {
  constructor(options: InjectedConnectorOptions = {}) {
    super({ options })
  }

  available() {
    return getStarknet() !== undefined
  }

  async ready(): Promise<boolean> {
    if (!this.available()) {
      throw new ConnectorNotFoundError()
    }

    const starknet = getStarknet()
    return starknet.isPreauthorized()
  }

  async connect() {
    if (!this.available()) {
      throw new ConnectorNotFoundError()
    }

    const starknet = getStarknet()

    try {
      await starknet.enable(this.options)
    } catch {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError()
    }

    if (!starknet.isConnected) {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError()
    }

    return starknet.account
  }

  async disconnect(): Promise<void> {
    if (!this.available()) {
      throw new ConnectorNotFoundError()
    }

    const starknet = getStarknet()

    if (!starknet.isConnected) {
      throw new UserNotConnectedError()
    }

    starknet.off('accountsChanged', () => undefined)
  }

  async account() {
    if (!this.available()) {
      throw new ConnectorNotFoundError()
    }

    const starknet = getStarknet()
    return starknet.account
      ? Promise.resolve(starknet.account)
      : Promise.reject(new ConnectorNotConnectedError())
  }

  id(): string {
    return getStarknet().id ?? 'injected'
  }

  name(): string {
    if (!this.available()) {
      throw new ConnectorNotFoundError()
    }

    return getStarknet().name
  }
}

export type EventHandler = (accounts: string[]) => void
