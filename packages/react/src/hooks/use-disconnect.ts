import { useStarknet } from "../context/starknet";
import {
  type UseMutationProps,
  type UseMutationResult,
  useMutation,
} from "../query";

type MutationResult = UseMutationResult<void, Error, void>;

export type UseDisconnectProps = UseMutationProps<void, Error, void>;

/** Value returned from `useDisconnect`. */
export type UseDisconnectResult = Omit<
  MutationResult,
  "mutate" | "mutateAsync"
> & {
  /** Disconnect wallet. */
  disconnect: MutationResult["mutate"];
  /** Disconnect wallet. */
  disconnectAsync: MutationResult["mutateAsync"];
};

/**
 *
 * Hook for disconnecting connected wallet.
 */
export function useDisconnect(
  props: UseDisconnectProps = {},
): UseDisconnectResult {
  const { disconnect, chain } = useStarknet();

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: disconnectMutationKey({ chainId: chain.name }),
    mutationFn: disconnectMutationFn({ disconnect }),
    ...props,
  });

  return {
    disconnect: mutate,
    disconnectAsync: mutateAsync,
    ...result,
  };
}

export function disconnectMutationKey({ chainId }: { chainId: string }) {
  return [{ entity: "disconnect", chainId }] as const;
}

export function disconnectMutationFn({
  disconnect,
}: {
  disconnect: () => Promise<void> | void;
}) {
  return async () => {
    return await disconnect();
  };
}
