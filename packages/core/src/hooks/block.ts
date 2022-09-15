import { useQuery } from '@tanstack/react-query'
import { GetBlockResponse, ProviderInterface } from 'starknet'
import { BlockIdentifier } from 'starknet/provider/utils'
import { useStarknet } from '~/providers'

export interface StarkNetBlockResult {
  data?: GetBlockResponse
  loading?: boolean
  error?: string
}

/**
 * @deprecated Use `useBlock`.
 */
export function useStarknetBlock(): StarkNetBlockResult {
  return useBlock({})
}

function fetchBlock({
  library,
  blockIdentifier,
}: {
  library: ProviderInterface
  blockIdentifier: BlockIdentifier
}): () => Promise<GetBlockResponse | undefined> {
  return async () => {
    return await library.getBlock(blockIdentifier)
  }
}

/**
 * Hook for fetching a block.
 */
export function useBlock({
  watch,
  refetchInterval: refreshInterval,
  blockIdentifier = 'latest',
}: {
  watch?: boolean
  refetchInterval?: number
  blockIdentifier?: BlockIdentifier
} = {}) {
  const { library } = useStarknet()

  const refetchInterval = watch ? refreshInterval ?? 5000 : false

  const { data, isLoading, isError } = useQuery<GetBlockResponse | undefined, string>(
    ['block', blockIdentifier],
    fetchBlock({ library, blockIdentifier }),
    {
      refetchInterval,
      useErrorBoundary: true,
    }
  )
  return { data, isLoading, isError }
}
