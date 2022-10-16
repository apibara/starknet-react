import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useBlock } from './block'

/**
 * Invalidate the given query on every new block.
 */
export function useInvalidateOnBlock({
  enabled,
  queryKey,
}: {
  enabled?: boolean
  queryKey: QueryKey
}) {
  const queryClient = useQueryClient()
  const [previousHash, setPreviousHash] = useState<string | undefined>(undefined)

  useBlock({
    refetchInterval: 5000,
    onSuccess: enabled
      ? async (block) => {
          if (block.block_hash !== previousHash) {
            await queryClient.invalidateQueries(queryKey, { refetchType: 'all' })
            setPreviousHash(block.block_hash)
          }
        }
      : undefined,
  })
}
