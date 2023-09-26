import { devnet } from "@starknet-react/chains";
import { describe, expect, it } from "vitest";
import { connector } from "../../test/devnet";
import { act, renderHook } from "../../test/react";

import { useStarknet } from "./starknet";

describe("StarknetProvider", () => {
  it("defaults to the first chain", async () => {
    const { result } = renderHook(() => useStarknet());

    expect(result.current.chain.name).toEqual("Starknet Devnet");
    expect(await result.current.provider.getChainId()).toEqual(
      `0x${devnet.id.toString(16)}`,
    );
  });

  it("connects to a connector", async () => {
    const { result } = renderHook(() => useStarknet());

    expect(result.current.connector).toBeUndefined();

    await act(async () => {
      await result.current.connect({ connector: connector });
    });

    expect(result.current.connector).toBeDefined();
  });
});
