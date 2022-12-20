import { useQuery } from '@tanstack/react-query'
import { ec, Account } from 'starknet'
import { useStarknet } from '../providers'

interface UseStarkNameProps {
  address: string
  contract?: string
}

/**
 * Hook to get the stark name of an address.
 *
 * @remarks
 *
 * This hook fetches the stark name of the specified address.
 * It defaults to the starknetID contract but a different contract can be targetted by specifying its address
 *
 * @example
 * This example shows how to get the stark name of an address
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useStarkName({ address })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>StarkName: {data}</span>
 * }
 * ```
 */
export function useStarkName({ address, contract }: UseStarkNameProps) {
  const { library } = useStarknet()

  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ['starkName'],
    queryFn: async () => {
      const account = new Account(library, address, ec.genKeyPair())
      const result = await account.getStarkName(contract)
      if (result instanceof Error) throw result
      return result
    },
  })

  return { data, isLoading, isSuccess, isError, error }
}

interface UseAddressFromStarkNameProps {
  name: string
  contract?: string
}

/**
 * Hook to get the address associated to a stark name.
 *
 * @remarks
 *
 * This hook fetches the address of the specified stark name
 * It defaults to the starknetID contract but a different contract can be targetted by specifying its address
 *
 * @example
 * This example shows how to get the address associated to a stark name
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useAddressFromStarkName({ name: 'vitalik.stark' })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>address: {data}</span>
 * }
 * ```
 */
export function useAddressFromStarkName({ name, contract }: UseAddressFromStarkNameProps) {
  const { library } = useStarknet()

  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ['addressFromStarkName'],
    queryFn: async () => {
      const keyPair = ec.genKeyPair()
      const account = new Account(library, ec.getStarkKey(keyPair), keyPair)
      const result = await account.getAddressFromStarkName(name, contract)
      if (result instanceof Error) throw result
      return result
    },
  })

  return { data, isLoading, isSuccess, isError, error }
}
