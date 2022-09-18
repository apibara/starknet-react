import { useMemo } from 'react'
import { useStarknet } from '..'
import { chainById, Chain } from '~/network'

/** Value returned from `useNetwork`. */
export interface UseNetworkResult {
  /** The current chain. */
  chain?: Chain
}

/** Hook for accessing the current connected chain. */
export function useNetwork(): UseNetworkResult {
  const { library } = useStarknet()

  const chain = useMemo(() => {
    if (!library) {
      return undefined
    }
    return chainById(library.chainId)
  }, [library])

  return { chain }
}
