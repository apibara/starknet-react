import { useQueries, useQuery } from '@tanstack/react-query'
import { GetTransactionResponse, ProviderInterface } from 'starknet'
import { useStarknet } from '../providers'

/** Arguments for the `useTransaction` hook. */
export interface UseTransactionProps {
  /** The transaction hash. */
  hash?: string
}

/** Value returned from `useTransaction`. */
export interface UseTransactionResult {
  /** The transaction data. */
  data?: GetTransactionResponse
  /** True if fetching data. */
  loading: boolean
  /** Error while fetching the transaction. */
  error?: unknown
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
 *   const { data, loading, error } = useTransaction({ hash: txHash })
 *
 *   if (loading) return <span>Loading...</span>
 *   if (error) return <span>Error: {JSON.stringify(error)}</span>
 *   return <span>{data.transaction_hash}</span>
 * }
 */
export function useTransaction({ hash }: UseTransactionProps): UseTransactionResult {
  const { library } = useStarknet()
  const { data, isLoading, error } = useQuery(
    queryKey({ library, hash }),
    fetchTransaction({ library, hash })
  )
  return { data, loading: isLoading, error: error ?? undefined }
}

/** Arguments for the `useTransactions` hook. */
export interface UseTransactionsProps {
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
export function useTransactions({ hashes }: UseTransactionsProps): UseTransactionResult[] {
  const { library } = useStarknet()
  const result = useQueries({
    queries: hashes.map((hash) => ({
      queryKey: queryKey({ library, hash }),
      queryFn: fetchTransaction({ library, hash }),
    })),
  })

  return result.map(({ data, isLoading, error }) => ({
    data,
    loading: isLoading,
    error: error ?? undefined,
  }))
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
