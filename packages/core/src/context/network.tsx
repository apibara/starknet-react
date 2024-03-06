import { createContext, useContext } from "react";

import { Chain } from "@starknet-react/chains";
import { ProviderInterface } from "starknet";
import { ChainProviderFactory } from "~/providers";
import { ChainState, useChainState } from "./chain";
import { providerForChain } from "./rpc-provider";

export interface NetworkState extends ChainState {
  /** The RPC provider for the current chain. */
  provider: ProviderInterface;
}

export const NetworkContext = createContext<NetworkState | undefined>(
  undefined,
);

export class NetworkError extends Error {
  readonly _tag = "NetworkError";
}

export function useNetworkState() {
  const state = useContext(NetworkContext);
  if (!state) {
    throw new NetworkError(
      "useNetworkState must be used within a StarknetConfig or NetworkProvider",
    );
  }
  return state;
}

export function NetworkProvider({
  chains,
  provider: providerFactory,
  children,
}: {
  chains: Chain[];
  provider: ChainProviderFactory;
  children: React.ReactNode;
}) {
  const { chain, setChain } = useChainState({ chains });
  const { provider } = providerForChain(chain, providerFactory);

  return (
    <NetworkContext.Provider value={{ chains, chain, setChain, provider }}>
      {children}
    </NetworkContext.Provider>
  );
}
