import { useCallback } from "react";
import { AccountInterface, Signature, TypedData } from "starknet";

import { UseMutationProps, UseMutationResult, useMutation } from "~/query";
import { useAccount } from "./useAccount";

type Variables = { account?: AccountInterface } & Partial<TypedData>;

type MutationResult = UseMutationResult<Signature, Error, Variables>;

/** Arguments for `useSignTypedData` hook. */
export type UseSignTypedDataProps = Partial<TypedData> &
  UseMutationProps<Signature, Error, Variables>;

/** Value returned by `useSignTypedData` hook. */
export type UseSignTypedDataResult = Omit<
  MutationResult,
  "mutate" | "mutateAsync"
> & {
  signTypedData: MutationResult["mutate"];
  signTypedDataAsync: MutationResult["mutateAsync"];
};

export function useSignTypedData({
  domain,
  types,
  message,
  primaryType,
  ...props
}: UseSignTypedDataProps): UseSignTypedDataResult {
  const { account } = useAccount();

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    isPaused,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation({
    mutationKey: mutationKey({ domain, types, message, primaryType }),
    mutationFn: mutateFn,
    ...props,
  });

  const signTypedData = useCallback(
    (args?: Partial<TypedData>) =>
      mutate({
        domain: args?.domain ?? domain,
        types: args?.types ?? types,
        message: args?.message ?? message,
        primaryType: args?.primaryType ?? primaryType,
        account,
      }),
    [mutate, account, domain, types, message, primaryType],
  );

  const signTypedDataAsync = useCallback(
    (args?: Partial<TypedData>) =>
      mutateAsync({
        domain: args?.domain ?? domain,
        types: args?.types ?? types,
        message: args?.message ?? message,
        primaryType: args?.primaryType ?? primaryType,
        account,
      }),
    [mutateAsync, account, domain, types, message, primaryType],
  );

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    isPaused,
    reset,
    signTypedData,
    signTypedDataAsync,
    status,
    variables,
  };
}

function mutationKey({
  domain,
  types,
  message,
  primaryType,
}: Partial<TypedData>) {
  return [
    {
      entity: "signTypedData",
      domain,
      types,
      message,
      primaryType,
    },
  ] as const;
}

function mutateFn({
  account,
  domain,
  types,
  message,
  primaryType,
}: Variables): Promise<Signature> {
  if (!account) throw new Error("account is required");
  if (!domain) throw new Error("domain is required");
  if (!types) throw new Error("types is required");
  if (!message) throw new Error("message is required");
  if (!primaryType) throw new Error("primaryType is required");
  return account.signMessage({ domain, types, message, primaryType });
}
