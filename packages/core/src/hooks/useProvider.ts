import { ProviderInterface } from "starknet";

import { useStarknet } from "~/context/starknet";
import { useNetwork } from "./useNetwork";

/** Value returned from `useProvider`. */
export interface UseProviderResult {
  /** The current provider. */
  provider: ProviderInterface;
}

export type UseProviderProps = {
  chainId?: bigint,
};

/**
 * Hook for accessing the current provider.
 *
 * @remarks
 *
 * Use this hook to access the current provider object
 * implementing starknet.js `ProviderInterface`.
 *
 * @example
 * This example shows how to access the current provider.
 * ```tsx
 * function Component() {
 *   const { provider } = useProvider()
 * }
 * ```
 */
export function useProvider({ chainId }: UseProviderProps): UseProviderResult {
  const { provider, providerFactory } = useStarknet();
  const { chains } = useNetwork();

  if (chainId === undefined) {
    return { provider }
  }

  const chain = chains.find((ch) => ch.id === chainId);
  if (chain === undefined) {
    throw new Error(`Chain with id ${chainId} not found. Did you configure it?`);
  }

  const provider_ = providerFactory(chain);
  if (provider_ === undefined || provider_ === null)  {
    throw new Error(`No provider found for chain ${chain.name}`);
  }

  return { provider: provider_  };
}
