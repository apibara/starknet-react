import { useMemo } from "react";
import { type Abi, type CompiledContract, ContractFactory } from "starknet";

import { useAccount } from "./use-account";

/** Arguments for `useContractFactory`. */
export interface UseContractFactoryProps {
  /** The compiled contract. */
  compiledContract?: CompiledContract;
  /** The class hash  */
  classHash: string;
  /** The contract abi. */
  abi?: Abi;
}

/** Value returned from `useContractFactory`. */
export interface UseContractFactoryResult {
  /** The contract factory. */
  contractFactory?: ContractFactory;
}

/**
 * Hook to create a `ContractFactory`.
 *
 * @remarks
 *
 * The returned contract factory is a starknet.js `ContractFactory` object.
 *
 * This hook works well with `useDeploy`.
 */
export function useContractFactory({
  compiledContract,
  classHash,
  abi,
}: UseContractFactoryProps): UseContractFactoryResult {
  const { account } = useAccount();

  const contractFactory = useMemo(() => {
    if (compiledContract && account && classHash) {
      return new ContractFactory({
        compiledContract,
        classHash,
        account,
        abi,
      });
    }
    return undefined;
  }, [compiledContract, classHash, account, abi]);

  return { contractFactory };
}
