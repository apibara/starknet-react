import { useStarknet } from "~/context/starknet";

import { Connector } from "~/connectors/base";
import { UseMutationProps, UseMutationResult, useMutation } from "~/query";

type Variables = { connector: Connector };

type MutationResult = UseMutationResult<void, unknown, Variables>;

export type UseConnectProps = UseMutationProps<void, unknown, Variables>;

/** Value returned from `useConnect`. */
export type UseConnectResult = Omit<
  MutationResult,
  "mutate" | "mutateAsync"
> & {
  /** Current connector. */
  connector?: Connector;
  /** Connectors available for the current chain. */
  connectors: Connector[];
  /** Connector waiting approval for connection. */
  pendingConnector?: Connector;
  /** Connect to a new connector. */
  connect: MutationResult["mutate"];
  /** Connect to a new connector. */
  connectAsync: MutationResult["mutateAsync"];
};

/**
 * Hook for connecting to a StarkNet wallet.
 *
 * @remarks
 *
 * Use this to implement a "connect wallet" component.
 *
 * @example
 * This example shows how to connect a wallet.
 * ```tsx
 * function Component() {
 *   const { connect, connectors } = useConnect();
 *   return (
 *     <ul>
 *     {connectors.map((connector) => (
 *       <li key={connector.id}>
 *         <button onClick={() => connect({ connector })}>
 *           {connector.name}
 *         </button>
 *       </li>
 *     ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useConnect(props: UseConnectProps = {}): UseConnectResult {
  const { connector, connectors, connect, chain } = useStarknet();

  const {
    mutate,
    mutateAsync,
    data,
    reset,
    status,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    isPaused,
    variables,
  } = useMutation({
    mutationKey: [{ entity: "connect", chainId: chain.name }],
    mutationFn: connect,
    ...props,
  });

  return {
    connector,
    connectors,
    pendingConnector: variables?.connector,
    connect: mutate,
    connectAsync: mutateAsync,
    data,
    reset,
    status,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    isPaused,
    variables,
  };
}
