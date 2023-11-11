import { jsonRpcProvider } from "./jsonrpc";

/** Configure the provider to use the public RPC endpoint. */
export function publicProvider() {
  return jsonRpcProvider({
    rpc: (chain) => {
      const nodeUrl = chain.rpcUrls.public.http[0];
      if (!nodeUrl) return null;
      return { nodeUrl };
    },
  });
}
