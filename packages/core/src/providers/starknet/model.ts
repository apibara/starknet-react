import { defaultProvider, ProviderInterface } from 'starknet'
import { Connector } from '../../connectors'

export interface StarknetState {
  account?: string
  connect: (connector: Connector) => void
  disconnect: (connector: Connector) => void
  library: ProviderInterface
  connectors: Connector[]
  error?: Error
}

export const STARKNET_INITIAL_STATE: StarknetState = {
  account: undefined,
  connect: () => undefined,
  disconnect: () => undefined,
  library: defaultProvider,
  connectors: [],
}
