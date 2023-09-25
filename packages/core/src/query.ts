import {
  QueryKey,
  UseMutationOptions as UseMutationOptions_,
  UseMutationResult as UseMutationResult_,
  UseQueryOptions as UseQueryOptions_,
  UseQueryResult as UseQueryResult_,
  useMutation as useMutation_,
  useQuery as useQuery_,
} from "@tanstack/react-query";

export type UseQueryProps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Pick<
  UseQueryOptions_<TQueryFnData, TError, TData, TQueryKey>,
  "enabled" | "refetchInterval" | "suspense" | "retry" | "retryDelay"
>;

export type UseQueryResult<TData, TError> = Pick<
  UseQueryResult_<TData, TError>,
  "data" | "error" | "isSuccess" | "isError" | "refetch"
> & {
  /** A derived boolean from the `status` variable. */
  isIdle: boolean;
  /** A derived boolean from the `status` variable. */
  isLoading: boolean;
  /** Query status. */
  status: "idle" | "loading" | "success" | "error";
};

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  args: UseQueryOptions_<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  const base = useQuery_(args);

  // Use the same type/status as wagmi to avoid confusion.
  const status: UseQueryResult<TData, TError>["status"] =
    base.status === "loading" && base.fetchStatus === "idle"
      ? "idle"
      : base.status;

  const isIdle = status === "idle";
  const isLoading = status === "loading" && base.fetchStatus === "fetching";

  return {
    data: base.data,
    error: base.error,
    isLoading,
    isIdle,
    isSuccess: base.isSuccess,
    isError: base.isError,
    refetch: base.refetch,
    status,
  };
}
export type UseMutationProps<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = Pick<
  UseMutationOptions_<TData, TError, TVariables, TContext>,
  "onSuccess" | "onError" | "onMutate" | "onSettled"
>;

export type UseMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = Pick<
  UseMutationResult_<TData, TError, TVariables, TContext>,
  | "data"
  | "error"
  | "reset"
  | "mutate"
  | "mutateAsync"
  | "variables"
  | "isSuccess"
  | "isError"
  | "isIdle"
  | "isLoading"
  | "isPaused"
  | "status"
>;

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
>(
  args: UseMutationOptions_<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const base = useMutation_(args);

  return {
    data: base.data,
    error: base.error,
    reset: base.reset,
    mutate: base.mutate,
    mutateAsync: base.mutateAsync,
    variables: base.variables,
    isSuccess: base.isSuccess,
    isError: base.isError,
    isIdle: base.isIdle,
    isLoading: base.isLoading,
    isPaused: base.isPaused,
    status: base.status,
  };
}
