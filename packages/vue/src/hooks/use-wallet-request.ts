import type { RpcMessage, RpcTypeToMessageMap } from "@starknet-io/types-js";

import type { Connector } from "../connectors/base";
import { useStarknet } from "../context/starknet";
import {
  type UseMutationProps,
  type UseMutationResult,
  useMutation,
} from "../query";

export type RequestMessageTypes = RpcMessage["type"];

export type RequestResult<T extends RequestMessageTypes> =
  RpcTypeToMessageMap[T]["result"];

export type RequestArgs<T extends RequestMessageTypes> = Partial<{
  type: T;
  params: RpcTypeToMessageMap[T]["params"];
}>;

type MutationResult<T extends RequestMessageTypes> = UseMutationResult<
  RpcTypeToMessageMap[T]["result"],
  Error,
  RequestArgs<T>,
  unknown
>;

export type UseWalletRequestProps<T extends RequestMessageTypes> =
  RequestArgs<T> & UseMutationProps<RequestResult<T>, Error, RequestArgs<T>>;

export type UseWalletRequestResult<T extends RequestMessageTypes> = Omit<
  MutationResult<T>,
  "mutate" | "mutateAsync"
> & {
  request: (args?: RequestArgs<T>) => void;
  requestAsync: (args?: RequestArgs<T>) => Promise<RequestResult<T>>;
};

export function useWalletRequest<T extends RequestMessageTypes>(
  props: UseWalletRequestProps<T>,
): UseWalletRequestResult<T> {
  const starknet = useStarknet();

  const { type, params, ...rest } = props;

  const { mutate, mutateAsync, ...result } = useMutation<
    RpcTypeToMessageMap[T]["result"],
    Error,
    RequestArgs<T>,
    unknown
  >({
    mutationKey: mutationKey({ type, params }),
    mutationFn: mutationFn({ connector: starknet.connector }),
    ...((rest ?? {}) as UseMutationProps<
      RequestResult<T>,
      Error,
      RequestArgs<T>,
      unknown
    >),
  });

  const request = (args?: RequestArgs<T>) => mutate(args ?? { type, params });
  const requestAsync = (args?: RequestArgs<T>) =>
    mutateAsync(args ?? { type, params });

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
