import { useMemo } from 'react'
import { Abi, Contract } from 'starknet'
import { useStarknet } from '../providers/starknet'

interface UseContractArgs {
  abi?: Abi
  address?: string
}

interface UseContract {
  contract?: Contract
}

export function useContract({ abi, address }: UseContractArgs): UseContract {
  const { library } = useStarknet()

  const contract = useMemo(() => {
    if (abi && address && library) {
      return new Contract(abi, address, library)
    }
  }, [abi, address, library])

  return { contract }
}
