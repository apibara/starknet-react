import { useMemo } from "react";
import { Abi, Contract } from "starknet";

import { useStarknet } from "~/context/starknet";

/** Arguments for `useContract`. */
export interface UseContractArgs {
  /** The contract abi. */
  abi?: Abi;
  /** The contract address. */
  address?: string;
}

/** Value returned from `useContract`. */
export interface UseContractResult {
  /** The contract. */
  contract?: Contract;
}

/**
 * Hook to bind a `Contract` instance.
 *
 * @remarks
 *
 * The returned contract is a starknet.js `Contract` object.
 *
 * @example
 * This example creates a new contract from its address and abi.
 * ```tsx
 * function Component() {
 *   const { contract } = useContract({
 *     address: ethAddress,
 *     abi: compiledErc20.abi
 *   })
 *
 *   return <span>{contract.address}</span>
 * }
 * ```
 */
export function useContract({
  abi,
  address,
}: UseContractArgs): UseContractResult {
  const { provider } = useStarknet();

  const contract = useMemo(() => {
    if (abi && address && provider) {
      return new Contract(abi, address, provider);
    }
    return undefined;
  }, [abi, address, provider]);

  return { contract };
}
