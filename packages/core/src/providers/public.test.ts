import { devnet } from "@starknet-react/chains";

import { describe, expect, it } from "vitest";
import { publicProvider } from "./public";

describe("publicProvider", () => {
  it("returns a public rpc endpoint", () => {
    expect(publicProvider()(devnet)?.nodeUrl).toMatchInlineSnapshot(
      '"http://localhost:5050/rpc"',
    );
  });

  it("returns the chain", () => {
    expect(publicProvider()(devnet)?.getChainId()).resolves.toMatch(
      "0x534e5f474f45524c49",
    );
  });
});
