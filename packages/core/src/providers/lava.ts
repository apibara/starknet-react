import { ChainProviderFactory, setDefaultRpcUrl } from "./factory";

/** Arguments for `lavaProvider`. */
export type LavaProviderArgs = {
  /** Lava API key. */
  apiKey: string;
};

/** Configure the Lava provider using the provided API key. */
export function lavalProvider({
  apiKey,
}: LavaProviderArgs): ChainProviderFactory {
  return function (chain) {
    const baseHttpUrl = chain.rpcUrls["lava"]?.http[0];
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
