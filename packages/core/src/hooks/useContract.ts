import { Abi, TypedContract } from "abi-wan-kanabi";
import {
  ExtractAbiFunctionNames,
  FunctionArgs,
  FunctionRet,
} from "abi-wan-kanabi/dist/kanabi";
import { useMemo } from "react";
import { CallOptions, Contract, ProviderInterface } from "starknet";

import { useStarknet } from "~/context/starknet";

// did this because "Omit" wont work directly over an abstract class
type _Contract = {
  [K in keyof Contract]: Contract[K];
};

export type StarknetTypedContract<TAbi extends Abi> = TypedContract<TAbi> &
  Omit<_Contract, "populate" | "populateTransaction" | "call"> & {
    call<TFunctionName extends ExtractAbiFunctionNames<TAbi>>(
      method: TFunctionName,
      args?: FunctionArgs<TAbi, TFunctionName>,
      options?: CallOptions
    ): Promise<FunctionRet<TAbi, TFunctionName>>;
  };

/** Arguments for `useContract`. */
export interface UseContractArgs<TAbi extends Abi> {
  /** The contract abi
   * @remarks
   *
   * You must pass ABI as a const
   *
   * @example
   * abi: [
   *   {
   *     type: "function",
   *     name: "fn_simple_array",
   *     inputs: [
   *       {
   *         name: "arg",
   *         type: "core::array::Array::<core::integer::u8>",
   *       },
   *     ],
   *     outputs: [],
   *     state_mutability: "view",
   *   }
   *  ] as const
   *
   */
  abi?: TAbi;
  /** The contract address. */
  address?: string;
  /** The provider, by default it will be the current one. */
  provider?: ProviderInterface | null;
}

/** Value returned from `useContract`. */
export interface UseContractResult<TAbi extends Abi> {
  /** The contract. */
  contract?: StarknetTypedContract<TAbi>;
}

/**
 * Hook to bind a `Contract` instance.
 *
 * @remarks
 *
 * - The returned contract is a starknet.js `Contract` object.
 * - Must pass `abi` as const for strict type safety
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
export function useContract<TAbi extends Abi>({
  abi,
  address,
  provider: providedProvider,
}: UseContractArgs<TAbi>): UseContractResult<TAbi> {
  const { provider: currentProvider } = useStarknet();

  const contract = useMemo(() => {
    const provider = providedProvider ? providedProvider : currentProvider;
    if (abi && address && provider) {
      return new Contract(abi, address, provider).typedv2(abi);
    }
    return undefined;
  }, [abi, address, providedProvider, currentProvider]);

  return { contract };
}
