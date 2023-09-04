import { AccountInterface, Call, InvokeFunctionResponse } from "starknet";

import { UseMutationProps, UseMutationResult, useMutation } from "~/query";

import { useAccount } from "./useAccount";

/** Arguments for `useContractWrite`. */
export type Variables = {
  /** List of smart contract calls to execute. */
  calls?: Call[];
};

export type UseContractWriteProps = Variables &
  UseMutationProps<InvokeFunctionResponse, Error, Variables>;

type MutationResult = UseMutationResult<
  InvokeFunctionResponse,
  Error,
  Variables
>;

export type UseContractWriteResult = Omit<
  MutationResult,
  "mutate" | "mutateAsync"
> & {
  /** Execute the calls. */
  write: MutationResult["mutate"];
  /** Execute the calls. */
  writeAsync: MutationResult["mutateAsync"];
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
  ...props
}: UseContractWriteProps): UseContractWriteResult {
  const { account } = useAccount();
  const {
    mutate,
    mutateAsync,
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    isPaused,
    reset,
    status,
    variables,
  } = useMutation({
    mutationKey: mutationKey({ account, calls }),
    mutationFn: mutationFn({ account, calls }),
    ...props,
  });

  return {
    write: mutate,
    writeAsync: mutateAsync,
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    isPaused,
    reset,
    status,
    variables,
  };
}

function mutationKey({
  account,
  calls,
}: { account?: AccountInterface; calls?: Call[] }) {
  return [{ entity: "contractWrite", account, calls }] as const;
}

function mutationFn({
  account,
  calls,
}: { account?: AccountInterface; calls?: Call[] }) {
  return async function () {
    if (!account) throw new Error("account is required");
    if (!calls || calls.length === 0) throw new Error("calls are required");
    return account?.execute(calls);
  };
}
