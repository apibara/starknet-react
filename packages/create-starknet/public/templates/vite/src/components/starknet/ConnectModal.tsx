"use client";
import { Connector, useConnect } from "@starknet-react/core";
import React from "react";
import { Button } from "../ui/Button";
import Dialog from "../ui/Dialog";

export default function ConnectModal() {
  const { connect, connectors } = useConnect();

  console.log(connectors);
  return (
    <Dialog title="Connect Wallet">
      <div className="flex flex-col gap-2">
        {connectors.map((connector: Connector) => {
          return (
            <Button
              key={connector.id}
              onClick={async () =>
                connector.available() ? connect({ connector }) : null
              }
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
    </Dialog>
  );
}
