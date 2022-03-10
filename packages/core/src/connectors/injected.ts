import { getStarknet } from '@argent/get-starknet'

import { Connector } from './index'

export class InjectedConnector extends Connector {
  readonly id = 'injected'
  readonly name = 'argent'
  readonly ready = typeof window != 'undefined' && !!window.starknet

  private starknet = getStarknet()

  connect() {
    return Promise.resolve(this.starknet.signer)
  }
}
