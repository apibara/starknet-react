"use client";

import { useConnect, Connector, useAccount } from "@starknet-react/core";
import { Dialog, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { useState } from "react";
import { WalletConnected } from "./wallet-bar";

interface Props {
  publicKey: string;
}

export const ConnectModal = ({ publicKey }: Props) => {
  const { connect, connectors } = useConnect();
  const [open, setOpen] = useState(false);
  const { address } = useAccount();

  const handleConnect = (connector: Connector) => {
    connect({ connector });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!open && !address && (
        <DialogTrigger className="hover:bg-purple px-6 py-3 rounded-lg  hover:text-white">
          Connect Wallet
        </DialogTrigger>
      )}
      {address && <WalletConnected />}
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/40" />
        <DialogContent className="bg-black/30  fixed left-1/2 top-1/2 z-30 rounded-lg p-4 -translate-x-1/2 -translate-y-1/2">
          <DialogHeader className="px-2 pb-2 flex flex-row items-center justify-between">
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogClose>X</DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {connectors.map((connector: Connector) => {
              return (
                <Button
                  key={connector.id}
                  onClick={async () => handleConnect(connector)}
                  disabled={!connector.available()}
                  className="flex flex-row items-center justify-start gap-4 w-96"
                >
                  {connector.icon.light && (
                    <img src={connector.icon.dark} className="w-10 h-10" />
                  )}
                  <p className="">Connect {connector.name}</p>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
