import { useQuery } from '@tanstack/react-query'
import { GetBlockResponse, ProviderInterface, BlockNumber } from 'starknet'
import { useStarknet } from '../providers'

/** Value returned from `useStarknetBlock`. */
export interface StarkNetBlockResult {
  /** Block data. */
  data?: GetBlockResponse
  /** True if loading block. */
  isLoading?: boolean
  /** Error loading block. */
  error?: string
}

export interface FetchBlockArgs {
  /** Identifier for the block to fetch. */
  blockIdentifier: BlockNumber
}

/** Arguments for `useBlock`. */
export type UseBlockArgs = Partial<FetchBlockArgs> & {
  /** How often to refresh the data. */
  refetchInterval?: number | false
  /** Callback fired every time a new block is fetched. */
  onSuccess?: (block: GetBlockResponse) => void
}

/** Value returned from `useBlock`. */
export interface UseBlockResult {
  /** Block data. */
  data?: GetBlockResponse
  /** Error fetching block. */
  error?: unknown
  isIdle: boolean
  /** True if loading block data. */
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  /** True if error while loading data. */
  isError: boolean
  isFetched: boolean
  isFetchedAfterMount: boolean
  isRefetching: boolean
  refetch: () => void
  status: 'idle' | 'error' | 'loading' | 'success'
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
}: UseBlockArgs = {}): UseBlockResult {
  const { library } = useStarknet()

  const {
    data,
    error,
    isStale: isIdle,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  } = useQuery<GetBlockResponse | undefined, string>(
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
  return {
    data,
    error,
    isIdle,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  }
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

/** Arguments for `useBlockNumber`. */
export type UseBlockNumberArgs = Partial<FetchBlockArgs> & {
  /** How often to refresh the data. */
  refetchInterval?: number | false
  /** Callback fired every time a new block is fetched. */
  onSuccess?: (blockNumber: number) => void
}

/** Value returned from `useBlockNumber`. */
export interface UseBlockNumberResult {
  /** Block number. */
  data?: number
  /** Error fetching block. */
  error?: unknown
  isIdle: boolean
  /** True if loading block data. */
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  /** True if error while loading data. */
  isError: boolean
  isFetched: boolean
  isFetchedAfterMount: boolean
  isRefetching: boolean
  refetch: () => void
  status: 'idle' | 'error' | 'loading' | 'success'
}

/**
 * Hook for fetching the current block number.
 *
 * @remarks
 *
 * Control if and how often data is refreshed with `refetchInterval`.
 *
 * @example
 * This example shows how to fetch the current block only once.
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useBlockNumber({
 *     refetchInterval: false
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>Block number: {data}</span>
 * }
 * ```
 *
 * @example
 * This example shows how to fetch the current block every 3 seconds.
 * Use your browser network monitor to verify that the hook is refetching the
 * data.
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useBlockNumber({
 *     refetchInterval: 3000
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>Block Number: {data}</span>
 * }
 * ```
 */
export function useBlockNumber({
  refetchInterval,
  onSuccess,
}: UseBlockNumberArgs = {}): UseBlockNumberResult {
  const { library } = useStarknet()

  const {
    data,
    error,
    isStale: isIdle,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  } = useQuery<GetBlockResponse | undefined, string>(
    ['block', 'latest'],
    fetchBlock({ library, args: { blockIdentifier: 'latest' } }),
    {
      refetchInterval,
      useErrorBoundary: true,
      onSuccess: (block) => {
        if (block && onSuccess) onSuccess(block.block_number)
      },
    }
  )

  return {
    data: data?.block_number,
    error,
    isIdle,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  }
}
