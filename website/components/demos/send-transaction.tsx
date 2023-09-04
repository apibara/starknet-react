"use client";
import React, { useMemo, useState } from "react";

import {
  useAccount,
  useContract,
  useContractWrite,
  useNetwork,
} from "@starknet-react/core";
import { Plus, Minus, SendHorizonal, Loader2, AlertCircle } from "lucide-react";
import { uint256 } from "starknet";

import { StarknetProvider } from "@/components/starknet/provider";
import ConnectWallet from "@/components/starknet/connect";
import { Button } from "@/components/ui/button";
import { erc20ABI } from "@/lib/erc20";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function Inner() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { contract } = useContract({
    abi: erc20ABI,
    address: chain.nativeCurrency.address,
  });

  const [count, setCount] = useState(1);

  const calls = useMemo(() => {
    if (!address || !contract) return [];

    return Array.from({ length: count }, (_, i) => {
      const amount = uint256.bnToUint256(BigInt(i));
      return contract.populateTransaction["transfer"]!(address, amount);
    });
  }, [contract, address, count]);

  const { write, isLoading, error } = useContractWrite({
    calls,
  });

  return (
    <Card className="mx-auto max-w-[400px]">
      <CardHeader>
        <CardTitle>Send Transaction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Change the number of transactions to send:</p>
        <div className="w-full flex flex-row justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCount((c) => Math.max(0, c - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="mx-8 text-center">{count}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCount((c) => c + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="w-full"
          onClick={() => write({})}
          disabled={!address || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4 mr-2" />
          )}
          Send Transactions
        </Button>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SendTransactionDemo() {
  return (
    <StarknetProvider>
      <ConnectWallet />
      <Inner />
    </StarknetProvider>
  );
}
