import { ChainProviderFactory, setDefaultRpcUrl } from "./factory";

/** Arguments for `alchemyProvider`. */
export type AlchemyProviderArgs = {
  /** Alchemy API key. */
  apiKey: string;
};

/** Configure the Alchemy provider using the provided API key. */
export function alchemyProvider({
  apiKey,
}: AlchemyProviderArgs): ChainProviderFactory {
  return function (chain) {
    const baseHttpUrl = chain.rpcUrls["alchemy"]?.http[0];
    if (!baseHttpUrl) return null;
    const httpUrl = `${baseHttpUrl}/${apiKey}`;
    return {
      chain: setDefaultRpcUrl(chain, httpUrl),
      rpcUrls: {
        http: [httpUrl],
      },
    };
  };
}
