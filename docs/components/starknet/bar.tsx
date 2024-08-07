import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import type { AccountInterface } from "starknet";

export function WalletBar() {
  const { account } = useAccount();
  return (
    <div className="border-b border-gray-500 w-full px-4 py-2">
      {account ? <ConnectedWallet account={account} /> : <ConnectWallet />}
    </div>
  );
}

function ConnectedWallet({ account }: { account: AccountInterface }) {
  return <div className="flex flex-row justify-between">{account.address}</div>;
}

function ConnectWallet() {
  const { connect, connectors, status } = useConnect();

  return (
    <div className="flex flex-row justify-start space-x-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="bg-red-500 rounded px-2 py-1 text-white disabled:bg-gray-500"
          disabled={status === "pending"}
        >
          {connector.name}
        </button>
      ))}
    </div>
  );
}
