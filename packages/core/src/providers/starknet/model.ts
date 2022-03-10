import { defaultProvider, ProviderInterface } from 'starknet'
import { Connector } from '../../connectors'

export interface StarknetState {
  account?: string
  connect: (connector: Connector) => void
  library: ProviderInterface
  error?: string
}

export const STARKNET_INITIAL_STATE: StarknetState = {
  account: undefined,
  connect: () => undefined,
  library: defaultProvider,
}
