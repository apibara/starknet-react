import { useMutation } from '@tanstack/react-query'
import { AccountInterface, InvokeFunctionResponse } from 'starknet'
import { useAccount } from './account'

/** Represents a contract call. */
export interface Call {
  /** The address of the contract. */
  contractAddress: string
  /** The selector of the function to invoke. */
  entrypoint: string
  /** The raw calldata. */
  calldata: unknown[]
}

/** Arguments for `useContractWrite`. */
export interface UseContractWriteArgs {
  /** List of smart contract calls to execute. */
  calls?: Call | Call[]
  /** Metadata associated with the transaction. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any
}

/** Value returned from `useContractWrite` */
export interface UseContractWriteResult {
  /** Data returned from the execute call. */
  data?: string
  /** True if the execute call is being executed. */
  isLoading: boolean
  /** Error while running execute. */
  error?: unknown
  /** Reset the hook state. */
  reset: () => void
  /** Execute the calls. */
  write: ((args?: UseContractWriteArgs) => void) | undefined
  writeAsync: ((args?: UseContractWriteArgs) => Promise<InvokeFunctionResponse>) | undefined
  isError: boolean
  isIdle: boolean
  isSuccess: boolean
  status: 'idle' | 'error' | 'loading' | 'success'
}

/**
 * Hook to perform a StarkNet multicall.
 *
 * @remarks
 *
 * Multicalls are used to submit multiple transactions in a single
 * call to improve user experience.
 *
 * @example
 * This example shows how to dynamically add transactions to the multicall.
 * ```tsx
 * function Component() {
 *   const { address } = useAccount()
 *   const [count, setCount] = useState(0)
 *
 *   const calls = useMemo(() => {
 *     const tx = {
 *       contractAddress: ethAddress,
 *       entrypoint: 'transfer',
 *       calldata: [address, 1, 0]
 *     }
 *     return Array(count).fill(tx)
 *   }, [address, count])
 *
 *   const { execute } = useContractWrite({ calls })
 *
 *   const inc = useCallback(
 *     () => setCount(c => c + 1),
 *     [setCount]
 *   )
 *   const dec = useCallback(
 *     () => setCount(c => Math.max(c - 1, 0)),
 *     [setCount]
 *   )
 *
 *   return (
 *     <>
 *       <p>Sending {count} transactions</p>
 *       <p>
 *         <button onClick={dec}>Decrement</button>
 *         <button onClick={inc}>Increment</button>
 *       </p>
 *       <p>
 *         <button onClick={write}>Write</button>
 *       </p>
 *     </>
 *   )
 * }
 * ```
 */
export function useContractWrite({ calls, metadata }: UseContractWriteArgs) {
  const { account } = useAccount()
  const { data, isLoading, error, reset, mutate, mutateAsync, isIdle, isSuccess, status, isError } =
    useMutation(writeContract({ account, args: { calls, metadata } }))

  return {
    data,
    error: error ?? undefined,
    reset,
    write: mutate,
    writeAsync: mutateAsync,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    status,
  }
}

function writeContract({
  account,
  args,
}: {
  account?: AccountInterface
  args: UseContractWriteArgs
}) {
  return async () => {
    const { calls, metadata } = args
    if (account === undefined) {
      throw new Error('No connector connected')
    }
    if (calls === undefined) {
      throw new Error('No calls specified')
    }
    const response = await account.execute(calls)
    console.warn(`TODO: ignoring metadata`, metadata)
    return response
  }
}
