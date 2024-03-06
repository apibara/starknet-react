import { Chain } from "@starknet-react/chains";
import { ProviderInterface } from "starknet";

import { ChainProviderFactory } from "~/providers";

export class RpcProviderError extends Error {
  readonly _tag = "RpcProviderError";
}

/**
 * Returns a Starknet RPC provider configured for the given chain.
 *
 * @param chain the current chain.
 * @param factory RPC provider factory.
 * @returns a Starknet RPC provider.
 */
export function providerForChain(
  chain: Chain,
  factory: ChainProviderFactory,
): { provider: ProviderInterface } {
  const provider = factory(chain);
  if (provider) {
    return { provider };
  }

  throw new RpcProviderError(`No provider found for chain ${chain.name}`);
}
