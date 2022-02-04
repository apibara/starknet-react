import { defaultProvider, ProviderInterface } from 'starknet'

export interface StarknetState {
  account?: string
  hasStarknet: boolean
  connectBrowserWallet: () => void
  library: ProviderInterface
  error?: string
}

export const STARKNET_INITIAL_STATE: StarknetState = {
  account: undefined,
  hasStarknet: false,
  connectBrowserWallet: () => undefined,
  library: defaultProvider,
}
