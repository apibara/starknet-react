import { useQuery } from '@tanstack/react-query'
import { Provider } from 'starknet'
import { useStarknet } from '../providers'

export interface StarkNameArgs {
  /** Account address. */
  address: string
  /** Naming contract to use . */
  contract?: string
}

export interface StarkNameResult {
  /** Stark name. */
  data?: string
  /** Error fetching name. */
  error?: unknown
  isIdle: boolean
  /** True if loading stark name. */
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  /** True if error while loading stark name. */
  isError: boolean
  isFetched: boolean
  isFetchedAfterMount: boolean
  isRefetching: boolean
  refetch: () => void
  status: 'idle' | 'error' | 'loading' | 'success'
}

/**
 * Hook for fetching Stark name for address.
 *
 * @remarks
 *
 * This hook fetches the stark name of the specified address.
 * It defaults to the starknet.id contract but a different contract can be
 * targetted by specifying its contract address
 * If address does not have a stark name, it will return "stark"
 *
 * @example
 * This example shows how to get the stark name of an address using the default
 * Starknet.id contract
 * ```tsx
 * function Component() {
 *   const address = '0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3'
 *   const { data, isLoading, isError } = useStarkName({ address })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error fetching name...</span>
 *   return <span>StarkName: {data}</span>
 * }
 * ```
 *
 *  @example
 * This example shows how to get the stark name of an address specifying a
 * different contract address
 * ```tsx
 * function Component() {
 *   const address = '0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3'
 *   const { data, isLoading, isError } = useStarkName({ address, contract: '0x1234' })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error fetching name...</span>
 *   return <span>StarkName: {data}</span>
 * }
 * ```
 */
export function useStarkName({ address, contract }: StarkNameArgs): StarkNameResult {
  const { library } = useStarknet()

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
    isStale: isIdle,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  } = useQuery({
    queryKey: ['starkName'],
    queryFn: async () => {
      const provider = new Provider(library)
      console.log('lookup ', address, ' on ', contract)
      const result = provider.getStarkName(address, contract)
      console.log('result', result)
      if (result instanceof Error) throw new Error(result.message)
      return result
    },
  })

  return {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    isIdle,
    isFetching,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  }
}

export interface AddressFromStarkNameArgs {
  /** Stark name. */
  name: string
  /** Naming contract to use . */
  contract?: string
}

export interface AddressFromStarkNameResult {
  /** Address. */
  data?: string
  /** Error fetching name. */
  error?: unknown
  isIdle: boolean
  /** True if loading stark name. */
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  /** True if error while loading stark name. */
  isError: boolean
  isFetched: boolean
  isFetchedAfterMount: boolean
  isRefetching: boolean
  refetch: () => void
  status: 'idle' | 'error' | 'loading' | 'success'
}

/**
 * Hook to get the address associated to a stark name.
 *
 * @remarks
 *
 * This hook fetches the address of the specified stark name
 * It defaults to the starknetID contract but a different contract can be targetted by specifying its address
 * If stark name does not have an associated address, it will return "0x0"
 *
 * @example
 * This example shows how to get the address associated to a stark name
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useAddressFromStarkName({ name: 'vitalik.stark' })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error fetching address...</span>
 *   return <span>address: {data}</span>
 * }
 * ```
 */
export function useAddressFromStarkName({
  name,
  contract,
}: AddressFromStarkNameArgs): AddressFromStarkNameResult {
  const { library } = useStarknet()

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
    isStale: isIdle,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  } = useQuery({
    queryKey: ['addressFromStarkName'],
    queryFn: async () => {
      const provider = new Provider(library)
      const result = provider.getAddressFromStarkName(name, contract)
      if (result instanceof Error) throw new Error(result.message)
      return result
    },
  })

  return {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    isIdle,
    isFetching,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  }
}

