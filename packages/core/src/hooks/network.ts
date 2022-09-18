import { useMemo } from 'react'
import { StarknetChainId } from 'starknet/constants'
import { voyagerBlockExplorers } from '../constants/constants'
import { Chain } from '~/types'
import { useStarknet } from '..'
import { decodeShortString } from 'starknet/dist/utils/shortString'

interface UseNetwork {
  chain?: Chain
}

export function UseNetwork(): UseNetwork {
  const { library } = useStarknet()

  const chain = useMemo(() => {
    if (!library) {
      return undefined
    }

    const chainId = library?.chainId
    const chainName = decodeShortString(chainId)
    const blockExplorer = voyagerBlockExplorers[chainName]
    const testnet =
      chainId === StarknetChainId.MAINNET
        ? false
        : chainId === StarknetChainId.TESTNET
        ? true
        : undefined

    return { id: library.chainId, name: chainName, blockExplorer: blockExplorer, testnet: testnet }
  }, [library])

  return { chain: chain }
}
