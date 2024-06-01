import React from "react";

import { useAccount, useNetwork, useSignTypedData } from "@starknet-react/core";
import { Loader2, PenLine } from "lucide-react";

import { StarknetProvider } from "@/components/starknet/provider";
import ConnectWallet from "@/components/starknet/connect";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SignMessageDemo() {
  return (
    <StarknetProvider>
      <ConnectWallet />
      <Inner />
    </StarknetProvider>
  );
}

function Inner() {
  const { account } = useAccount();
  const { chain } = useNetwork();
  const payload = exampleData(`0x${chain.id.toString(16)}`);
  const { data, isPending, signTypedData } = useSignTypedData(payload);

  return (
    <Card className="max-w-[400px] mx-auto">
      <CardHeader>
        <CardTitle>Sign Message</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Sign a message using the Starknet wallet</p>
        <Button
          className="w-full"
          onClick={() => signTypedData()}
          disabled={!account}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <PenLine className="h-4 w-4 mr-2" />
          )}
          Sign Message
        </Button>
        {data ? (
          <div className="w-full space-y-2">
            <p>Signature</p>
            <pre className="w-full text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

const exampleData = (chainId: string) => ({
  types: {
    StarkNetDomain: [
      { name: "name", type: "felt" },
      { name: "version", type: "felt" },
      { name: "chainId", type: "felt" },
    ],
    Person: [
      { name: "name", type: "felt" },
      { name: "wallet", type: "felt" },
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "felt" },
    ],
  },
  primaryType: "Mail",
  domain: {
    name: "Starknet Mail",
    version: "1",
    chainId,
  },
  message: {
    from: {
      name: "Cow",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
    },
    contents: "Hello, Bob!",
  },
});
