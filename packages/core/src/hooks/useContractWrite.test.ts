import { Call, Contract } from "starknet";
import { describe, expect, it } from "vitest";
import { accounts, defaultConnector, tokenAddress } from "../../test/devnet";
import { act, renderHook, waitFor } from "../../test/react";
import { useConnect } from "./useConnect";

import { useContractWrite } from "./useContractWrite";

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
        name: "recipient",
        type: "felt",
      },
      {
        name: "amount",
        type: "Uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "success",
        type: "felt",
      },
    ],
    type: "function",
  },
];

function useTestHook({ calls }: { calls: Call[] }) {
  const writeResult = useContractWrite({
    calls,
  });
  const { connectAsync, connector } = useConnect();
  return {
    ...writeResult,
    connectAsync,
    connector,
  };
}

describe("useContractWrite", () => {
  it.skip("returns the transaction hash in the response", async () => {
    const contract = new Contract(abi, tokenAddress);
    const { result } = renderHook(() =>
      useTestHook({
        calls: [
          contract.populateTransaction.transfer(accounts.goerli[0].address, {
            low: 1,
            high: 0,
          }),
        ],
      }),
    );

    await act(async () => {
      await result.current.connectAsync({ connector: defaultConnector });
    });

    await waitFor(() => {
      expect(result.current.connector).toBeDefined();
    });

    await act(async () => {
      await result.current.writeAsync();
    });

    await waitFor(() => {
      // expect(result.current).toMatchInlineSnapshot(``);
    });
  });
});
