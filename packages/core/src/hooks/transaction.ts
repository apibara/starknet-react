import { useQueries, useQuery } from '@tanstack/react-query'
import { GetTransactionResponse, ProviderInterface } from 'starknet'
import { useStarknet } from '../providers'

/** Arguments for the `useTransaction` hook. */
export interface UseTransactionArgs {
  /** The transaction hash. */
  hash?: string
}

/** Value returned from `useTransaction`. */
export interface UseTransactionResult {
  /** The transaction data. */
  data?: GetTransactionResponse
  /** Error while fetching the transaction. */
  error?: unknown
  /** True if fetching data. */
  isLoading: boolean
  isIdle: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
  isFetched: boolean
  isFetchedAfterMount: boolean
  isRefetching: boolean
  refetch: () => void
  status: 'idle' | 'error' | 'loading' | 'success'
}

/**
 * Hook to fetch a single transaction.
 *
 * @remarks
 *
 * This hook keeps a cache of transactions by chain and transaction hash
 * so that you can use the hook freely in your application without worrying
 * about sending duplicate network requests.
 *
 * @example
 * This hook shows how to fetch a transaction.
 * ```tsx
 * function Component() {
 *   const { data, isLoading, error } = useTransaction({ hash: txHash })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (error) return <span>Error: {JSON.stringify(error)}</span>
 *   return <span>{data.transaction_hash}</span>
 * }
 */
export function useTransaction({ hash }: UseTransactionArgs): UseTransactionResult {
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
  } = useQuery(
    queryKey({ library, hash }),
    fetchTransaction({
      library,
      hash,
    })
  )

  return {
    data,
    error: error ?? undefined,
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

/** Arguments for the `useTransactions` hook. */
export interface UseTransactionsArgs {
  /** The transactions hashes. */
  hashes: string[]
}

/**
 * Hook to fetch a list of transactions in parallel.
 *
 * @remarks
 *
 * This hook fetches a dynamic list of transactions without
 * violating the rules of hooks.
 *
 * @example
 * This example shows how to fetch a list of transactions.
 * ```tsx
 * function Component() {
 *   const results = useTransactions({
 *     hashes: [txHash, txHash2]
 *   })
 *
 *   return (
 *     <ul>
 *       {results.map(({ data }, i) => (
 *         <li key={i}>
 *         {data ? data.transaction_hash : 'Loading...'}
 *         </li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useTransactions({ hashes }: UseTransactionsArgs): UseTransactionResult[] {
  const { library } = useStarknet()
  const result = useQueries({
    queries: hashes.map((hash) => ({
      queryKey: queryKey({ library, hash }),
      queryFn: fetchTransaction({
        library,
        hash,
      }),
    })),
  })

  return result.map(
    ({
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
    }) => ({
      data,
      error: error ?? undefined,
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
    })
  )
}

function queryKey({ library, hash }: { library: ProviderInterface; hash?: string }) {
  return [
    {
      entity: 'transaction',
      chainId: library.chainId,
      hash: hash,
    },
  ] as const
}

function fetchTransaction({ library, hash }: { library: ProviderInterface; hash?: string }) {
  return async () => {
    if (!hash) throw new Error('hash is required')
    return await library.getTransaction(hash)
  }
}
