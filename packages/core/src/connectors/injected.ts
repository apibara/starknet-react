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
  readonly name = 'argent'
  static readonly ready = typeof window != 'undefined' && !!window.starknet

  private starknet = getStarknet()

  constructor(options?: InjectedConnectorOptions) {
    super({ options })
  }

  async connect() {
    if (!InjectedConnector.ready) {
      throw new ConnectorNotFoundError()
    }

    try {
      await this.starknet.enable(this.options)
    } catch {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError()
    }

    if (!this.starknet.isConnected) {
      // NOTE: Argent v3.0.0 swallows the `.enable` call on reject, so this won't get hit.
      throw new UserRejectedRequestError()
    }

    return this.starknet.account
  }

  account() {
    if (!InjectedConnector.ready) {
      throw new ConnectorNotFoundError()
    }

    return this.starknet.account
      ? Promise.resolve(this.starknet.account)
      : Promise.reject(new ConnectorNotConnectedError())
  }
}

export type EventHandler = (accounts: string[]) => void
