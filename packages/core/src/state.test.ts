import { describe, expect, it } from "vitest";

import { mainnet, sepolia } from "@starknet-react/chains";

import { publicProvider } from "./providers/public";
import { createState } from "./state";

const chains = [mainnet, sepolia];
const providerFactory = publicProvider();

describe("createState", () => {
  describe("chainId", () => {
    it("defaults to the first chain", () => {
      const state = createState({ chains, providerFactory });
      expect(state.chainId).toEqual(mainnet.id);
    });

    it("returns the available chains", () => {
      const state = createState({ chains, providerFactory });
      expect(state.chains).toEqual(chains);
    });
  });

  describe("getProvider", () => {
    it("returns the provider for the current chain", async () => {
      const state = createState({ chains, providerFactory });
      const provider = state.getProvider();
      const chainId = await provider.getChainId();
      expect(BigInt(chainId)).toEqual(mainnet.id);
    });

    it("returns the provider for the specified chain", async () => {
      const state = createState({ chains, providerFactory });
      const provider = state.getProvider({ chainId: sepolia.id });
      const chainId = await provider.getChainId();
      expect(BigInt(chainId)).toEqual(sepolia.id);
    });
  });
});
