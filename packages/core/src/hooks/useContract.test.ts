import { Abi } from "starknet";
import { describe, expect, it } from "vitest";
import { tokenAddress } from "../../test/devnet";
import { renderHook } from "../../test/react";

import { useContract } from "./useContract";

describe("useContract", () => {
  it("returns a contract", async () => {
    const { result } = renderHook(() =>
      useContract({ abi, address: tokenAddress }),
    );

    expect(result.current).toMatchInlineSnapshot(`
      {
        "contract": Contract {
          "abi": [
            {
              "members": [
                {
                  "name": "low",
                  "offset": 0,
                  "type": "felt",
                },
                {
                  "name": "high",
                  "offset": 1,
                  "type": "felt",
                },
              ],
              "name": "Uint256",
              "size": 2,
              "type": "struct",
            },
            {
              "inputs": [
                {
                  "name": "name",
                  "type": "felt",
                },
                {
                  "name": "symbol",
                  "type": "felt",
                },
                {
                  "name": "recipient",
                  "type": "felt",
                },
              ],
              "name": "constructor",
              "outputs": [],
              "type": "constructor",
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "name": "name",
                  "type": "felt",
                },
              ],
              "stateMutability": "view",
              "type": "function",
            },
          ],
          "address": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "callData": CallData {
            "abi": [
              {
                "members": [
                  {
                    "name": "low",
                    "offset": 0,
                    "type": "felt",
                  },
                  {
                    "name": "high",
                    "offset": 1,
                    "type": "felt",
                  },
                ],
                "name": "Uint256",
                "size": 2,
                "type": "struct",
              },
              {
                "inputs": [
                  {
                    "name": "name",
                    "type": "felt",
                  },
                  {
                    "name": "symbol",
                    "type": "felt",
                  },
                  {
                    "name": "recipient",
                    "type": "felt",
                  },
                ],
                "name": "constructor",
                "outputs": [],
                "type": "constructor",
              },
              {
                "inputs": [],
                "name": "name",
                "outputs": [
                  {
                    "name": "name",
                    "type": "felt",
                  },
                ],
                "stateMutability": "view",
                "type": "function",
              },
            ],
            "enums": {},
            "parser": AbiParser1 {
              "abi": [
                {
                  "members": [
                    {
                      "name": "low",
                      "offset": 0,
                      "type": "felt",
                    },
                    {
                      "name": "high",
                      "offset": 1,
                      "type": "felt",
                    },
                  ],
                  "name": "Uint256",
                  "size": 2,
                  "type": "struct",
                },
                {
                  "inputs": [
                    {
                      "name": "name",
                      "type": "felt",
                    },
                    {
                      "name": "symbol",
                      "type": "felt",
                    },
                    {
                      "name": "recipient",
                      "type": "felt",
                    },
                  ],
                  "name": "constructor",
                  "outputs": [],
                  "type": "constructor",
                },
                {
                  "inputs": [],
                  "name": "name",
                  "outputs": [
                    {
                      "name": "name",
                      "type": "felt",
                    },
                  ],
                  "stateMutability": "view",
                  "type": "function",
                },
              ],
            },
            "structs": {
              "Uint256": {
                "members": [
                  {
                    "name": "low",
                    "offset": 0,
                    "type": "felt",
                  },
                  {
                    "name": "high",
                    "offset": 1,
                    "type": "felt",
                  },
                ],
                "name": "Uint256",
                "size": 2,
                "type": "struct",
              },
            },
          },
          "callStatic": {
            "name": [Function],
          },
          "estimateFee": {
            "name": [Function],
          },
          "events": {},
          "functions": {
            "name": [Function],
          },
          "name": [Function],
          "populateTransaction": {
            "name": [Function],
          },
          "providerOrAccount": RpcProvider {
            "blockIdentifier": "pending",
            "chainId": "0x534e5f474f45524c49",
            "headers": {
              "Content-Type": "application/json",
            },
            "nodeUrl": "http://localhost:5050/rpc",
            "responseParser": RPCResponseParser {},
            "retries": 200,
          },
          "structs": {
            "Uint256": {
              "members": [
                {
                  "name": "low",
                  "offset": 0,
                  "type": "felt",
                },
                {
                  "name": "high",
                  "offset": 1,
                  "type": "felt",
                },
              ],
              "name": "Uint256",
              "size": 2,
              "type": "struct",
            },
          },
        },
      }
    `);
  });

  it("returns undefined if the address is undefined", async () => {
    const { result } = renderHook(() => useContract({ abi }));

    expect(result.current).toMatchInlineSnapshot(`
      {
        "contract": undefined,
      }
    `);
  });

  it("returns undefined if the abi is undefined", async () => {
    const { result } = renderHook(() => useContract({ address: tokenAddress }));

    expect(result.current).toMatchInlineSnapshot(`
      {
        "contract": undefined,
      }
    `);
  });
});

const abi = [
  {
    members: [
      {
        name: "low",
        offset: 0,
        type: "felt",
      },
      {
        name: "high",
        offset: 1,
        type: "felt",
      },
    ],
    name: "Uint256",
    size: 2,
    type: "struct",
  },
  {
    inputs: [
      {
        name: "name",
        type: "felt",
      },
      {
        name: "symbol",
        type: "felt",
      },
      {
        name: "recipient",
        type: "felt",
      },
    ],
    name: "constructor",
    outputs: [],
    type: "constructor",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "name",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] satisfies Abi;
