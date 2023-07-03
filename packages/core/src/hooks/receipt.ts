import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { GetTransactionReceiptResponse, ProviderInterface } from 'starknet'
import { useStarknet } from '../providers'
import { Chain } from '../network'
import { useInvalidateOnBlock } from './invalidate'
import { useNetwork } from './network'

/** Arguments for the `useWaitForTransaction` hook. */
export interface UseWaitForTransactionArgs {
  /** The transaction hash. */
  hash?: string
  /** Refresh data at every block. */
  watch?: boolean
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

/** Value returned from `useWaitForTransaction`. */
export interface UseWaitForTransactionResult {
  /** The transaction receipt data. */
  data?: GetTransactionReceiptResponse
  /** Error while fetching the transaction receipt. */
  error?: unknown
  isIdle: boolean
  /** True if fetching data. */
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
  isFetched: boolean
  isFetchedAfterMount: boolean
  isRefetching: boolean
  /** Manually trigger refresh of data. */
  refetch: () => void
  status: 'idle' | 'error' | 'loading' | 'success'
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
 * If you need to refresh the transaction receipt data, set `watch: true` in
 * the props. The hook will periodically refresh the transaction data in the
 * background.
 *
 * @example
 * This hook shows how to fetch a transaction receipt.
 * ```tsx
 * function Component() {
 *   const { data, loading, error } = useWaitForTransaction({ hash: txHash })
 *
 *   if (loading) return <span>Loading...</span>
 *   if (error) return <span>Error: {JSON.stringify(error)}</span>
 *   return <span>{data && data.status}</span>
 * }
 * ```
 *
 * @example
 * This example shows how to submit a transaction and load its status.
 * ```tsx
 * function Component() {
 *   const { address } = useAccount()
 *   const [hash, setHash] = useState(undefined)
 *
 *   const { data, isLoading, error } = useWaitForTransaction({ hash, watch: true })
 *
 *   const { write } = useContractWrite({
 *     calls: [{
 *       contractAddress: ethAddress,
 *       entrypoint: 'transfer',
 *       calldata: [address, 1, 0]
 *     }]
 *   })
 *
 *   const handleClick = () => {
 *     write().then(tx => setHash(tx.transaction_hash))
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleClick}>Submit tx</button>
 *       <div>Hash: {hash}</div>
 *       {isLoading && <div>Loading...</div>}
 *       {error && <div>Error: {JSON.stringify(error)}</div>}
 *       {data && <div>Status: {data.status}</div>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useWaitForTransaction({
  hash,
  watch,
  onAcceptedOnL1,
  onAcceptedOnL2,
  onNotReceived,
  onPending,
  onReceived,
  onRejected,
}: UseWaitForTransactionArgs): UseWaitForTransactionResult {
  const { library } = useStarknet()
  const { chain } = useNetwork()
  const queryKey_ = useMemo(() => queryKey({ chain, hash }), [chain, hash])

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
  } = useQuery(queryKey_, fetchTransactionReceipt({ library, hash }), {
    enabled: !!hash,
    refetchInterval: (data, _query) => (watch ? refetchInterval(data) : false),
    onSuccess: (data) => {
      const { status } = data
      switch (status) {
        case 'ACCEPTED_ON_L1':
          if (onAcceptedOnL1) {
            onAcceptedOnL1(data)
          }
          break
        case 'ACCEPTED_ON_L2':
          if (onAcceptedOnL2) {
            onAcceptedOnL2(data)
          }
          break
        case 'NOT_RECEIVED':
          if (onNotReceived) {
            onNotReceived(data)
          }
          break
        case 'PENDING':
          if (onPending) {
            onPending(data)
          }
          break
        case 'RECEIVED':
          if (onReceived) {
            onReceived(data)
          }
          break
        case 'REJECTED':
          if (onRejected) {
            onRejected(data)
          }
          break
      }
    },
  })

  useInvalidateOnBlock({ enabled: watch, queryKey: queryKey_ })

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

function queryKey({ chain, hash }: { chain?: Chain; hash?: string }) {
  return [{ entity: 'transactionReceipt', chainId: chain?.id, hash }] as const
}

interface WaitForTransactionArgs {
  /** The transaction hash. */
  hash?: string
  library: ProviderInterface
}

function fetchTransactionReceipt({ library, hash }: WaitForTransactionArgs) {
  return async () => {
    if (!hash) throw new Error('hash is required')

    return await library.getTransactionReceipt(hash)
  }
}

function refetchInterval(data: GetTransactionReceiptResponse | undefined) {
  if (!data) return false
  const { status } = data
  switch (status) {
    case 'ACCEPTED_ON_L1':
      return false
    case 'ACCEPTED_ON_L2':
      return 60000
    case 'NOT_RECEIVED':
      return 500
    case 'PENDING':
      return 5000
    case 'RECEIVED':
      return 5000
    case 'REJECTED':
      return false
    default:
      return false
  }
}
