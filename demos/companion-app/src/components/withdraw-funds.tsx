"use client";

import { useAccount, useContractWrite } from "@starknet-react/core";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { AlertCircle, ArrowUpToLine, Loader2 } from "lucide-react";

import { uint256 } from "starknet";
import { FUNDING_AMOUNT } from "@/lib/constants";

import { useNativeCurrency } from "./accounts";

const WithdrawFunds = ({ walletAddress }: { walletAddress?: string }) => {
  const { contract: eth } = useNativeCurrency();
  const { address } = useAccount();

  const { write, data, isPending, isError, error } = useContractWrite({
    calls:
      eth && address && walletAddress
        ? [
            eth.populateTransaction["transfer"]!(
              walletAddress,
              uint256.bnToUint256(FUNDING_AMOUNT / 2n)
            ),
          ]
        : [],
  });

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle>Burner account context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p>
            <Checkbox className="mr-2" checked={Boolean(data)} />
            Step 4: withdraw funds back to wallet
          </p>
          <p className="text-muted-foreground">
            We can now transfer some of the burner account funds back to the
            wallet account. Notice how the transaction doesn&apos;t require a
            signature from the wallet account.
          </p>
        </div>
        {data ? null : (
          <Button
            onClick={() => write()}
            className="w-full"
            disabled={Boolean(!address || !walletAddress || isPending)}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ArrowUpToLine className="h-4 w-4 mr-2" />
            )}
            Withdraw funds
          </Button>
        )}
        {data ? <p className="font-mono">{data.transaction_hash}</p> : null}
        {isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error?.message}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WithdrawFunds;
