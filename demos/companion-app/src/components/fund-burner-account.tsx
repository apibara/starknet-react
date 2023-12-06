"use client";

import { FUNDING_AMOUNT } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { atom, useAtom } from "jotai";
import { Loader2, ArrowDownToLine, AlertCircle } from "lucide-react";
import React, { useCallback } from "react";
import { uint256 } from "starknet";
import { useNativeCurrency } from "./accounts";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

const burnerAddressAtom = atom<string | undefined>(undefined);

const FundBurnerAccount = ({ address }: { address?: string }) => {
  const [fundedAddress, setFundedAddress] = useAtom(burnerAddressAtom);

  const { account: mainAccount } = useAccount();
  const { contract: eth } = useNativeCurrency();

  const { writeAsync, isPending, error } = useContractWrite({
    calls:
      eth && mainAccount && address
        ? [
            eth.populateTransaction["transfer"]!(
              address,
              uint256.bnToUint256(FUNDING_AMOUNT)
            ),
          ]
        : [],
  });
  const fundAccount = useCallback(async () => {
    await writeAsync();
    setFundedAddress(address);
  }, [setFundedAddress, address, writeAsync]);

  return (
    <div className="space-y-4 pb-4">
      <p>
        <Checkbox className="mr-2" checked={Boolean(fundedAddress)} />
        Step 1: fund burner account
      </p>
      <p className="text-muted-foreground">
        You need to fund the burner account before you can deploy it. We are
        going to transfer 0.0001 ETH to the burner account.
      </p>
      {fundedAddress ? null : (
        <Button
          onClick={() => fundAccount()}
          className="w-full"
          disabled={Boolean(!address || fundedAddress || isPending)}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowDownToLine className="h-4 w-4 mr-2" />
          )}
          Fund account
        </Button>
      )}
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};

export default FundBurnerAccount;
