import { Chain } from "@starknet-react/chains";
import { ProviderInterface } from "starknet";
import { createStore } from "zustand/vanilla";

import { ChainProviderFactory } from "~/providers";

export class ChainError extends Error {
  readonly _tag = "ChainError";
}

export class RpcProviderError extends Error {
  readonly _tag = "RpcProviderError";
}

export type CreateStateArgs = {
  chains: Chain[];
  providerFactory: ChainProviderFactory;
};

export type State = {
  chainId: bigint;
  chains: Chain[];
};

export function createState({ chains, providerFactory }: CreateStateArgs) {
  if (chains.length === 0) {
    throw new ChainError("No chains provided.");
  }

  function getProvider(args: { chainId?: bigint } = {}): ProviderInterface {
    const chainId = args.chainId ?? store.getState().chainId;
    const chain = store.getState().chains.find((c) => c.id === chainId);

    if (!chain) {
      throw new ChainError(`No chain found for id ${chainId}`);
    }

    const provider = providerFactory(chain);

    if (!provider) {
      throw new RpcProviderError(`No provider found for chain ${chain.id}`);
    }

    return provider;
  }

  const store = createStore<State>((set) => {
    const chainId = chains[0].id;

    return {
      chainId,
      chains,
    } satisfies State;
  });

  return {
    getProvider,
    get chains() {
      return store.getState().chains;
    },
    get chainId() {
      return store.getState().chainId;
    },
  };
}
