import { Abi } from 'starknet'
import CounterAbiRaw from '../shared/counter.json'

export const CounterAbi = CounterAbiRaw as Abi[]
export const COUNTER_ADDRESS = '0x036486801b8f42e950824cba55b2df8cccb0af2497992f807a7e1d9abd2c6ba1'
