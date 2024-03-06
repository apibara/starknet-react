import { Chain } from "@starknet-react/chains";
import { useState } from "react";

export interface ChainState {
  /** Chains supported by the app. */
  chains: Chain[];
  /** The current chain. */
  chain: Chain;
  /** Change the current chain. */
  setChain: (chain: Chain) => void;
}

export class ChainError extends Error {
  readonly _tag = "ChainError";
}

export function useChainState({ chains }: { chains: Chain[] }) {
  if (chains.length === 0) {
    throw new ChainError("No chains provided.");
  }

  const [chain, setChain] = useState<Chain>(chains[0]);

  return { chain, setChain };
}
