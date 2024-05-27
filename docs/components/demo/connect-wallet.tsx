import { useWalletRequest } from "@starknet-react/core";
import { DemoContainer } from "../starknet";

export function ConnectWallet() {
  return (
    <DemoContainer hasWallet>
      <WalletRequest />
    </DemoContainer>
  );
}

function WalletRequest() {
  const { request, data, isPending, isError, error } = useWalletRequest({
    type: "wallet_getPermissions",
  });

  return (
    <>
      <div>Permissions: {isPending ? "Wait..." : JSON.stringify(data)}</div>
      <div>isError: {isError ? "True" : "False"}</div>
      <div>Error: {isError ? error?.message : "Null"}</div>
      <button
        onClick={() => request()}
        className="bg-red-500 rounded px-2 py-1 text-white"
      >
        Get Wallet Permissions
      </button>
    </>
  );
}
