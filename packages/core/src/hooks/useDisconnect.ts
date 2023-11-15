import { useStarknet } from "~/context/starknet";

import { UseMutationProps, UseMutationResult, useMutation } from "~/query";

type MutationResult = UseMutationResult<void, unknown, void>;

export type UseDisconnectProps = UseMutationProps<void, unknown, void>;

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

export function useDisconnect(
  props: UseDisconnectProps = {},
): UseDisconnectResult {
  const { disconnect, chain } = useStarknet();

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: [{ entity: "disconnect", chainId: chain.name }],
    mutationFn: disconnect,
    ...props,
  });

  return {
    disconnect: mutate,
    disconnectAsync: mutateAsync,
    ...result,
  };
}
