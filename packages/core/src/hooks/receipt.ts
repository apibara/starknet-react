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
 * If you need to refresh the transaction receipt data, set `watch: true` in
 * the props. The hook will periodically refresh the transaction data in the
 * background.
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
 * ```
 *
 * @example
 * This example shows how to submit a transaction and load its status.
 * ```tsx
 * function Component() {
 *   const { address } = useAccount()
 *   const [hash, setHash] = useState(undefined)
 *
 *   const { data, loading, error } = useTransactionReceipt({ hash, watch: true })
 *
 *   const { execute } = useStarknetExecute({
 *     calls: [{
 *       contractAddress: ethAddress,
 *       entrypoint: 'transfer',
 *       calldata: [address, 1, 0]
 *     }]
 *   })
 *
 *   const handleClick = () => {
 *     execute().then(tx => setHash(tx.transaction_hash))
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleClick}>Submit tx</button>
 *       <div>Hash: {hash}</div>
 *       {loading && <div>Loading...</div>}
 *       {error && <div>Error: {JSON.stringify(error)}</div>}
 *       {data && <div>Status: {data.status}</div>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useTransactionReceipt({
  hash,
  watch,
}: UseTransactionReceiptProps): UseTransactionReceiptResult {
  const { library } = useStarknet()
  const queryKey_ = useMemo(() => queryKey({ library, hash }), [library, hash])
  const { data, isLoading, error, refetch } = useQuery(
    queryKey_,
    fetchTransactionReceipt({ library, hash }),
    {
      enabled: !!hash,
      refetchInterval: (data, _query) => (watch ? refetchInterval(data) : false),
    }
  )

  useInvalidateOnBlock({ enabled: watch, queryKey: queryKey_ })

  return { data, loading: isLoading, error: error ?? undefined, refresh: refetch }
}

function queryKey({ library, hash }: { library: ProviderInterface; hash?: string }) {
  return [{ entity: 'transactionReceipt', chainId: library.chainId, hash }] as const
}

function fetchTransactionReceipt({ library, hash }: { library: ProviderInterface; hash?: string }) {
  return async () => {
    if (!hash) throw new Error('hash is required')
    return await library.getTransactionReceipt(hash)
  }
}

function refetchInterval(data: GetTransactionReceiptResponse | undefined) {
  if (data?.status === 'NOT_RECEIVED') return 500
  if (data?.status === 'RECEIVED') return 5000
  if (data?.status === 'PENDING') return 5000
  if (data?.status === 'ACCEPTED_ON_L2') return 60000
  if (data?.status === 'REJECTED') return false
  if (data?.status === 'ACCEPTED_ON_L1') return false
  return false
}
