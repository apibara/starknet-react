import { createContext, useContext } from 'react'

import { StarknetState, STARKNET_INITIAL_STATE } from './model'

export const StarknetContext = createContext<StarknetState>(STARKNET_INITIAL_STATE)

export function useStarknet(): StarknetState {
  return useContext(StarknetContext)
}
