import type { Chain } from "../types";
import { mainnet } from "../starknet";

import { describe, expect, it } from "vitest";
import { jsonRpcProvider } from "./jsonrpc";

function rpc(chain: Chain) {
  return {
    nodeUrl: `https://${chain.network}.example.com`,
  };
}

describe("jsonRpcProvider", () => {
  it("returns a public rpc endpoint", () => {
    expect(
      jsonRpcProvider({ rpc })(mainnet)?.channel.nodeUrl,
    ).toMatchInlineSnapshot('"https://mainnet.example.com"');
  });
});
