import { useEffect, useState } from 'react'
import { Abi, Contract } from 'starknet'
import { useStarknet } from '../providers/starknet'

export function useContract(
  abi: Abi[] | undefined,
  address: string | undefined
): Contract | undefined {
  const [contract, setContract] = useState<Contract | undefined>(undefined)
  const { library } = useStarknet()

  useEffect(() => {
    if (abi && address && library) {
      setContract(new Contract(abi, address, library))
    }
  }, [abi, address, library])

  return contract
}
