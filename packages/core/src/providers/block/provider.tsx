import React, { useCallback, useEffect, useState } from 'react'
import { GetBlockResponse } from 'starknet'

import { useStarknet } from '../starknet'

import { StarknetBlockContext } from './context'

interface StarknetBlockProviderProps {
  interval?: number
  children: React.ReactNode
}

export function StarknetBlockProvider({
  interval,
  children,
}: StarknetBlockProviderProps): JSX.Element {
  const { library } = useStarknet()

  const [block, setBlock] = useState<GetBlockResponse | undefined>(undefined)

  const fetchBlock = useCallback(() => {
    if (library) {
      library.getBlock().then(setBlock)
    }
  }, [library])

  useEffect(() => {
    fetchBlock()
    const intervalId = setInterval(() => {
      fetchBlock()
    }, interval ?? 5000)
    return () => clearInterval(intervalId)
  }, [fetchBlock, interval])

  return <StarknetBlockContext.Provider value={block}>{children}</StarknetBlockContext.Provider>
}
