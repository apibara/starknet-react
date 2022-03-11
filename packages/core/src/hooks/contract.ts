import { useEffect, useState } from 'react'
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
  const [contract, setContract] = useState<Contract | undefined>(undefined)
  const { library } = useStarknet()

  useEffect(() => {
    if (abi && address && library) {
      setContract(new Contract(abi, address, library))
    }
  }, [abi, address, library])

  return { contract }
}
