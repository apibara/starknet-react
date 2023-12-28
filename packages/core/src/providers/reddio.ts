import { jsonRpcProvider } from "./jsonrpc";

/** Arguments for `reddioProvider`. */
export type ReddioProviderArgs = {
  /** Reddio API key. */
  apiKey: string;
};

/** Configure the Reddio provider using the provided API key. */
export function reddioProvider({ apiKey }: ReddioProviderArgs) {
  return jsonRpcProvider({
    rpc: (chain) => {
      const baseHttpUrl = chain.rpcUrls["reddio"]?.http[0];
      if (!baseHttpUrl) return null;
      const nodeUrl = `${baseHttpUrl}/${apiKey}`;
      return { nodeUrl };
    },
  });
}
