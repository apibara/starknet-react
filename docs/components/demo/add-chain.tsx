import { UseAddChainArgs, useAccount, useAddChain } from "@starknet-react/core";
import { shortString } from "starknet";
import { DemoContainer } from "../starknet";

export function AddChain() {
  return (
    <DemoContainer hasWallet>
      <AddChainInner />
    </DemoContainer>
  );
}

function AddChainInner() {
  const { address } = useAccount();
  const chainData: UseAddChainArgs = {
    id: "ZORG",
    chain_id: shortString.encodeShortString("ZORG"),
    chain_name: "ZORG",
    rpc_urls: ["http://192.168.1.44:6060"],
    native_currency: {
      type: "ERC20",
      options: {
        address:
          "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        name: "ETHER",
        symbol: "ETH",
        decimals: 18,
      },
    },
  };
  const { isError, isPending, data, error, addChain } = useAddChain({
    params: chainData,
  });
  return (
    <div className="flex flex-col">
      {address ? (
        <div className="flex flex-col gap-4">
          <p className="font-bold">Chain to Add:</p>
          <pre className="font-bold break-words whitespace-break-spaces">
            {JSON.stringify(chainData)}
          </pre>
          <button className="button" onClick={() => addChain()}>
            Add Chain
          </button>
          <button className="button" onClick={() => addChain(chainData)}>
            Add Chain (override)
          </button>
        </div>
      ) : (
        <p className="font-bold mb-4">Connect wallet first</p>
      )}

      <div>isPending: {isPending ? "true" : "false"} </div>
      <div>isError: {isError ? "true" : "false"} </div>
      <div>error: {error ? error.message : "null"} </div>
      <div>data: {data ? JSON.stringify(data) : "null"} </div>
    </div>
  );
}
