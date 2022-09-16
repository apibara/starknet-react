import { useMemo } from 'react'
import { Abi, Contract } from 'starknet'
import { useStarknet } from '~/providers'

interface UseContractProps {
  abi?: Abi
  address?: string
}

interface UseContractResult {
  contract?: Contract
}

export function useContract({ abi, address }: UseContractProps): UseContractResult {
  const { library } = useStarknet()

  const contract = useMemo(() => {
    if (abi && address && library) {
      return new Contract(abi, address, library)
    }
  }, [abi, address, library])

  return { contract }
}
