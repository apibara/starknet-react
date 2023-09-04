import { devnet } from "@starknet-react/chains";

import { describe, expect, it } from "vitest";
import { publicProvider } from "./public";

describe("publicProvider", () => {
  it("returns a public rpc endpoint", () => {
    expect(publicProvider()(devnet)?.rpcUrls).toMatchInlineSnapshot(`
      {
        "http": [
          "http://localhost:5050/rpc",
        ],
      }
    `);
  });

  it("returns the chain", () => {
    expect(publicProvider()(devnet)?.chain).toMatchInlineSnapshot(`
      {
        "id": 1536727068981429685321n,
        "name": "Starknet Devnet",
        "nativeCurrency": {
          "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "decimals": 18,
          "name": "Ether",
          "symbol": "ETH",
        },
        "network": "devnet",
        "rpcUrls": {
          "default": {
            "http": [],
          },
          "public": {
            "http": [
              "http://localhost:5050/rpc",
            ],
          },
        },
        "testnet": true,
      }
    `);
  });
});
