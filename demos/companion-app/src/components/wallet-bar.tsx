"use client";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export const WalletConnected = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <div className="flex justify-center items-center gap-4">
      <span>Connected: {shortenedAddress}</span>
      <button
        className="bg-gray-500 px-4 py-2 rounded-md "
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
};

function ConnectWallet() {
  const { connectors, connect } = useConnect();

  return (
    <div>
      <span>Choose a wallet: </span>
      {connectors.map((connector) => {
        return (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="gap-x-2 mr-2"
          >
            {connector.id}
          </Button>
        );
      })}
    </div>
  );
}

export default function WalletBar() {
  const { address } = useAccount();

  return address ? <WalletConnected /> : <ConnectWallet />;
}
