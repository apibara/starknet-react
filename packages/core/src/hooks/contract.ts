import { useMemo } from 'react'
import {
  Abi,
  AccountInterface,
  CompiledContract,
  Contract,
  ContractFactory,
  ProviderInterface,
} from 'starknet'
import { useStarknet } from '~/providers'

/** Arguments for `useContract`. */
export interface UseContractProps {
  /** The contract abi. */
  abi?: Abi
  /** The contract address. */
  address?: string
}

/** Value returned from `useContract`. */
export interface UseContractResult {
  /** The contract. */
  contract?: Contract
}

/** Hook to bind a `Contract` instance. */
export function useContract({ abi, address }: UseContractProps): UseContractResult {
  const { library } = useStarknet()

  const contract = useMemo(() => {
    if (abi && address && library) {
      return new Contract(abi, address, library)
    }
  }, [abi, address, library])

  return { contract }
}

/** Arguments for `useContractFactory`. */
export interface UseContractFactoryProps {
  /** The compiled contract. */
  compiledContract?: CompiledContract
  /** The contract abi. */
  abi?: Abi
  /** The account or provider used for deploying. */
  providerOrAccount?: ProviderInterface | AccountInterface
}

/** Value returned from `useContractFactory`. */
export interface UseContractFactoryResult {
  /** The contract factory. */
  contractFactory?: ContractFactory
}

/** Hook to create a `ContractFactory`. */
export function useContractFactory({
  compiledContract,
  abi,
  providerOrAccount,
}: UseContractFactoryProps): UseContractFactoryResult {
  const contractFactory = useMemo(() => {
    if (compiledContract) {
      return new ContractFactory(compiledContract, providerOrAccount, abi)
    }
  }, [compiledContract, providerOrAccount, abi])

  return { contractFactory }
}
