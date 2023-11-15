import { useCallback } from "react";
import {
  Abi,
  AccountInterface,
  Call,
  InvocationsDetails,
  InvokeFunctionResponse,
} from "starknet";

import { UseMutationProps, UseMutationResult, useMutation } from "~/query";

import { useAccount } from "./useAccount";

/** Arguments for `useContractWrite`. */
export type ContractWriteVariables = {
  /** List of smart contract calls to execute. */
  calls?: Call[];
  /** Contract ABIs for better displaying. */
  abis?: Abi[];
  /** Transaction options. */
  options?: InvocationsDetails;
};

export type UseContractWriteProps = ContractWriteVariables &
  UseMutationProps<InvokeFunctionResponse, Error, ContractWriteVariables>;

export type MutationResult = UseMutationResult<
  InvokeFunctionResponse,
  Error,
  ContractWriteVariables
>;

export type UseContractWriteResult = Omit<
  MutationResult,
  "mutate" | "mutateAsync"
> & {
  /** Execute the calls. */
  write: (args?: ContractWriteVariables) => void;
  /** Execute the calls. */
  writeAsync: (
    args?: ContractWriteVariables,
  ) => Promise<InvokeFunctionResponse>;
};

/**
 * Hook to perform a Starknet multicall.
 *
 * @remarks
 *
 * Multicalls are used to submit multiple transactions in a single
 * call to improve user experience.
 */
export function useContractWrite({
  calls,
  abis,
  options,
  ...props
}: UseContractWriteProps): UseContractWriteResult {
  const { account } = useAccount();
  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: mutationKey({ account, calls, abis, options }),
    mutationFn: mutationFn({ account }),
    ...props,
  });

  const write = useCallback(
    (args?: ContractWriteVariables) => {
      return mutate({
        ...(args ?? {
          calls,
          abis,
          options,
        }),
      });
    },
    [mutate, calls, abis, options],
  );

  const writeAsync = useCallback(
    (args?: ContractWriteVariables) => {
      return mutateAsync({
        ...(args ?? {
          calls,
          abis,
          options,
        }),
      });
    },
    [mutateAsync, calls, abis, options],
  );

  return {
    write,
    writeAsync,
    ...result,
  };
}

function mutationKey({
  account,
  calls,
  abis,
  options,
}: {
  account?: AccountInterface;
  calls?: Call[];
  abis?: Abi[];
  options?: InvocationsDetails;
}) {
  return [{ entity: "contractWrite", account, calls, abis, options }] as const;
}

function mutationFn({
  account,
}: {
  account?: AccountInterface;
}) {
  return async function ({ calls, abis, options }: ContractWriteVariables) {
    if (!account) throw new Error("account is required");
    if (!calls || calls.length === 0) throw new Error("calls are required");
    return await account?.execute(calls, abis, options);
  };
}
