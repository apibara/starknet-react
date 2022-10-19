import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { ContractInterface, ProviderInterface } from 'starknet'
import { BlockIdentifier } from 'starknet/dist/provider/utils'

import { useStarknet } from '../providers'
import { useInvalidateOnBlock } from './invalidate'

/** Call options. */
export interface UseStarknetCallOptions {
  /** Refresh data at every block. */
  watch?: boolean
  /** Block identifier used when performing call. */
  blockIdentifier?: BlockIdentifier
}

/** Arguments for `useStarknetCall`. */
export interface UseStarknetCallProps<T extends unknown[]> {
  /** The target contract. */
  contract?: ContractInterface
  /** The contract's method. */
  method?: string
  /** Call arguments. */
  args?: T
  /** Call options. */
  options?: UseStarknetCallOptions
}

/** Value returned from `useStarknetCall`. */
export interface UseStarknetCallResult {
  /** Value returned from call. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Array<any>
  /** True when performing call. */
  loading: boolean
  /** Error when performing call. */
  error?: string
  /** Manually trigger refresh of data. */
  refresh: () => void
  /** True when performing call. */
  refreshing: boolean
}

/**
 * Hook to perform a read-only contract call.
 *
 * @remarks
 *
 * The hook only performs a call if the target `contract`,
 * `method`, and `args` are not undefined.
 *
 * @example
 * This example shows how to fetch the user ERC-20 balance.
 * ```tsx
 * function Component() {
 *   const { contract } = useContract({
 *     address: ethAddress,
 *     abi: compiledErc20.abi
 *   })
 *   const { address } = useAccount()
 *   const { data, loading, error, refresh } = useStarknetCall({
 *     contract,
 *     method: 'balanceOf',
 *     args: [address],
 *     options: {
 *       watch: false
 *     }
 *   })
 *
 *   if (loading) return <span>Loading...</span>
 *   if (error) return <span>Error: {error}</span>
 *
 *   return (
 *     <div>
 *       <button onClick={refresh}>Refresh</button>
 *       <p>Balance: {JSON.stringify(data)}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useStarknetCall<T extends unknown[]>({
  contract,
  method,
  args,
  options,
}: UseStarknetCallProps<T>): UseStarknetCallResult {
  const { library } = useStarknet()

  const blockIdentifier = options?.blockIdentifier || 'pending'

  const queryKey_ = useMemo(
    () => queryKey({ library, args: { contract, method, args, blockIdentifier } }),
    [library, contract, method, args, blockIdentifier]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading, isError, refetch, isRefetching } = useQuery<any | undefined>(
    queryKey_,
    readContract({ args: { contract, method, args, blockIdentifier } })
  )

  useInvalidateOnBlock({ enabled: options?.watch, queryKey: queryKey_ })

  return {
    data,
    loading: isLoading,
    refreshing: isRefetching,
    refresh: refetch,
    error: isError ? 'error performing call' : undefined,
  }
}

interface ReadContractArgs {
  contract?: ContractInterface
  method?: string
  args?: unknown[]
  blockIdentifier: BlockIdentifier
}

function readContract({ args }: { args: ReadContractArgs }) {
  return async () => {
    if (!args.args || !args.contract || !args.method) return null
    const call = args.contract && args.method && args.contract[args.method]
    if (!call) return null

    return await call(...args.args, {
      blockIdentifier: args.blockIdentifier,
    })
  }
}

function queryKey({ library, args }: { library: ProviderInterface; args: ReadContractArgs }) {
  const { contract, method, args: callArgs, blockIdentifier } = args
  return [
    {
      entity: 'readContract',
      chainId: library.chainId,
      contract: contract?.address,
      method,
      args: callArgs,
      blockIdentifier,
    },
  ] as const
}
