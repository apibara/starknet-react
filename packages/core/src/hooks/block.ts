import { useQuery } from '@tanstack/react-query'
import { GetBlockResponse, ProviderInterface } from 'starknet'
import { BlockIdentifier } from 'starknet/provider/utils'
import { useStarknet } from '~/providers'

/** Value returned from `useStarknetBlock`. */
export interface StarkNetBlockResult {
  /** Block data. */
  data?: GetBlockResponse
  /** True if loading block. */
  loading?: boolean
  /** Error loading block. */
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
  /** Identifier for the block to fetch. */
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

/** Arguments for `useBlock`. */
type UseBlockProps = Partial<FetchBlockArgs> & {
  /** If true, refresh data periodically. */
  watch?: boolean
  /** How often to refresh the data. */
  refreshInterval?: number
}

/** Value returned from `useBlock`. */
interface UseBlockResult {
  /** Block data. */
  data?: GetBlockResponse
  /** True if loading block data. */
  isLoading: boolean
  /** True if error while loading data. */
  isError: boolean
}

/**
 * Hook for fetching a block.
 *
 * @example
 * ```tsx
 * import { useBlock } from `@starknet-react/core`
 *
 * function Component() {
 *   const { data, isLoading, isError } = useBlock({
 *     blockIdentifier: 'latest'
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>Hash: {data?.block_hash}</span>
 * }
 * ```
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
