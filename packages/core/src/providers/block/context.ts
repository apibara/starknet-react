import { createContext, useContext } from 'react'
import { GetBlockResponse } from 'starknet'

export interface StarknetBlock {
  data?: GetBlockResponse
  loading?: boolean
  error?: string
}

export const StarknetBlockContext = createContext<StarknetBlock>({})

export function useStarknetBlock(): StarknetBlock {
  return useContext(StarknetBlockContext)
}
