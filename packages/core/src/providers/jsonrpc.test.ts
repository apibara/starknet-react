import { Chain, mainnet } from "@starknet-react/chains";

import { describe, expect, it } from "vitest";
import { jsonRpcProvider } from "./jsonrpc";

function rpc(chain: Chain) {
  return {
    http: `https://${chain.network}.example.com`,
  };
}

describe("publicProvider", () => {
  it("returns a public rpc endpoint", () => {
    expect(jsonRpcProvider({ rpc })(mainnet)?.rpcUrls).toMatchInlineSnapshot(`
      {
        "http": [
          "https://mainnet.example.com",
        ],
      }
    `);
  });
});
