import type { Abi } from "abi-wan-kanabi";
import { describe, expect, it } from "vitest";
import { defaultConnector } from "../../test/devnet";
import { act, renderHook, waitFor } from "../../test/react";
import { useAccount } from "./use-account";
import { useConnect } from "./use-connect";
import { useContract } from "./use-contract";
import { useDisconnect } from "./use-disconnect";
import { useNetwork } from "./use-network";
import { usePaymasterEstimateFees } from "./use-paymaster-estimate-fees";

const STARKNET_SEPOLIA_NATIVE_TOKEN_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

function usePaymasterEstimateFeesWithConnect() {
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
    estimatePaymasterFees: usePaymasterEstimateFees({
      calls,
      options: {
        feeMode: {
          mode: "default",
          gasToken: STARKNET_SEPOLIA_NATIVE_TOKEN_ADDRESS,
        },
      },
    }),
    connect: useConnect(),
    disconnect: useDisconnect(),
  };
}

describe.skip("usePaymasterEstimateFees", () => {
  it("estimate sucessfull if account is connected", async () => {
    const { result } = renderHook(() => usePaymasterEstimateFeesWithConnect());

    await act(async () => {
      result.current.connect.connect({
        connector: defaultConnector,
      });
    });

    // Wait for the account to be initialized
    await waitFor(() => {
      expect(result.current.connect.isSuccess).toBeTruthy();
    });

    await waitFor(() => {
      expect(result.current.estimatePaymasterFees.isSuccess).toBeTruthy();
    });
  });

  it("estimate fails if account is not connected", async () => {
    const { result } = renderHook(() => usePaymasterEstimateFeesWithConnect());

    await waitFor(() => {
      expect(result.current.estimatePaymasterFees.isError).toBeTruthy();
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
