"use client";
import React from "react";

import { useAccount, useDisconnect } from "@starknet-react/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DisconnectModal() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const addressShort = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return (
    <div className="w-full flex justify-end">
      <Dialog>
        <DialogTrigger>
          <Button variant="ghost">{addressShort}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Disconnect Wallet</DialogHeader>
          <div className="flex flex-col gap-4">
            <Button onClick={() => disconnect()}>Disconnect</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
