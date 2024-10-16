import { useAccount, useConnect } from "@starknet-react/core";
import { Button } from "../ui/button";

export function WalletBar() {
  const { address } = useAccount();

  return (
    <div className="w-full py-2 h-24 border-b border-primary">
      {address ? <ConnectedWallet address={address} /> : <ConnectWallet />}
    </div>
  );
}

function ConnectedWallet({ address }: { address: `0x${string}` }) {
  return (
    <div className="h-full flex flex-col justify-center">
      <p className="font-medium">Connected Address: </p>
      <pre>{address}</pre>
    </div>
  );
}

function ConnectWallet() {
  const { connect, connectors, status } = useConnect();

  return (
    <div className="flex h-full items-center justify-between">
      <p className="font-medium">Connect Wallet </p>
      <div className="flex flex-row justify-start space-x-2">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => {
              connect({ connector });
            }}
            // className="bg-red-500 rounded px-2 py-1 text-white disabled:bg-gray-500"
            disabled={status === "pending"}
          >
            {connector.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
