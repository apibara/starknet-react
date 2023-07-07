import { useEffect, useState } from 'react'
import { useStarknet } from '../providers'
import { chainById, Chain } from '../network'

/** Value returned from `useNetwork`. */
export interface UseNetworkResult {
  /** The current chain. */
  chain?: Chain
}

/**
 * Hook for accessing the current connected chain.
 *
 * @remarks
 *
 * The network object contains information about the
 * network.
 *
 * @example
 * This example shows how to display the current network name.
 * ```tsx
 * function Component() {
 *   const { chain } = useNetwork()
 *
 *   return <span>{chain && chain.name}</span>
 * }
 */
export function useNetwork(): UseNetworkResult {
  const { library } = useStarknet()
  const [chain, setChain] = useState<Chain>()

  useEffect(() => {
    if (library) {
      library.getChainId().then((chainId) => setChain(chainById(chainId)))
    } else {
      // library should be always defined, but if it's not then
      // we reset the chain to undefined.
      setChain(undefined)
    }
  }, [library])

  return { chain }
}
