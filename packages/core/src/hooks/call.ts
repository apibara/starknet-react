import { useQuery } from '@tanstack/react-query'
import { ContractInterface, ProviderInterface } from 'starknet'
import { BlockIdentifier } from 'starknet/dist/provider/utils'

import { useStarknet } from '~/providers'

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

interface UseStarknetCallOptions {
  watch?: boolean
  blockIdentifier?: BlockIdentifier
}

interface UseStarknetCallProps<T extends unknown[]> {
  contract?: ContractInterface
  method?: string
  args?: T
  options?: UseStarknetCallOptions
}

export interface UseStarknetCallResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Array<any>
  loading: boolean
  error?: string
  refresh: () => void
}

export function useStarknetCall<T extends unknown[]>({
  contract,
  method,
  args,
  options,
}: UseStarknetCallProps<T>): UseStarknetCallResult {
  const { library } = useStarknet()

  const blockIdentifier = options?.blockIdentifier || 'pending'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading, isError } = useQuery<any | undefined>(
    queryKey({ library, args: { contract, method, args, blockIdentifier } }),
    readContract({ args: { contract, method, args, blockIdentifier } })
  )

  return {
    data,
    loading: isLoading,
    refresh: () => undefined,
    error: isError ? 'error performing call' : undefined,
  }
}
