import { Address, useStarkName } from "@starknet-react/core";
import { useState } from "react";
import { DemoContainer } from "../starknet";

export function StarkName() {
  return (
    <DemoContainer hasWallet>
      <StarkNameInner />
    </DemoContainer>
  );
}

function StarkNameInner() {
  const [address, setAddress] = useState(
    "0x7cffe72748da43594c5924129b4f18bffe643270a96b8760a6f2e2db49d9732",
  );

  const { data, isLoading, isError, error } = useStarkName({
    address: address as Address,
  });

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-lg">Stark Name</h1>
      <div className="flex items-center gap-2">
        Address:{" "}
        <input
          placeholder="0x7cffe72748da43594c5924129b4f18bffe643270a96b8760a6f2e2db49d9732"
          className="rounded-md focus:outline-none placeholder:text-white/20 px-2 flex-grow"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />{" "}
      </div>
      <div>isLoading: {isLoading ? "true" : "false"} </div>
      <div>isError: {isError ? "true" : "false"} </div>
      <div>error: {error ? error.message : "null"} </div>
      <div>address: {data} </div>
    </div>
  );
}
