import { type AccountInterface } from "starknet";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

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
  const { connect, connectors } = useConnect();

  return (
    <div className="flex flex-row justify-start space-x-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="bg-red-500 rounded px-2 py-1 text-white"
        >
          {connector.name}
        </button>
      ))}
    </div>
  );
}
