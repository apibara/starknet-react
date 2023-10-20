"use client";
import React, { useCallback } from "react";

import {
  useAccount,
  useContract,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "@starknet-react/core";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SendHorizonal, Loader2 } from "lucide-react";
import { uint256 } from "starknet";

import { StarknetProvider } from "@/components/starknet/provider";
import ConnectWallet from "@/components/starknet/connect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { erc20ABI } from "@/lib/erc20";

const transactionListAtom = atomWithStorage<string[]>("userTransactions", []);

function useTransactionList() {
  const [value, setValue] = useAtom(transactionListAtom);

  return {
    hashes: value,
    add: (hash: string) => setValue((prev) => [...prev, hash]),
  };
}

export function TransactionManagerDemo() {
  return (
    <StarknetProvider>
      <ConnectWallet />
      <Inner />
    </StarknetProvider>
  );
}

function Inner() {
  const amount = uint256.bnToUint256(1n);
  const { hashes, add } = useTransactionList();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { contract } = useContract({
    abi: erc20ABI,
    address: chain.nativeCurrency.address,
  });

  const { writeAsync, isLoading } = useContractWrite({
    calls: address
      ? [contract?.populateTransaction["transfer"]!(address, amount)]
      : [],
  });

  const submitTx = useCallback(async () => {
    const tx = await writeAsync();
    add(tx.transaction_hash);
  }, [writeAsync]);

  return (
    <Card className="max-w-[400px] mx-auto">
      <CardHeader>
        <CardTitle>Transaction Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="default"
          onClick={submitTx}
          className="w-full"
          disabled={!address}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4 mr-2" />
          )}
          Submit Transaction
        </Button>
        <Separator />
        <div className="space-y-4">
          <div className="hidden last:block">
            Submitted transactions will appear here.
          </div>
          {hashes.map((hash) => (
            <TransactionStatus key={hash} hash={hash} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionStatus({ hash }: { hash: string }) {
  const { data, error, isLoading, isError } = useWaitForTransaction({
    hash,
    watch: true,
    retry: true,
  });

  return (
    <div className="flex items-center w-full">
      <div className="space-y-1 w-full">
        <p className="text-sm font-medium leading-none overflow-hidden text-ellipsis">
          {hash}
        </p>
        <p className="text-sm font-muted-foreground">
          {isLoading
            ? "Loading..."
            : isError
            ? error?.message
            : data?.status === "REJECTED"
            ? `${data?.status}`
            : `${data?.execution_status} - ${data?.finality_status}`}
        </p>
      </div>
    </div>
  );
}
