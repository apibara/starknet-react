import { useMutation } from '@tanstack/react-query'
import { ContractFactory, RawCalldata, num, Contract, CallData } from 'starknet'

/** Arguments for `useDeploy`. */
export interface UseDeployArgs {
  /** The contract factory. */
  contractFactory?: ContractFactory
  /** Calldata passed to the constructor. */
  constructorCalldata?: RawCalldata
  /** Salt used when generating the address. */
  addressSalt?: num.BigNumberish
}

/** Value returned from `useDeploy`. */
export interface UseDeployResult {
  /** The deployed contract. */
  data?: Contract
  /** True if deploying. */
  isLoading: boolean
  /** Error while deploying. */
  error?: unknown
  /** Reset hook state. */
  reset: () => void
  /** Send deploy transaction. */
  deploy: () => void | undefined
  deployAsync: () => Promise<Contract | undefined>
  isError: boolean
  isIdle: boolean
  isSuccess: boolean
  status: 'error' | 'idle' | 'loading' | 'success'
}

/**
 * Hook to deploy a Starknet contract.
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
 *     encodeShortString('Starknet React'), // name
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
}: UseDeployArgs): UseDeployResult {
  const { data, isLoading, error, reset, mutateAsync, mutate, isError, isIdle, isSuccess, status } =
    useMutation(deployContract({ contractFactory, constructorCalldata, addressSalt }))

  return {
    data,
    isLoading,
    error: error ?? undefined,
    reset,
    deploy: mutate,
    deployAsync: mutateAsync,
    isError,
    isIdle,
    isSuccess,
    status,
  }
}

function deployContract({ contractFactory, constructorCalldata, addressSalt }: UseDeployArgs) {
  return async () => {
    if (contractFactory === undefined) {
      throw new Error('No contract factory defined')
    }
    return await contractFactory.deploy(CallData.toCalldata(constructorCalldata), { addressSalt })
  }
}
