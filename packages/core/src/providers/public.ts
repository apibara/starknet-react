import { ChainProviderFactory } from "./factory";

/** Configure the provider to use the public RPC endpoint. */
export function publicProvider(): ChainProviderFactory {
  return function (chain) {
    if (!chain.rpcUrls.public.http[0]) return null;
    return {
      chain,
      rpcUrls: chain.rpcUrls.public,
    };
  };
}
