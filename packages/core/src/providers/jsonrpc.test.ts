import { Chain, mainnet } from "@starknet-react/chains";

import { describe, expect, it } from "vitest";
import { jsonRpcProvider } from "./jsonrpc";

function rpc(chain: Chain) {
  return {
    nodeUrl: `https://${chain.network}.example.com`,
  };
}

describe("jsonRpcProvider", () => {
  it("returns a public rpc endpoint", () => {
    expect(jsonRpcProvider({ rpc })(mainnet)?.nodeUrl).toMatchInlineSnapshot(
      '"https://mainnet.example.com"',
    );
  });
});
