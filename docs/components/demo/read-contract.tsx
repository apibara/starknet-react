"use client";
import { useState } from "react";

import { useNetwork, useReadContract } from "@starknet-react/core";
import { BlockTag } from "starknet";

import { DemoContainer } from "../starknet";

export function ReadContractInner() {
  const [blockIdentifier, setBlockIdentifier] = useState("latest");
  const { chain } = useNetwork();

  const { data, refetch, fetchStatus, status, error } = useReadContract({
    abi: [
      {
        name: "symbol",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
    ] as const,
    functionName: "symbol",
    address: chain.nativeCurrency.address,
    args: [],
    watch: true,
    blockIdentifier:
      blockIdentifier === "latest" ? BlockTag.LATEST : BlockTag.PENDING,
  });

  // Cast bigint into string to avoid "TypeError: Do not know how to serialize a BigInt"
  // See https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-521460510
  const callResult = JSON.stringify(data, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );

  return (
    <div>
      <h1 className="font-bold text-lg">Contract read</h1>
      <div>blockIdentifier: {blockIdentifier} </div>
      <div>fetchStatus: {fetchStatus} </div>
      <div>Status: {status} </div>
      <div>Call result: {callResult} </div>
      <button
        className="bg-white text-black px-4 py-2 mt-4 rounded-md"
        onClick={() => refetch()}
      >
        Refetch data
      </button>
    </div>
  );
}

export function ReadContract() {
  return (
    <DemoContainer>
      <ReadContractInner />
    </DemoContainer>
  );
}
