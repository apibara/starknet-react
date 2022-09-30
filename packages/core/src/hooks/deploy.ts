import { useMutation } from '@tanstack/react-query'
import { ContractFactory, RawCalldata, number, Contract } from 'starknet'

/** Arguments for `useDeploy`. */
export interface UseDeployProps {
  /** The contract factory. */
  contractFactory?: ContractFactory
  /** Calldata passed to the constructor. */
  constructorCalldata?: RawCalldata
  /** Salt used when generating the address. */
  addressSalt?: number.BigNumberish
}

/** Value returned from `useDeploy`. */
export interface UseDeployResult {
  /** The deployed contract. */
  data?: Contract
  /** True if deploying. */
  loading: boolean
  /** Error while deploying. */
  error?: unknown
  /** Reset hook state. */
  reset: () => void
  /** Send deploy transaction. */
  deploy: () => Promise<Contract | undefined>
}

/**
 * Hook to deploy a StarkNet contract.
 *
 * @remarks
 *
 * You should check that `contractFactory` is defined before calling `deploy`,
 * or the call will fail.
 *
 * The transaction is submitted from the provider passed to the contract factory,
 * so ensure to use the currently connected account.
 *
 * @example
 * This example shows how to deploy a contract from the currently connected account.
 * ```tsx
 * function Component() {
 *   const { account, address } = useAccount()
 *   const { contractFactory } = useContractFactory({
 *     compiledContract: compiledErc20,
 *     providerOrAccount: account
 *   })
 *
 *   // notice constructor args are felt encoded
 *   const constructorCalldata = useMemo(() => [
 *     encodeShortString('StarkNet React'), // name
 *     encodeShortString('SNR'), // symbol
 *     18, // decimals
 *     10000, // initial_supply.low
 *     0, // initial_supply.high
 *     address, // recipient
 *     address, // owner
 *   ], [address])
 *
 *   const { deploy, error } = useDeploy({
 *     contractFactory,
 *     constructorCalldata
 *   })
 *
 *   return (
 *     <>
 *       <button onClick={deploy}>Deploy contract</button>
 *       {error && <p>Error: {JSON.stringify(error)}</p>}
 *     </>
 *   )
 * }
 * ```
 */
export function useDeploy({
  contractFactory,
  constructorCalldata,
  addressSalt,
}: UseDeployProps): UseDeployResult {
  const { data, isLoading, error, reset, mutateAsync } = useMutation(
    deployContract({ contractFactory, constructorCalldata, addressSalt })
  )

  return {
    data,
    loading: isLoading,
    error: error ?? undefined,
    reset,
    deploy: mutateAsync,
  }
}

function deployContract({ contractFactory, constructorCalldata, addressSalt }: UseDeployProps) {
  return async () => {
    if (contractFactory === undefined) {
      throw new Error('No contract factory defined')
    }
    return await contractFactory.deploy(constructorCalldata, addressSalt)
  }
}
