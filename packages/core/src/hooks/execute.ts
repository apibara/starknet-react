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

/** Arguments for `useStarknetExecute`. */
export interface UseStarknetExecuteArgs {
  /** List of smart contract calls to execute. */
  calls?: Call | Call[]
  /** Metadata associated with the transaction. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any
}

/** Value returned from `useStarknetExecute` */
export interface UseStarknetExecute {
  /** Data returned from the execute call. */
  data?: string
  /** True if the execute call is being executed. */
  loading: boolean
  /** Error while running execute. */
  error?: unknown
  /** Reset the hook state. */
  reset: () => void
  /** Execute the calls. */
  execute: () => Promise<InvokeFunctionResponse | undefined>
}

/** Hook to perform a StarkNet multicall. */
export function useStarknetExecute({ calls, metadata }: UseStarknetExecuteArgs) {
  const { account } = useAccount()
  const { data, isLoading, error, reset, mutateAsync } = useMutation(
    writeContract({ account, args: { calls, metadata } })
  )

  return {
    data,
    loading: isLoading,
    error: error ?? undefined,
    reset,
    execute: mutateAsync,
  }
}

function writeContract({
  account,
  args,
}: {
  account?: AccountInterface
  args: UseStarknetExecuteArgs
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
