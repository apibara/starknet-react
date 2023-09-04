"use client";
import React from "react";

import { useAccount } from "@starknet-react/core";

import { StarknetProvider } from "@/components/starknet/provider";
import ConnectWallet from "@/components/starknet/connect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConnectWalletDemo() {
  return (
    <StarknetProvider>
      <ConnectWallet />
      <Inner />
    </StarknetProvider>
  );
}

function Inner() {
  const { address } = useAccount();
  const addressShort = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;
  return (
    <Card className="max-w-[400px] mx-auto">
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          {address
            ? `Connected as ${addressShort}`
            : "Connect wallet to get started"}
        </p>
      </CardContent>
    </Card>
  );
}
