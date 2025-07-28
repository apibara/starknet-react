"use client";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useMemo } from "react";
import { Button } from "../ui/button";

function WalletConnected() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <div className="flex items-center gap-4">
      <span>Connected: {shortenedAddress}</span>
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
  );
}

function ConnectWallet() {
  const { connectors, connect } = useConnect();

  return (
    <div>
      <span className="mr-4">Connect wallet:</span>
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="mr-2"
        >
          {connector.id}
        </Button>
      ))}
    </div>
  );
}

export default function WalletBar() {
  const { address } = useAccount();
  return address ? <WalletConnected /> : <ConnectWallet />;
}
