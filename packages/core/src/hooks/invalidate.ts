import { QueryKey, useQueryClient } from '@tanstack/react-query'
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
  useBlock({ onSuccess: enabled ? (_block) => queryClient.invalidateQueries(queryKey) : undefined })
}
