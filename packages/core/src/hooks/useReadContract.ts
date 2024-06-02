import {
  Abi,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  ExtractArgs,
  FunctionRet,
} from "abi-wan-kanabi/dist/kanabi";
import { BlockNumber } from "starknet";

import { UseQueryProps, UseQueryResult } from "../query";

import { CallQueryKey, UseCallProps, useCall } from "./useCall";

type Result<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = FunctionRet<TAbi, TFunctionName>;

/** Options for `useReadContract`. */
export type UseReadContractProps<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = UseQueryProps<
  Result<TAbi, TFunctionName>,
  Error,
  Result<TAbi, TFunctionName>,
  ReturnType<CallQueryKey>
> & {
  /** The target contract's ABI.
   *
   * @remarks
   *
   * You must pass ABI as const
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
  /** The target contract's address. */
  address?: string;
  /** Refresh data at every block. */
  watch?: boolean;
  /** The contract's function name. */
  functionName: TFunctionName;
  /** Read arguments. */
  args?: ExtractArgs<TAbi, ExtractAbiFunction<TAbi, TFunctionName>>;
  /** Block identifier used when performing call. */
  blockIdentifier?: BlockNumber;
};

/** Value returned from `useReadContract`. */
export type UseReadContractResult<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = UseQueryResult<Result<TAbi, TFunctionName>, Error>;

/**
 * Hook to perform a read-only contract call.
 *
 * @remarks
 *
 * - The hook only performs a call if the target `abi`, `address`,
 * `functionName`, and `args` are not undefined.
 *
 * - You must pass `abi` as `const` for autocomplete to work.
 */
export function useReadContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
>(props: UseReadContractProps<TAbi, TFunctionName>) {
  return useCall(props as UseCallProps) as UseReadContractResult<
    TAbi,
    TFunctionName
  >;
}
