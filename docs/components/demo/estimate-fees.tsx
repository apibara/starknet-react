import {
  type Abi,
  useAccount,
  useContract,
  useEstimateFees,
  useNetwork,
} from "@starknet-react/core";
import {} from "starknet";
import { DemoContainer } from "../starknet";

export function EstimateFees() {
  return (
    <DemoContainer hasWallet>
      <EstimateFeesInner />
    </DemoContainer>
  );
}

function EstimateFeesInner() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { contract } = useContract({
    abi: abi,
    address: chain.nativeCurrency.address,
  });

  const { data, isError, isLoading, error } = useEstimateFees({
    calls:
      contract && address
        ? [contract.populate("transfer", [address, 1n])]
        : undefined,
  });

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-lg">Estimate Fees</h1>
      <div>isLoading: {isLoading ? "true" : "false"} </div>
      <div>isError: {isError ? "true" : "false"} </div>
      <div>error: {error ? error.message : "null"} </div>
      <div>
        Suggested Max Fee:{" "}
        {formatAmount(data?.suggestedMaxFee, chain.nativeCurrency.decimals)} ETH
      </div>
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

const formatAmount = (
  unformattedAmount: bigint | unknown,
  decimals: number,
) => {
  return Number(BigInt(unformattedAmount?.toString() || 0)) / 10 ** decimals;
};
