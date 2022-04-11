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

  constructor(options?: InjectedConnectorOptions) {
    super({ options })
  }

  async ready(): Promise<boolean> {
    if (globalThis['starknet'] === undefined) {
      throw new ConnectorNotFoundError()
    }

    const starknet = getStarknet()
    return starknet.isPreauthorized()
  }

  async connect() {
    const starknet = getStarknet()

    await this.ready()

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
    await this.ready()

    const starknet = getStarknet()
    return starknet.account
      ? Promise.resolve(starknet.account)
      : Promise.reject(new ConnectorNotConnectedError())
  }
}

export type EventHandler = (accounts: string[]) => void
