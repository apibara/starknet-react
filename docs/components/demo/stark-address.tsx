import { useStarkAddress } from "@starknet-react/core";
import { useState } from "react";
import { DemoContainer } from "../starknet";

export function StarkAddress() {
  return (
    <DemoContainer hasWallet>
      <StarkAddressInner />
    </DemoContainer>
  );
}

function StarkAddressInner() {
  const [name, setName] = useState("vitalik.stark");

  const { data, isLoading, isError, error } = useStarkAddress({
    name,
  });

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-lg">Stark Address</h1>
      <div className="flex items-center gap-2">
        name:{" "}
        <input
          placeholder="vitalik.eth"
          className="rounded-md focus:outline-none placeholder:text-white/20 px-2 flex-grow"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />{" "}
      </div>
      <div>isLoading: {isLoading ? "true" : "false"} </div>
      <div>isError: {isError ? "true" : "false"} </div>
      <div>error: {error ? error.message : "null"} </div>
      <div>address: {data} </div>
    </div>
  );
}
