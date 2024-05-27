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
  const { request, data, isPending } = useWalletRequest({
    type: "wallet_getPermissions",
  });

  return (
    <>
      <div>Permissions: {isPending ? "Wait..." : JSON.stringify(data)}</div>
      <button
        onClick={() => request()}
        className="bg-red-500 rounded px-2 py-1 text-white"
      >
        Get Wallet Permissions
      </button>
    </>
  );
}
