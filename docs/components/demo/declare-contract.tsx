import {
  type UseDeclareContractArgs,
  useAccount,
  useDeclareContract,
} from "@starknet-react/core";
import { DemoContainer } from "../starknet";

export function DeclareContract() {
  return (
    <DemoContainer hasWallet>
      <DeclareContractInner />
    </DemoContainer>
  );
}

function DeclareContractInner() {
  const { address } = useAccount();
  const { isError, isPending, data, error, declare } = useDeclareContract({
    params,
  });
  return (
    <div className="flex flex-col">
      {address ? (
        <div className="flex flex-col gap-4">
          <button className="button" onClick={() => declare()}>
            Sign
          </button>
          <pre className="whitespace-pre-wrap break-words">
            <code>{JSON.stringify(params)}</code>
          </pre>
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

// TODO
const params: UseDeclareContractArgs = {
  compiled_class_hash: "",
  contract_class: {
    abi: "",
    contract_class_version: "",
    sierra_program: [""],
    entry_points_by_type: {
      CONSTRUCTOR: [
        {
          function_idx: 1,
          selector: "",
        },
      ],
      EXTERNAL: [
        {
          function_idx: 1,
          selector: "",
        },
      ],
      L1_HANDLER: [
        {
          function_idx: 1,
          selector: "",
        },
      ],
    },
  },
};
