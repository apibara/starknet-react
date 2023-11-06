import { Chain } from "@starknet-react/chains";

import { ChainProviderFactory, setDefaultRpcUrl } from "./factory";

/** Arguments for `jsonRpcProvider`. */
export type JsonRpcProviderArgs = {
  rpc: (chain: Chain) => { http: string; headers?: object; } | null;
};

/** Configure the JSON-RPC provider using the provided function. */
export function jsonRpcProvider({
  rpc,
}: JsonRpcProviderArgs): ChainProviderFactory {
  return function (chain) {
    const config = rpc(chain);
    if (!config || config.http === "") return null;
    return {
      chain: setDefaultRpcUrl(chain, config.http),
      rpcUrls: {
        http: [config.http],
        headers: config.headers
      },
    };
  };
}
