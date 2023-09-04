import { Chain, RpcUrls } from "@starknet-react/chains";

export type ChainProviderFactory = (chain: Chain) => {
  chain: Chain;
  rpcUrls: RpcUrls;
} | null;

/** Returns a new chain with the default RPC URL set. */
export function setDefaultRpcUrl(chain: Chain, url: string): Chain {
  return {
    ...chain,
    rpcUrls: {
      ...chain.rpcUrls,
      default: { http: [url] },
    },
  };
}
