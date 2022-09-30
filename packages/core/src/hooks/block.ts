import { useQuery } from '@tanstack/react-query'
import { GetBlockResponse, ProviderInterface } from 'starknet'
import { BlockIdentifier } from 'starknet/provider/utils'
import { useStarknet } from '../providers'

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
 * Hook for fetching a block.
 *
 * @remarks
 *
 * This hook fetches the `latest` block using the default provider.
 * Block data is continuously refreshed in the background.
 *
 * @deprecated Use {@link useBlock}.
 *
 * @example
 * This example shows how to fetch the latest block.
 * ```tsx
 * function Component() {
 *   const { data, loading, error } = useStarknetBlock()
 *
 *   if (loading) return <span>Loading...</span>
 *   if (error) return <span>Error...</span>
 *   return <span>Hash: {data.block_hash}</span>
 * }
 * ```
 */
export function useStarknetBlock(): StarkNetBlockResult {
  const { data, isLoading, isError } = useBlock({
    blockIdentifier: 'latest',
  })

  return {
    data,
    loading: isLoading,
    error: isError ? 'error loading block number' : undefined,
  }
}

export interface FetchBlockArgs {
  /** Identifier for the block to fetch. */
  blockIdentifier: BlockIdentifier
}

/** Arguments for `useBlock`. */
export type UseBlockProps = Partial<FetchBlockArgs> & {
  /** How often to refresh the data. */
  refetchInterval?: number | false
  /** Callback fired every time a new block is fetched. */
  onSuccess?: (block: GetBlockResponse) => void
}

/** Value returned from `useBlock`. */
export interface UseBlockResult {
  /** Block data. */
  data?: GetBlockResponse
  /** True if loading block data. */
  isLoading: boolean
  /** True if error while loading data. */
  isError: boolean
  /** Error fetching block. */
  error?: unknown
}

/**
 * Hook for fetching a block.
 *
 * @remarks
 *
 * Specify which block to fetch with the `blockIdentifier` argument.
 * Control if and how often data is refreshed with `refetchInterval`.
 *
 * @example
 * This example shows how to fetch the latest block only once.
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useBlock({
 *     refetchInterval: false,
 *     blockIdentifier: 'latest'
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>Hash: {data.block_hash}</span>
 * }
 * ```
 *
 * @example
 * This example shows how to fetch the pending block every 3 seconds.
 * Use your browser network monitor to verify that the hook is refetching the
 * data.
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useBlock({
 *     refetchInterval: 3000,
 *     blockIdentifier: 'pending'
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>Hash: {data.block_hash}</span>
 * }
 * ```
 */
export function useBlock({
  refetchInterval,
  onSuccess,
  blockIdentifier = 'latest',
}: UseBlockProps = {}): UseBlockResult {
  const { library } = useStarknet()

  const { data, isLoading, isError, error } = useQuery<GetBlockResponse | undefined, string>(
    ['block', blockIdentifier],
    fetchBlock({ library, args: { blockIdentifier } }),
    {
      refetchInterval,
      useErrorBoundary: true,
      onSuccess: (block) => {
        if (block && onSuccess) onSuccess(block)
      },
    }
  )
  return { data, isLoading, isError, error }
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
