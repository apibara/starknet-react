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
  const [loading, setLoading] = useState<boolean | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  const fetchBlock = useCallback(() => {
    if (library) {
      library
        .getBlock()
        .then((newBlock) => {
          setBlock((oldBlock) => {
            // The new block is a different object from the old one
            // so simply updating the value of block would cause the state
            // to change and trigger a re-render.
            // This is especially bad because the block is used to trigger
            // state updates downstream.
            // Compare the new and old block hashes and update only if
            // they changed. Notice we use hashes and not block numbers
            // because we want to update the block in case of rollbacks.
            if (oldBlock?.block_hash === newBlock.block_hash) {
              return oldBlock
            }

            // Reset error and return new block.
            setError(undefined)
            return newBlock
          })
        })
        .catch(() => {
          setError('failed fetching block')
        })
        .finally(() => setLoading(false))
    }
  }, [library, setLoading, setError, setBlock])

  useEffect(() => {
    // Set to loading on first load
    setLoading(true)

    // Fetch block immediately
    fetchBlock()

    const intervalId = setInterval(() => {
      fetchBlock()
    }, interval ?? 5000)

    return () => clearInterval(intervalId)
  }, [fetchBlock, interval])

  return (
    <StarknetBlockContext.Provider value={{ data: block, loading, error }}>
      {children}
    </StarknetBlockContext.Provider>
  )
}
