import { Chain } from "@starknet-react/chains";
import { useMemo } from "react";
import {
  Abi,
  ArgsOrCalldata,
  BlockNumber,
  BlockTag,
  Contract,
  Result,
} from "starknet";

import { UseQueryProps, UseQueryResult, useQuery } from "~/query";

import { useContract } from "./useContract";
import { useInvalidateOnBlock } from "./useInvalidateOnBlock";
import { useNetwork } from "./useNetwork";

type ContractReadArgs = {
  /** The contract's function name. */
  functionName: string;
  /** Read arguments. */
  args?: ArgsOrCalldata;
  /** Block identifier used when performing call. */
  blockIdentifier?: BlockNumber;
  /** Parse arguments before passing to contract. */
  parseArgs?: boolean;
  /** Parse result after calling contract. */
  parseResult?: boolean;
};

/** Options for `useContractRead`. */
export type UseContractReadProps = ContractReadArgs &
  UseQueryProps<Result, Error, Result, ReturnType<typeof queryKey>> & {
    /** The target contract's ABI. */
    abi?: Abi;
    /** The target contract's address. */
    address?: string;
    /** Refresh data at every block. */
    watch?: boolean;
  };

/** Value returned from `useContractRead`. */
export type UseContractReadResult = UseQueryResult<Result, Error>;

/**
 * Hook to perform a read-only contract call.
 *
 * @remarks
 *
 * The hook only performs a call if the target `abi`, `address`,
 * `functionName`, and `args` are not undefined.
 */
export function useContractRead({
  abi,
  address,
  functionName,
  args,
  blockIdentifier = BlockTag.latest,
  parseArgs,
  parseResult,
  watch = false,
  enabled: enabled_ = true,
  ...props
}: UseContractReadProps): UseContractReadResult {
  const { chain } = useNetwork();
  const { contract } = useContract({ abi, address });

  const queryKey_ = useMemo(
    () => queryKey({ chain, contract, functionName, args, blockIdentifier }),
    [chain, contract, functionName, args, blockIdentifier],
  );

  const enabled = useMemo(
    () => Boolean(enabled_ && contract && functionName && args),
    [enabled_, contract, functionName, args],
  );

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: queryKey_,
  });

  return useQuery({
    queryKey: queryKey_,
    queryFn: queryFn({
      contract,
      functionName,
      args,
      blockIdentifier,
      parseArgs,
      parseResult,
    }),
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
  parseArgs,
  parseResult,
}: { contract?: Contract } & ContractReadArgs) {
  return async function () {
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
