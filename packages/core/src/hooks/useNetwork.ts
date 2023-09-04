import { Chain } from "@starknet-react/chains";
import { useStarknet } from "~/context/starknet";

/** Value returned from `useNetwork`. */
export type UseNetworkResult = {
  /** The current chain. */
  chain: Chain;
  /** List of supported chains. */
  chains: Chain[];
};

/**
 * Hook for accessing the current connected chain.
 *
 * @remarks
 *
 * The network object contains information about the
 * network.
 *
 * @example
 * This example shows how to display the current network name.
 * ```tsx
 * function Component() {
 *   const { chain } = useNetwork()
 *
 *   return <span>{chain.name}</span>
 * }
 */
export function useNetwork(): UseNetworkResult {
  const { chain, chains } = useStarknet();
  return { chain, chains };
}
