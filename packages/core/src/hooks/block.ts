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
  const { data, isLoading, isError } = useBlock()

  return {
    data,
    loading: isLoading,
    error: isError ? 'error loading block number' : undefined,
  }
}

interface FetchBlockArgs {
  blockIdentifier: BlockIdentifier
}

function fetchBlock({
  library,
  args,
}: {
  library: ProviderInterface
  args: FetchBlockArgs
}): () => Promise<GetBlockResponse | undefined> {
  return async () => {
    return await library.getBlock(args.blockIdentifier)
  }
}

type UseBlockProps = Partial<FetchBlockArgs> & {
  watch?: boolean
  refreshInterval?: number
}

interface UseBlockResult {
  data?: GetBlockResponse
  isLoading: boolean
  isError: boolean
}

/**
 * Hook for fetching a block.
 */
export function useBlock({
  watch,
  refreshInterval,
  blockIdentifier = 'latest',
}: UseBlockProps = {}): UseBlockResult {
  const { library } = useStarknet()

  const refetchInterval = watch ? refreshInterval ?? 5000 : false

  const { data, isLoading, isError } = useQuery<GetBlockResponse | undefined, string>(
    ['block', blockIdentifier],
    fetchBlock({ library, args: { blockIdentifier } }),
    {
      refetchInterval,
      useErrorBoundary: true,
    }
  )
  return { data, isLoading, isError }
}
