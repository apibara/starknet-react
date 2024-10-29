import type { ChainProviderFactory } from "@starknet-react/core";
import { createStore } from "mipd";
import type { RpcProvider } from "starknet";
import { KakarotConnector } from "./kakarot";

export function kakarotConnectors(
  starknetRpcProvider: ChainProviderFactory<RpcProvider>,
): KakarotConnector[] {
  // Set up a MIPD Store, and request Providers.
  const store = createStore();

  const allProviders = store.getProviders();
  return allProviders.map((provider) => {
    return new KakarotConnector(provider, starknetRpcProvider);
  });
}
