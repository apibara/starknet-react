import {
  useAccount,
  useContract,
  useNetwork,
  useSendTransaction,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { DemoContainer } from "../starknet";

export function SendTransaction() {
  return (
    <DemoContainer hasWallet>
      <SendTransactionInner />
    </DemoContainer>
  );
}

function SendTransactionInner() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { contract } = useContract({
    abi,
    address: chain.nativeCurrency.address,
  });

  const { isError, error, send } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("transfer", [address, 1n])]
        : undefined,
  });

  return (
    <div className="flex flex-col">
      {address ? (
        <div>
          <button onClick={() => send()}>Send Transaction</button>
          {isError && <p>Error: {error?.message}</p>}
        </div>
      ) : (
        <p>Connect your wallet to start.</p>
      )}
    </div>
  );
}

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
