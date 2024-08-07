import { describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "../../test/react";

import type { Abi } from "abi-wan-kanabi";
import { defaultConnector } from "../../test/devnet";
import { useAccount } from "./use-account";
import { useConnect } from "./use-connect";
import { useContract } from "./use-contract";
import { useDisconnect } from "./use-disconnect";
import { useEstimateFees } from "./use-estimate-fees";
import { useNetwork } from "./use-network";

function useEstimateFeesWithConnect() {
  const { chain } = useNetwork();

  const { contract } = useContract({
    abi,
    address: chain.nativeCurrency.address,
  });

  const { address } = useAccount();

  const calls =
    contract && address
      ? [contract.populate("transfer", [address, 1n])]
      : undefined;

  return {
    estimateFees: useEstimateFees({ calls }),
    connect: useConnect(),
    disconnect: useDisconnect(),
  };
}

describe.skip("useEstimateFees", () => {
  it("estimate sucessfull if account is connected", async () => {
    const { result } = renderHook(() => useEstimateFeesWithConnect());

    await act(async () => {
      result.current.connect.connect({
        connector: defaultConnector,
      });
    });

    await waitFor(() => {
      expect(result.current.estimateFees.isSuccess).toBeTruthy();
    });
  });

  it("estimate fails if account is not connected", async () => {
    const { result } = renderHook(() => useEstimateFeesWithConnect());

    await waitFor(() => {
      expect(result.current.estimateFees.isError).toBeTruthy();
    });
  });
});

const abi = [
  {
    type: "function",
    name: "transfer",
    state_mutability: "external",
    inputs: [
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "amount",
        type: "core::integer::u256",
      },
    ],
    outputs: [],
  },
] as const satisfies Abi;
