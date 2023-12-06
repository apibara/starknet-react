"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { useAccount, useContractWrite } from '@starknet-react/core';
import { atom, useAtomValue } from 'jotai';
import { Loader2, AlertCircle, Lock } from "lucide-react";
import React from 'react'
import { selector } from 'starknet';
import { useNativeCurrency } from './accounts';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

const burnerAddressAtom = atom<string | undefined>(undefined);


const InitializeBurnerAccount = () => {
  const { contract: eth } = useNativeCurrency();
  const burnerAddress = useAtomValue(burnerAddressAtom);
  const { account: walletAccount } = useAccount();

  const { write, data, isPending, isError, error } = useContractWrite({
    calls:
      burnerAddress && walletAccount && eth
        ? [
            {
              contractAddress: burnerAddress,
              entrypoint: "update_whitelisted_calls",
              calldata: [
                "1",
                eth.address,
                selector.getSelectorFromName("transfer"),
                "1",
              ],
            },
          ]
        : [],
  });

  return (
    <div className="space-y-4 py-4">
      <p>
        <Checkbox className="mr-2" checked={Boolean(data)} />
        Step 3: initialize burner account
      </p>
      <p className="text-muted-foreground">
        The burner account needs to be initialized with a list of allowed calls
        before it can be used. This step requires a signature from the wallet
        account, so we step out of the burner context.
      </p>
      {data ? null : (
        <Button
          onClick={() => write()}
          className="w-full"
          disabled={Boolean(!walletAccount || !burnerAddress || isPending)}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Lock className="h-4 w-4 mr-2" />
          )}
          Initialize account
        </Button>
      )}
      {isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}

export default InitializeBurnerAccount;