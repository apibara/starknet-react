import { useStarkProfile } from "@starknet-react/core";
import { useState } from "react";
import { DemoContainer } from "../starknet";

export function StarkProfile() {
  return (
    <DemoContainer hasWallet>
      <StarkProfileInner />
    </DemoContainer>
  );
}

function StarkProfileInner() {
  const [address, setAddress] = useState(
    "0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3",
  );

  const { data, isLoading, isError, error } = useStarkProfile({
    address,
  });

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-lg">Stark Profile</h1>
      <div className="flex items-center gap-2">
        Address:{" "}
        <input
          placeholder="0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3"
          className="rounded-md focus:outline-none placeholder:text-white/20 px-2 flex-grow"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />{" "}
      </div>
      <div>isLoading: {isLoading ? "true" : "false"} </div>
      <div>isError: {isError ? "true" : "false"} </div>
      <div>error: {error ? error.message : "null"} </div>
      <div>profile: {JSON.stringify(data)} </div>
    </div>
  );
}
