import { describe, expect, it } from "vitest";
import { accounts, tokenAddress } from "../../test/devnet";
import { renderHook, waitFor } from "../../test/react";

import { useCall } from "./useCall";

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
    name: "balanceOf",
    type: "function",
    inputs: [
      {
        name: "account",
        type: "felt",
      },
    ],
    outputs: [
      {
        name: "balance",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
  },
];

describe("useCall", () => {
  it.skip("returns the contract read result", async () => {
    const { result } = renderHook(() =>
      useCall({
        functionName: "balanceOf",
        args: [accounts.goerli[0].address],
        abi,
        address: tokenAddress,
        watch: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy();
    });
  });
});
