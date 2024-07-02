import { describe, expect, it } from "vitest";
import { tokenAddress } from "../../test/devnet";
import { renderHook } from "../../test/react";

import { useContract } from "./use-contract";

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
                  "type": "felt",
                },
                {
                  "name": "high",
                  "type": "felt",
                },
              ],
              "name": "Uint256",
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
              "type": "constructor",
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "type": "felt",
                },
              ],
              "state_mutability": "view",
              "type": "function",
            },
          ],
          "address": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "callData": _CallData {
            "abi": [
              {
                "members": [
                  {
                    "name": "low",
                    "type": "felt",
                  },
                  {
                    "name": "high",
                    "type": "felt",
                  },
                ],
                "name": "Uint256",
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
                "type": "constructor",
              },
              {
                "inputs": [],
                "name": "name",
                "outputs": [
                  {
                    "type": "felt",
                  },
                ],
                "state_mutability": "view",
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
                      "type": "felt",
                    },
                    {
                      "name": "high",
                      "type": "felt",
                    },
                  ],
                  "name": "Uint256",
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
                  "type": "constructor",
                },
                {
                  "inputs": [],
                  "name": "name",
                  "outputs": [
                    {
                      "type": "felt",
                    },
                  ],
                  "state_mutability": "view",
                  "type": "function",
                },
              ],
            },
            "structs": {
              "Uint256": {
                "members": [
                  {
                    "name": "low",
                    "type": "felt",
                  },
                  {
                    "name": "high",
                    "type": "felt",
                  },
                ],
                "name": "Uint256",
                "type": "struct",
              },
            },
          },
          "callStatic": {
            "name": [Function],
          },
          "deployTransactionHash": undefined,
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
          "providerOrAccount": RpcProvider2 {
            "channel": RpcChannel2 {
              "blockIdentifier": "pending",
              "chainId": "0x534e5f5345504f4c4941",
              "headers": {
                "Content-Type": "application/json",
              },
              "nodeUrl": "http://localhost:5050/rpc",
              "requestId": 0,
              "retries": 200,
              "specVersion": undefined,
              "transactionRetryIntervalFallback": undefined,
              "waitMode": false,
            },
            "getStateUpdate": [Function],
            "responseParser": RPCResponseParser {
              "margin": undefined,
            },
          },
          "structs": {
            "Uint256": {
              "members": [
                {
                  "name": "low",
                  "type": "felt",
                },
                {
                  "name": "high",
                  "type": "felt",
                },
              ],
              "name": "Uint256",
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
        type: "felt",
      },
      {
        name: "high",
        type: "felt",
      },
    ],
    name: "Uint256",
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
    type: "constructor",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        type: "felt",
      },
    ],
    state_mutability: "view",
    type: "function",
  },
] as const;
