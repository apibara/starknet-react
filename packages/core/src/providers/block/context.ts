import { createContext, useContext } from 'react'
import { GetBlockResponse } from 'starknet'

export const StarknetBlockContext = createContext<GetBlockResponse | undefined>(undefined)

export function useStarknetBlock(): GetBlockResponse | undefined {
  return useContext(StarknetBlockContext)
}
