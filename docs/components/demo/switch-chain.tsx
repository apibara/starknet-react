import { sepolia } from "@starknet-react/chains";
import { useAccount, useNetwork, useSwitchChain } from "@starknet-react/core";
import { constants } from "starknet";
import { DemoContainer } from "../starknet";

export function SwitchChain() {
  return (
    <DemoContainer hasWallet>
      <SwitchChainInner />
    </DemoContainer>
  );
}

function SwitchChainInner() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { isError, isPending, data, error, switchChain } = useSwitchChain({
    params: {
      chainId:
        chain.id === sepolia.id
          ? constants.StarknetChainId.SN_MAIN
          : constants.StarknetChainId.SN_SEPOLIA,
    },
  });
  return (
    <div className="flex flex-col">
      {address ? (
        <div className="flex flex-col gap-4">
          <p className="font-bold">Current Chain: {chain.name}</p>
          <button className="button" onClick={() => switchChain()}>
            Switch Chain between Mainnet and Sepolia
          </button>
          <button
            className="button"
            onClick={() =>
              switchChain({ chainId: constants.StarknetChainId.SN_MAIN })
            }
          >
            Switch to Mainnet (Override)
          </button>
          <button
            className="button"
            onClick={() =>
              switchChain({ chainId: constants.StarknetChainId.SN_SEPOLIA })
            }
          >
            Switch to Sepolia (Override)
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
