"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DeployAccountVariables,
  useAccount,
  useDeployAccount,
} from "@starknet-react/core";
import { atom, useAtom } from "jotai";
import { Loader2, Shield, AlertCircle } from "lucide-react";
import React, { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const burnerDeployTxAtom = atom<string | undefined>(undefined);

const DeployBurnerAccount = ({
  deployAccountArgs = {},
}: {
  deployAccountArgs?: DeployAccountVariables;
}) => {
  const { address } = useAccount();
  const [deployTx, setDeployTx] = useAtom(burnerDeployTxAtom);
  const { deployAccount, data, error, isError, isPending } =
    useDeployAccount(deployAccountArgs);

  useEffect(() => {
    if (data?.transaction_hash) {
      setDeployTx(data.transaction_hash);
    }
  }, [data, setDeployTx]);

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle>Burner account context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p>
            <Checkbox className="mr-2" checked={Boolean(data)} />
            Step 2: deploy burner account
          </p>
          <p className="text-muted-foreground">
            Deploy the account. The deployment fee will be paid out by the
            pre-funded amount. The `useDeployAccount` hook deploys the current
            account, so we call it from inside the burner account context.
          </p>
          {deployTx ? null : (
            <Button
              onClick={() => deployAccount({})}
              className="w-full"
              disabled={Boolean(!address || data || isPending)}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Deploy Account
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
      </CardContent>
    </Card>
  );
};

export default DeployBurnerAccount;
