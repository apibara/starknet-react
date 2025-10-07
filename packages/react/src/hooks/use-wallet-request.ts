import type { RpcMessage, RpcTypeToMessageMap } from "@starknet-io/types-js";
import { useCallback } from "react";

import type { Connector } from "../connectors/base";
import { useStarknet } from "../context/starknet";
import {
  type UseMutationProps,
  type UseMutationResult,
  useMutation,
} from "../query";

/** Message types for connector request call. */
export type RequestMessageTypes = RpcMessage["type"];

/** Result type of request call. */
export type RequestResult<T extends RequestMessageTypes> =
  RpcTypeToMessageMap[T]["result"];

/** Args type of request call. */
export type RequestArgs<T extends RequestMessageTypes> = Partial<{
  type: T;
  params: RpcTypeToMessageMap[T]["params"];
}>;

type MutationResult<T extends RequestMessageTypes> = UseMutationResult<
  RpcTypeToMessageMap[T]["result"],
  Error,
  RequestArgs<T>
>;

/** Arguments for `useWalletRequest` hook. */
export type UseWalletRequestProps<T extends RequestMessageTypes> =
  RequestArgs<T> & UseMutationProps<RequestResult<T>, Error, RequestArgs<T>>;

/** Value returned from `useWalletRequest`. */
export type UseWalletRequestResult<T extends RequestMessageTypes> = Omit<
  MutationResult<T>,
  "mutate" | "mutateAsync"
> & {
  request: (args?: RequestArgs<T>) => void;
  requestAsync: (args?: RequestArgs<T>) => Promise<RequestResult<T>>;
};

/** Hook to perform request calls to connected wallet */
export function useWalletRequest<T extends RequestMessageTypes>(
  props: UseWalletRequestProps<T>,
): UseWalletRequestResult<T> {
  const { connector } = useStarknet();

  const { type, params, ...rest } = props;

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: mutationKey({ type, params }),
    mutationFn: mutationFn({ connector }),
    ...rest,
  });

  const request = useCallback(
    (args?: RequestArgs<T>) => mutate(args ?? { type, params }),
    [mutate, type, params],
  );

  const requestAsync = useCallback(
    (args?: RequestArgs<T>) => mutateAsync(args ?? { type, params }),
    [mutateAsync, type, params],
  );

  return {
    request,
    requestAsync,
    ...result,
  };
}

function mutationKey<T extends RequestMessageTypes>({
  type,
  params,
}: RequestArgs<T>) {
  return [{ entity: "walletRequest", type, params }] as const;
}

function mutationFn<T extends RequestMessageTypes>({
  connector,
}: {
  connector?: Connector;
}) {
  return async ({ type, params }: RequestArgs<T>) => {
    if (!connector) throw new Error("No connector connected");
    if (!type) throw new Error("Type is required");
    return await connector.request({ type, params });
  };
}
