import { useCallback } from "react";
import { AccountInterface, Signature, TypedData } from "starknet";

import { UseMutationProps, UseMutationResult, useMutation } from "~/query";
import { useAccount } from "./useAccount";

export type SignTypedDataVariables = Partial<TypedData>;

type MutationResult = UseMutationResult<
  Signature,
  Error,
  SignTypedDataVariables
>;

/** Arguments for `useSignTypedData` hook. */
export type UseSignTypedDataProps = Partial<TypedData> &
  UseMutationProps<Signature, Error, SignTypedDataVariables>;

/** Value returned by `useSignTypedData` hook. */
export type UseSignTypedDataResult = Omit<
  MutationResult,
  "mutate" | "mutateAsync"
> & {
  signTypedData: (args?: SignTypedDataVariables) => void;
  signTypedDataAsync: (args?: SignTypedDataVariables) => Promise<Signature>;
};

export function useSignTypedData({
  domain,
  types,
  message,
  primaryType,
  ...props
}: UseSignTypedDataProps): UseSignTypedDataResult {
  const { account } = useAccount();

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: mutationKey({ domain, types, message, primaryType }),
    mutationFn: mutateFn({ account }),
    ...props,
  });

  const signTypedData = useCallback(
    (args?: SignTypedDataVariables) =>
      mutate(
        args ?? {
          domain,
          types,
          message,
          primaryType,
        },
      ),
    [mutate, domain, types, message, primaryType],
  );

  const signTypedDataAsync = useCallback(
    (args?: SignTypedDataVariables) =>
      mutateAsync(
        args ?? {
          domain,
          types,
          message,
          primaryType,
        },
      ),
    [mutateAsync, domain, types, message, primaryType],
  );

  return {
    signTypedData,
    signTypedDataAsync,
    ...result,
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

function mutateFn({ account }: { account?: AccountInterface }) {
  return function ({
    domain,
    types,
    message,
    primaryType,
  }: SignTypedDataVariables): Promise<Signature> {
    if (!account) throw new Error("account is required");
    if (!domain) throw new Error("domain is required");
    if (!types) throw new Error("types is required");
    if (!message) throw new Error("message is required");
    if (!primaryType) throw new Error("primaryType is required");
    return account.signMessage({ domain, types, message, primaryType });
  };
}
