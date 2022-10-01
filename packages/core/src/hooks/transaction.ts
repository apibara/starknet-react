import { useQueries, useQuery } from '@tanstack/react-query'
import { GetTransactionResponse, ProviderInterface, GetTransactionReceiptResponse } from 'starknet'
import { useStarknet } from '../providers'

/** Arguments for the `useTransaction` hook. */
export interface UseTransactionProps {
  /** The transaction hash. */
  hash?: string
  /**
   * @optional
   * Callback function that will handle the transaction given the status "ACCEPTED_ON_L1".
   */
  onAcceptedOnL1?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "ACCEPTED_ON_L2".
   */
  onAcceptedOnL2?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "PENDING".
   */
  onPending?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "REJECTED".
   */
  onRejected?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "RECEIVED".
   */
  onReceived?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "NOT_RECEIVED".
   */
  onNotReceived?: (transaction: GetTransactionReceiptResponse) => void
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
export function useTransaction({
  hash,
  onAcceptedOnL1,
  onAcceptedOnL2,
  onNotReceived,
  onPending,
  onReceived,
  onRejected,
}: UseTransactionProps): UseTransactionResult {
  const { library } = useStarknet()
  const { data, isLoading, error } = useQuery(
    queryKey({ library, hash }),
    fetchTransaction({
      library,
      hash,
      onAcceptedOnL1,
      onAcceptedOnL2,
      onNotReceived,
      onPending,
      onReceived,
      onRejected,
    })
  )
  return { data, loading: isLoading, error: error ?? undefined }
}

/** Arguments for the `useTransactions` hook. */
export interface UseTransactionsProps {
  /** The transactions hashes. */
  hashes: string[]
  /**
   * @optional
   * Callback function that will handle the transaction given the status "ACCEPTED_ON_L1".
   */
  onAcceptedOnL1?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "ACCEPTED_ON_L2".
   */
  onAcceptedOnL2?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "PENDING".
   */
  onPending?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "REJECTED".
   */
  onRejected?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "RECEIVED".
   */
  onReceived?: (transaction: GetTransactionReceiptResponse) => void
  /**
   * @optional
   * Callback function that will handle the transaction given the status "NOT_RECEIVED".
   */
  onNotReceived?: (transaction: GetTransactionReceiptResponse) => void
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
export function useTransactions({
  hashes,
  onAcceptedOnL1,
  onAcceptedOnL2,
  onNotReceived,
  onPending,
  onReceived,
  onRejected,
}: UseTransactionsProps): UseTransactionResult[] {
  const { library } = useStarknet()
  const result = useQueries({
    queries: hashes.map((hash) => ({
      queryKey: queryKey({ library, hash }),
      queryFn: fetchTransaction({
        library,
        hash,
        onAcceptedOnL1,
        onAcceptedOnL2,
        onNotReceived,
        onPending,
        onReceived,
        onRejected,
      }),
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

interface FetchTransactionProps extends UseTransactionProps {
  library: ProviderInterface
}

function fetchTransaction({
  library,
  hash,
  onAcceptedOnL1,
  onAcceptedOnL2,
  onNotReceived,
  onPending,
  onReceived,
  onRejected,
}: FetchTransactionProps) {
  return async () => {
    if (!hash) throw new Error('hash is required')
    await fetchTransactionReceipt({
      library,
      hash,
      onAcceptedOnL1,
      onAcceptedOnL2,
      onNotReceived,
      onPending,
      onReceived,
      onRejected,
    })
    return await library.getTransaction(hash)
  }
}

interface FetchTransactionReceiptProps extends FetchTransactionProps {
  hash: string
}

async function fetchTransactionReceipt({
  library,
  hash,
  onAcceptedOnL1,
  onAcceptedOnL2,
  onNotReceived,
  onPending,
  onReceived,
  onRejected,
}: FetchTransactionReceiptProps): Promise<void> {
  const transactionReceiptResponse = await library.getTransactionReceipt(hash)
  const { status } = transactionReceiptResponse
  switch (status) {
    case 'ACCEPTED_ON_L1':
      if (onAcceptedOnL1) {
        onAcceptedOnL1(transactionReceiptResponse)
      }
      break
    case 'ACCEPTED_ON_L2':
      if (onAcceptedOnL2) {
        onAcceptedOnL2(transactionReceiptResponse)
      }
      break
    case 'NOT_RECEIVED':
      if (onNotReceived) {
        onNotReceived(transactionReceiptResponse)
      }
      break
    case 'PENDING':
      if (onPending) {
        onPending(transactionReceiptResponse)
      }
      break
    case 'RECEIVED':
      if (onReceived) {
        onReceived(transactionReceiptResponse)
      }
      break
    case 'REJECTED':
      if (onRejected) {
        onRejected(transactionReceiptResponse)
      }
      break
  }
}
