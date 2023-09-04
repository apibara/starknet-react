"use client";
import React from "react";

import { useBalance, useNetwork } from "@starknet-react/core";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

import { StarknetProvider } from "@/components/starknet/provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "../ui/label";

function TokenBalance() {
  const { chain } = useNetwork();
  const [address, setAddress] = useState(
    chain.nativeCurrency.address as string,
  );

  const { data, error, isLoading } = useBalance({
    address,
    watch: false,
  });

  return (
    <Card className="max-w-[400px] mx-auto">
      <CardHeader>
        <CardTitle>Lookup token balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <p>
          {isLoading
            ? "Loading..."
            : `Balance: ${data?.formatted} ${data?.symbol}`}
        </p>
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

export function TokenBalanceDemo() {
  return (
    <StarknetProvider>
      <TokenBalance />
    </StarknetProvider>
  );
}
