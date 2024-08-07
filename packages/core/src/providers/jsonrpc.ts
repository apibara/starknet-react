import type { Chain } from "@starknet-react/chains";
import { RpcProvider, type RpcProviderOptions } from "starknet";

import { starknetChainId } from "../context";
import type { ChainProviderFactory } from "./factory";

/** Arguments for `jsonRpcProvider`. */
export type JsonRpcProviderArgs = {
  rpc: (chain: Chain) => RpcProviderOptions | null;
};

/** Configure the JSON-RPC provider using the provided function. */
export function jsonRpcProvider({
  rpc,
}: JsonRpcProviderArgs): ChainProviderFactory<RpcProvider> {
  return (chain) => {
    const config = rpc(chain);
    if (!config) return null;
    const chainId = starknetChainId(chain.id);

    const provider = new RpcProvider({ ...config, chainId });
    return provider;
  };
}
