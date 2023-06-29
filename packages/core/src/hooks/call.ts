import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Abi, ContractInterface } from 'starknet'
import { BlockNumber } from 'starknet'

import { useContract } from './contract'
import { useInvalidateOnBlock } from './invalidate'
import { useNetwork } from './network'
import { Chain } from '..'

/** Contract Read options. */
export interface UseContractReadOptions {
  /** Refresh data at every block. */
  watch?: boolean
  /** Block identifier used when performing call. */
  blockIdentifier?: BlockNumber
}

/** Arguments for `useContractRead`. */
export interface UseContractReadArgs<T extends unknown[]> {
  /** The target contract's ABI. */
  abi: Abi
  /** The target contract's address. */
  address: string
  /** The contract's function name. */
  functionName: string
  /** Read arguments. */
  args?: T
}

/** Value returned from `useContractRead`. */
export interface UseContractReadResult {
  /** Value returned from call. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Array<any>
  /** Error when performing call. */
  error?: unknown
  isIdle: boolean
  /** True when performing call. */
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  /** False when performing call. */
  isError: boolean
  isFetched: boolean
  isFetchedAfterMount: boolean
  /** True when performing call. */
  isRefetching: boolean
  /** Manually trigger refresh of data. */
  refetch: () => void
  status: 'idle' | 'error' | 'loading' | 'success'
}

/**
 * Hook to perform a read-only contract call.
 *
 * @remarks
 *
 * The hook only performs a call if the target `abi`, `address`,
 * `functionName`, and `args` are not undefined.
 *
 * @example
 * This example shows how to fetch the user ERC-20 balance.
 * ```tsx
 * function Component() {
 *   const { address } = useAccount()
 *   const { data, isLoading, error, refetch } = useContractRead({
 *     address: ethAddress,
 *     abi: compiledErc20.abi,
 *     functionName: 'balanceOf',
 *     args: [address],
 *     watch: false
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (error) return <span>Error: {JSON.stringify(error)}</span>
 *
 *   return (
 *     <div>
 *       <button onClick={refetch}>Refetch</button>
 *       <p>U256 high: {data.balance.high.toString()}</p>
 *       <p>U256 low: {data.balance.low.toString()}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useContractRead<T extends unknown[]>({
  abi,
  address,
  functionName,
  args,
  watch = false,
  blockIdentifier = 'pending',
}: UseContractReadArgs<T> & UseContractReadOptions): UseContractReadResult {
  const { chain } = useNetwork()
  const { contract } = useContract({ abi, address })

  const queryKey_ = useMemo(
    () => queryKey({ chain, args: { contract, functionName, args, blockIdentifier } }),
    [chain, contract, functionName, args, blockIdentifier]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useQuery<any | undefined>(
    queryKey_,
    readContract({ args: { contract, functionName, args, blockIdentifier } })
  )

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

interface ReadContractArgs {
  contract?: ContractInterface
  functionName?: string
  args?: unknown[]
  blockIdentifier: BlockNumber
}

function readContract({ args }: { args: ReadContractArgs }) {
  return async () => {
    if (!args.args || !args.contract || !args.functionName) return null
    const call = args.contract && args.functionName && args.contract[args.functionName]
    if (!call) return null

    return await call(...args.args, {
      blockIdentifier: args.blockIdentifier,
    })
  }
}

function queryKey({ chain, args }: { chain?: Chain; args: ReadContractArgs }) {
  const { contract, functionName, args: callArgs, blockIdentifier } = args
  return [
    {
      entity: 'readContract',
      chain,
      contract: contract?.address,
      functionName,
      args: callArgs,
      blockIdentifier,
    },
  ] as const
}
