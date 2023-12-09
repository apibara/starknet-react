import { jsonRpcProvider } from "./jsonrpc";

/** Arguments for `nethermindProvider`. */
export type NethermindProviderArgs = {
  /** Nethermind API key. */
  apiKey: string;
};

/** Configure the Nethermind provider using the provided API key. */
export function nethermindProvider({ apiKey }: NethermindProviderArgs) {
  return jsonRpcProvider({
    rpc: (chain) => {
      const baseHttpUrl = chain.rpcUrls["nethermind"]?.http[0];
      if (!baseHttpUrl) return null;
      const nodeUrl = `${baseHttpUrl}/?apikey=${apiKey}`;
      return { nodeUrl };
    },
  });
}
