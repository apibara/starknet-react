import { getStarknet } from '@argent/get-starknet'

import { Connector } from './index'
import {
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  UserRejectedRequestError,
} from '../errors'

type InjectedConnectorOptions = {
  showModal?: boolean
}

export class InjectedConnector extends Connector<InjectedConnectorOptions> {
  readonly id = 'injected'
  readonly name = 'ArgentX'

  constructor(options?: InjectedConnectorOptions) {
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

  async account() {
    if (!this.available()) {
      throw new ConnectorNotFoundError()
    }

    const starknet = getStarknet()
    return starknet.account
      ? Promise.resolve(starknet.account)
      : Promise.reject(new ConnectorNotConnectedError())
  }
}

export type EventHandler = (accounts: string[]) => void
