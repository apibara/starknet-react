import { useMutation } from '@tanstack/react-query'
import { ContractInterface, InvokeFunctionResponse, Overrides } from 'starknet'

/** Arguments for `useStarknetInvoke`. */
export interface UseStarknetInvokeArgs {
  /** The target contract. */
  contract?: ContractInterface
  /** The method name. */
  method?: string
}

/** Arguments for the `invoke` function. */
export interface InvokeArgs<T extends unknown[]> {
  /** The args the contract method is called with. */
  args: T
  /** Transaction overrides. */
  overrides?: Overrides
  /** Metadata associated with the transaction. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any
}

/** Value returned from `useStarknetInvoke` */
export interface UseStarknetInvokeResult<T extends unknown[]> {
  /** Data returned from the invoke call. */
  data?: InvokeFunctionResponse
  /** True if the execute call is being invoked. */
  loading: boolean
  /** Error while running invoke. */
  error?: unknown
  /** Reset the hook state. */
  reset: () => void
  /** Invoke the contract method. */
  invoke: ({ args, metadata }: InvokeArgs<T>) => Promise<InvokeFunctionResponse | undefined>
}

/**
 * Hook to invoke a smart contract method.
 *
 * @remarks
 *
 * This hook calls the `Contract.invoke` method under the hood.
 * Arguments should be encoded according to the starknet.js version
 * you're using.
 *
 * @deprecated Use {@link useStarknetExecute} instead.
 *
 * @example
 * This example shows how to transfer some ETH.
 * ```tsx
 * function Component() {
 *   const { address } = useAccount()
 *   const { contract } = useContract({
 *     abi: compiledErc20.abi,
 *     address: ethAddress,
 *   })
 *   const { invoke } = useStarknetInvoke({
 *     contract,
 *     method: 'transfer',
 *   })
 *
 *   return (
 *     <button onClick={() => invoke({ args: [address, [1, 0]] })}>
 *       Invoke
 *     </button>
 *   )
 * }
 * ```
 */
export function useStarknetInvoke<T extends unknown[]>({
  contract,
  method,
}: UseStarknetInvokeArgs): UseStarknetInvokeResult<T> {
  const { data, isLoading, error, reset, mutateAsync } = useMutation(
    writeContract({ contract, method })
  )

  return {
    data,
    loading: isLoading,
    error: error ?? undefined,
    reset,
    invoke: mutateAsync,
  }
}

function writeContract<T extends unknown[]>({
  contract,
  method,
}: {
  contract?: ContractInterface
  method?: string
}) {
  return async ({ args, metadata, overrides }: InvokeArgs<T>) => {
    if (contract === undefined) {
      throw new Error('No contract specified')
    }
    if (method === undefined) {
      throw new Error('No method specified')
    }
    const response = await contract.invoke(method, args, overrides)
    console.warn(`TODO: ignoring metadata`, metadata)
    return response
  }
}
