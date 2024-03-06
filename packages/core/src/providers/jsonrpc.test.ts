import { describe, expect, it } from "vitest";

import { Chain, mainnet } from "@starknet-react/chains";

import { jsonRpcProvider } from "./jsonrpc";

function rpc(chain: Chain) {
  return {
    nodeUrl: `https://${chain.network}.example.com`,
  };
}

describe("jsonRpcProvider", () => {
  it("returns a Starknet RpcProvider", () => {
    const provider = jsonRpcProvider({ rpc })(mainnet);
    expect(provider?.channel.nodeUrl).toMatchInlineSnapshot(
      '"https://mainnet.example.com"',
    );
  });
});
