import { Chain } from "@starknet-react/chains";
import { useMemo } from "react";
import {
  ArgsOrCalldata,
  BlockNumber,
  BlockTag,
  Contract,
  Result,
} from "starknet";
import type {
  Abi,
  ExtractAbiFunctionNames,
  FunctionArgs,
  FunctionRet,
} from "abi-wan-kanabi/kanabi";

import { UseQueryProps, UseQueryResult, useQuery } from "~/query";

import { useContract } from "./useContract";
import { useInvalidateOnBlock } from "./useInvalidateOnBlock";
import { useNetwork } from "./useNetwork";

const DEFAULT_FETCH_INTERVAL = 5_000;

type ContractReadArgs<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TArgs extends FunctionArgs<TAbi, TFunctionName>,
> = {
  /** The contract's function name. */
  functionName: TFunctionName;
  /** Read arguments. */
  args?: TArgs;
  /** Block identifier used when performing call. */
  blockIdentifier?: BlockNumber;
  /** Parse arguments before passing to contract. */
  parseArgs?: boolean;
  /** Parse result after calling contract. */
  parseResult?: boolean;
};

/** Options for `useContractRead`. */
export type UseContractReadProps<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TArgs extends FunctionArgs<TAbi, TFunctionName>,
> = ContractReadArgs<
  TAbi,
  TFunctionName,
  TArgs
> & /* UseQueryProps<Result, Error, Result, ReturnType<typeof queryKey>> & */ {
  /** The target contract's ABI. */
  abi?: TAbi;
  /** The target contract's address. */
  address?: string;
  /** Refresh data at every block. */
  watch?: boolean;
};

/** Value returned from `useContractRead`. */
export type UseContractReadResult<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TRet extends FunctionRet<TAbi, TFunctionName>,
> = UseQueryResult<TRet, Error>;

/**
 * Hook to perform a read-only contract call.
 *
 * @remarks
 *
 * The hook only performs a call if the target `abi`, `address`,
 * `functionName`, and `args` are not undefined.
 */
export function useContractRead<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TArgs extends FunctionArgs<TAbi, TFunctionName>,
  TRet extends FunctionRet<TAbi, TFunctionName>,
>({
  abi,
  address,
  functionName,
  args,
  blockIdentifier = BlockTag.latest,
  parseArgs,
  parseResult,
  // refetchInterval: refetchInterval_,
  watch = false,
  // enabled: enabled_ = true,
  ...props
}: UseContractReadProps<TAbi, TFunctionName, TArgs>): UseContractReadResult<
  TAbi,
  TFunctionName,
  TRet
> {
  const { chain } = useNetwork();
  const { contract } = useContract({ abi, address });

  const queryKey_ = useMemo(
    () =>
      queryKey<TAbi, TFunctionName, TArgs>({
        chain,
        contract,
        functionName,
        args,
        blockIdentifier,
      }),
    [chain, contract, functionName, args, blockIdentifier],
  );

  /*
  const enabled = useMemo(
    () => Boolean(enabled_ && contract && functionName && args),
    [enabled_, contract, functionName, args]
  );
  */
  const enabled = true;
  const refetchInterval_ = undefined;

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
    queryFn: queryFn<TAbi, TFunctionName, TArgs>({
      contract,
      functionName,
      args,
      blockIdentifier,
      parseArgs,
      parseResult,
    }),
    refetchInterval,
    ...props,
  });
}

function queryKey<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TArgs extends FunctionArgs<TAbi, TFunctionName>,
>({
  chain,
  contract,
  functionName,
  args,
  blockIdentifier,
}: { chain?: Chain; contract?: Contract } & ContractReadArgs<
  TAbi,
  TFunctionName,
  TArgs
>) {
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

function queryFn<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TArgs extends FunctionArgs<TAbi, TFunctionName>,
>({
  contract,
  functionName,
  args,
  blockIdentifier,
  parseArgs,
  parseResult,
}: { contract?: Contract } & ContractReadArgs<TAbi, TFunctionName, TArgs>) {
  return async function () {
    if (!contract) throw new Error("contract is required");
    if (contract.functions[functionName] === undefined) {
      throw new Error(`function ${functionName} not found in contract`);
    }

    return contract.call(functionName, args as unknown as ArgsOrCalldata, {
      parseRequest: parseArgs,
      parseResponse: parseResult,
      blockIdentifier,
    });
  };
}
