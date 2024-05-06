import { Chain } from "@starknet-react/chains";
import { useMemo } from "react";
import { ArgsOrCalldata, BlockNumber, BlockTag, Contract } from "starknet";

import { UseQueryProps, UseQueryResult, useQuery } from "~/query";

import {
  Abi,
  ExtractAbiFunctionNames,
  FunctionArgs,
  FunctionRet,
} from "abi-wan-kanabi/dist/kanabi";

import { useInvalidateOnBlock } from "./useInvalidateOnBlock";
import { useNetwork } from "./useNetwork";

const DEFAULT_FETCH_INTERVAL = 5_000;

type ContractReadArgs = {
  /** The contract's function name. */
  functionName: string;
  /** Read arguments. */
  args?: ArgsOrCalldata;
  /** Block identifier used when performing call. */
  blockIdentifier?: BlockNumber;
};

type Result<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
> = FunctionRet<TAbi, TFunctionName>;

/** Options for `useContractRead`. */
export type UseContractReadProps<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
> = Omit<ContractReadArgs, "functionName" | "args"> &
  UseQueryProps<
    Result<TAbi, TFunctionName>,
    Error,
    Result<TAbi, TFunctionName>,
    ReturnType<typeof queryKey>
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
    args?: FunctionArgs<TAbi, TFunctionName>;
  };

/** Value returned from `useContractRead`. */
export type UseContractReadResult<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
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
export function useContractRead<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
>({
  abi,
  address,
  functionName,
  args,
  blockIdentifier = BlockTag.latest,
  refetchInterval: refetchInterval_,
  watch = false,
  enabled: enabled_ = true,
  ...props
}: UseContractReadProps<TAbi, TFunctionName>): UseContractReadResult<
  TAbi,
  TFunctionName
> {
  const { chain } = useNetwork();
  const contract =
    abi && address ? new Contract(abi, address).typedv2(abi) : undefined;

  const queryKey_ = useMemo(
    () =>
      queryKey({
        chain,
        contract,
        functionName,
        args: args as ArgsOrCalldata,
        blockIdentifier,
      }),
    [chain, contract, functionName, args, blockIdentifier]
  );

  const enabled = useMemo(
    () => Boolean(enabled_ && contract && functionName && args),
    [enabled_, contract, functionName, args]
  );

  const refetchInterval =
    refetchInterval_ ??
    (blockIdentifier === BlockTag.pending && watch
      ? DEFAULT_FETCH_INTERVAL
      : undefined);

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: queryKey_,
  });

  return useQuery({
    queryKey: queryKey_,
    queryFn: queryFn({
      contract,
      functionName,
      args: args as ArgsOrCalldata,
      blockIdentifier,
    }) as () => Promise<Result<TAbi, TFunctionName>>,
    refetchInterval,
    ...props,
  });
}

function queryKey({
  chain,
  contract,
  functionName,
  args,
  blockIdentifier,
}: { chain?: Chain; contract?: Contract } & ContractReadArgs) {
  return [
    {
      entity: "readContract",
      chainId: chain?.name,
      contract: contract?.address,
      functionName,
      args,
      blockIdentifier,
    },
  ] as const;
}

function queryFn({
  contract,
  functionName,
  args,
  blockIdentifier,
}: { contract?: Contract } & ContractReadArgs) {
  return async () => {
    if (!contract) throw new Error("contract is required");
    if (contract.functions[functionName] === undefined) {
      throw new Error(`function ${functionName} not found in contract`);
    }

    return contract.call(functionName, args, {
      parseRequest: true,
      parseResponse: true,
      blockIdentifier,
    });
  };
}
