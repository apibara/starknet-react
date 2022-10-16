import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { GetTransactionReceiptResponse, ProviderInterface } from 'starknet'
import { useStarknet } from '../providers'
import { useInvalidateOnBlock } from './invalidate'

/** Arguments for the `useTransactionReceipt` hook. */
export interface UseTransactionReceiptProps {
  /** The transaction hash. */
  hash?: string
  /** Refresh data at every block. */
  watch?: boolean
}

/** Value returned from `useTransactionReceipt`. */
export interface UseTransactionReceiptResult {
  /** The transaction receipt data. */
  data?: GetTransactionReceiptResponse
  /** True if fetching data. */
  loading: boolean
  /** Error while fetching the transaction receipt. */
  error?: unknown
  /** Manually trigger refresh of data. */
  refresh: () => void
}

/**
 * Hook to fetch a single transaction receipt.
 *
 * @remarks
 *
 * This hook keeps a cache of receipts by chain and transaction hash
 * so that you can use the hook freely in your application without worrying
 * about sending duplicate network requests.
 *
 * @example
 * This hook shows how to fetch a transaction receipt.
 * ```tsx
 * function Component() {
 *   const { data, loading, error } = useTransactionReceipt({ hash: txHash })
 *
 *   if (loading) return <span>Loading...</span>
 *   if (error) return <span>Error: {JSON.stringify(error)}</span>
 *   return <span>{data.status}</span>
 * }
 */
export function useTransactionReceipt({
  hash,
  watch,
}: UseTransactionReceiptProps): UseTransactionReceiptResult {
  const { library } = useStarknet()
  const queryKey_ = useMemo(() => queryKey({ library, hash }), [library, hash])
  const { data, isLoading, error, refetch } = useQuery(
    queryKey_,
    fetchTransactionReceipt({ library, hash })
  )

  useInvalidateOnBlock({ enabled: watch, queryKey: queryKey_ })

  return { data, loading: isLoading, error: error ?? undefined, refresh: refetch }
}

function queryKey({ library, hash }: { library: ProviderInterface; hash?: string }) {
  return [
    {
      entity: 'transactionReceipt',
      chainId: library.chainId,
      hash: hash,
    },
  ] as const
}

function fetchTransactionReceipt({ library, hash }: { library: ProviderInterface; hash?: string }) {
  return async () => {
    if (!hash) throw new Error('hash is required')
    return await library.getTransactionReceipt(hash)
  }
}
