import {
  type UseSignTypedDataArgs,
  useSignTypedData,
} from "@starknet-react/core";
import stringify from "safe-stable-stringify";
import { shortString } from "starknet";
import { DemoContainer } from "../starknet";
import { Button } from "../ui/button";

export function SignTypedData() {
  return (
    <DemoContainer hasWallet>
      <SignTypedDataInner />
    </DemoContainer>
  );
}

function SignTypedDataInner() {
  const { isError, isPending, data, error, signTypedData } = useSignTypedData({
    params: typedData,
  });
  return (
    <div className="flex flex-col gap-4">
      <p>Typed Data</p>
      <a
        className="underline text-blue-400 text-xs"
        href="https://github.com/PhilippeR26/Starknet-WalletAccount/blob/main/doc/walletAPIspec.md#example--9"
      >
        Reference{" "}
      </a>
      <pre>{stringify(typedData, null, 2)}</pre>

      <p>Response</p>
      <pre>
        {stringify(
          {
            data,
            isPending,
            isError,
            error: error?.message,
          },
          null,
          2,
        )}
      </pre>

      <Button onClick={() => signTypedData()}>Sign</Button>
    </div>
  );
}

// Reference: https://github.com/PhilippeR26/Starknet-WalletAccount/blob/main/doc/walletAPIspec.md#example--9
const typedData: UseSignTypedDataArgs = {
  message: {
    id: "0x0000004f000f",
    from: "0x2c94f628d125cd0e86eaefea735ba24c262b9a441728f63e5776661829a4066",
    amount: "400",
    nameGamer: "Hector26",
    endDate:
      "0x27d32a3033df4277caa9e9396100b7ca8c66a4ef8ea5f6765b91a7c17f0109c",
    itemsAuthorized: ["0x01", "0x03", "0x0a", "0x0e"],
    chkFunction: "check_authorization",
    rootList: [
      {
        address:
          "0x69b49c2cc8b16e80e86bfc5b0614a59aa8c9b601569c7b80dde04d3f3151b79",
        amount: "1554785",
      },
    ],
  },
  types: {
    StarkNetDomain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "string" },
    ],
    Airdrop: [
      { name: "address", type: "string" },
      { name: "amount", type: "string" },
    ],
    Validate: [
      { name: "id", type: "string" },
      { name: "from", type: "string" },
      { name: "amount", type: "string" },
      { name: "nameGamer", type: "string" },
      { name: "endDate", type: "string" },
      { name: "itemsAuthorized", type: "string*" }, // array of string
      { name: "chkFunction", type: "selector" }, // name of function
      { name: "rootList", type: "merkletree", contains: "Airdrop" }, // root of a merkle tree
    ],
  },
  primaryType: "Validate",
  domain: {
    name: "myDapp",
    version: "1",
    chainId: shortString.encodeShortString("SN_SEPOLIA"),
  },
};
