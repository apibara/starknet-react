import { describe, expect, it } from "vitest";
import { accounts, tokenAddress } from "../../test/devnet";
import { renderHook, waitFor } from "../../test/react";

import { useReadContract } from "./use-read-contract";

const abi = [
  {
    name: "core::integer::u256",
    type: "struct",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [
      {
        type: "core::integer::u256",
      },
    ],
    state_mutability: "view",
  },
] as const;

describe("useReadContract", () => {
  it("returns the contract read result", async () => {
    const { result } = renderHook(() =>
      useReadContract({
        functionName: "balanceOf",
        args: [accounts.sepolia[0].address],
        abi,
        address: tokenAddress,
        watch: true,
      }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy();
    });
  });
});
