import type { Address, Chain } from "@starknet-react/chains";
import { useMemo } from "react";
import {
  type Abi,
  type ArgsOrCalldata,
  type BlockNumber,
  BlockTag,
  type Contract,
  type Result,
} from "starknet";

import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";
import { useContract } from "./use-contract";
import { useInvalidateOnBlock } from "./use-invalidate-on-block";
import { useNetwork } from "./use-network";

const DEFAULT_FETCH_INTERVAL = 5_000;

type CallArgs = {
  /** The contract's function name. */
  functionName: string;
  /** Read arguments. */
  args?: ArgsOrCalldata;
  /** Block identifier used when performing call. */
  blockIdentifier?: BlockNumber;
  /** Parse arguments before passing to contract. @default true */
  parseArgs?: boolean;
  /** Parse result after calling contract. @default true */
  parseResult?: boolean;
};

export type CallQueryKey = typeof queryKey;

/** Options for `useCall`. */
export type UseCallProps = CallArgs &
  UseQueryProps<Result, Error, Result, ReturnType<CallQueryKey>> & {
    /** The target contract's ABI. */
    abi?: Abi;
    /** The target contract's address. */
    address?: Address;
    /** Refresh data at every block. */
    watch?: boolean;
  };

/** Value returned from `useCall`. */
export type UseCallResult = UseQueryResult<Result, Error>;

/**
 * Hook to perform a read-only contract call.
 *
 * @remarks
 *
 * The hook only performs a call if the target `abi`, `address`,
 * `functionName`, and `args` are not undefined.
 *
 */
export function useCall({
  abi,
  address,
  functionName,
  args,
  blockIdentifier = BlockTag.LATEST,
  refetchInterval: refetchInterval_,
  watch = false,
  enabled: enabled_ = true,
  parseArgs,
  parseResult,
  ...props
}: UseCallProps): UseCallResult {
  const { chain } = useNetwork();
  const { contract } = useContract({ abi, address });

  const queryKey_ = useMemo(
    () =>
      queryKey({
        chain,
        contract: contract as Contract,
        functionName,
        args,
        blockIdentifier,
      }),
    [chain, contract, functionName, args, blockIdentifier],
  );

  const enabled = useMemo(
    () => Boolean(enabled_ && contract && functionName && args),
    [enabled_, contract, functionName, args],
  );

  const refetchInterval =
    refetchInterval_ ??
    (blockIdentifier === BlockTag.PENDING && watch
      ? DEFAULT_FETCH_INTERVAL
      : undefined);

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: queryKey_,
  });

  return useQuery({
    queryKey: queryKey_,
    queryFn: queryFn({
      contract: contract as Contract,
      functionName,
      args,
      blockIdentifier,
      parseArgs,
      parseResult,
    }),
    refetchInterval,
    enabled,
    ...props,
  });
}

function queryKey({
  chain,
  contract,
  functionName,
  args,
  blockIdentifier,
}: { chain?: Chain; contract?: Contract } & CallArgs) {
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
  parseArgs = true,
  parseResult = true,
}: { contract?: Contract } & CallArgs) {
  return async () => {
    if (!contract) throw new Error("contract is required");
    if (contract.functions[functionName] === undefined) {
      throw new Error(`function ${functionName} not found in contract`);
    }

    return contract.call(functionName, args, {
      parseRequest: parseArgs,
      parseResponse: parseResult,
      blockIdentifier,
    });
  };
}
