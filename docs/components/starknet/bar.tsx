import { useAccount, useConnect } from "@starknet-react/core";
import { Button } from "../ui/button";

export function WalletBar() {
  const { address } = useAccount();

  return (
    <div className="w-full py-6 border-b border-primary">
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
    <div className="flex h-full items-start justify-between">
      <p className="font-medium mr-2 mt-1 text-nowrap">Connect Wallet </p>
      <div className="flex justify-center flex-wrap gap-2">
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
            <img
              src={
                typeof connector.icon === "string"
                  ? connector.icon
                  : connector.icon.dark
              }
              className="w-6 ml-2"
              alt={connector.name}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
