import { ChainProviderFactory, setDefaultRpcUrl } from "./factory";

/** Arguments for `infuraProvider`. */
export type InfuraProviderArgs = {
  /** Infura API key. */
  apiKey: string;
};

/** Configure the Infura provider using the provided API key. */
export function infuraProvider({
  apiKey,
}: InfuraProviderArgs): ChainProviderFactory {
  return function (chain) {
    const baseHttpUrl = chain.rpcUrls["infura"]?.http[0];
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
