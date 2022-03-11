import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import CounterAbi from '~/abi/counter.json'

export function useCounterContract() {
  return useContract({
    abi: CounterAbi as Abi,
    address: '0x036486801b8f42e950824cba55b2df8cccb0af2497992f807a7e1d9abd2c6ba1',
  })
}
