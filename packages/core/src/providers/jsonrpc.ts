import { Chain } from "@starknet-react/chains";
import { RpcProvider, RpcProviderOptions } from "starknet";

import { ChainProviderFactory } from "./factory";

/** Arguments for `jsonRpcProvider`. */
export type JsonRpcProviderArgs = {
  rpc: (chain: Chain) => RpcProviderOptions | null;
};

/** Configure the JSON-RPC provider using the provided function. */
export function jsonRpcProvider({
  rpc,
}: JsonRpcProviderArgs): ChainProviderFactory {
  return function (chain) {
    const config = rpc(chain);
    if (!config) return null;
    
    const provider = new RpcProvider(config);
    return provider;
  };
}
