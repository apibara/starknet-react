import type { Abi } from "abi-wan-kanabi";
import { describe, expect, it } from "vitest";
import { defaultConnector } from "../../test/devnet";
import { act, renderHook, waitFor } from "../../test/react";
import { useAccount } from "./use-account";
import { useConnect } from "./use-connect";
import { useContract } from "./use-contract";
import { useDisconnect } from "./use-disconnect";
import { useNetwork } from "./use-network";
import { useSendTransaction } from "./use-send-transaction";

function useSendTransactionWithConnect() {
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
    sendTransaction: useSendTransaction({ calls }),
    connect: useConnect(),
    disconnect: useDisconnect(),
  };
}

describe.skip("useSendTransaction", () => {
  it("sends a transaction sucessfully", async () => {
    const { result } = renderHook(() => useSendTransactionWithConnect());

    await act(async () => {
      result.current.connect.connect({
        connector: defaultConnector,
      });
    });

    await act(async () => {
      result.current.sendTransaction.send();
    });

    await waitFor(() => {
      expect(result.current.sendTransaction.isSuccess).toBeTruthy();
    });
  });

  it("throws error if user rejects transaction", async () => {
    const { result } = renderHook(() => useSendTransactionWithConnect(), {
      connectorOptions: { rejectRequest: true },
    });
    await act(async () => {
      result.current.connect.connect({
        connector: defaultConnector,
      });
    });

    await act(async () => {
      result.current.sendTransaction.send();
    });

    await waitFor(() => {
      expect(result.current.sendTransaction.isError).toBeTruthy();
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
