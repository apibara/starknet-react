"use client";
import React, { useState } from "react";

import { BlockTag } from "starknet";
import { useContractRead, useNetwork } from "@starknet-react/core";

import { StarknetProvider } from "@/components/starknet/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";

function ContractRead() {
  const [blockIdentifier, setBlockIdentifier] = useState("latest");
  const [enabled, setEnabled] = useState(false);

  const { chain } = useNetwork();

  const { data, refetch, fetchStatus, status } = useContractRead({
    abi: [
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            name: "symbol",
            type: "felt",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "symbol",
    address: chain.nativeCurrency.address,
    args: [],
    watch: true,
    enabled,
    blockIdentifier:
      blockIdentifier === "latest" ? BlockTag.latest : BlockTag.pending,
  });

  // Cast bigint into string to avoid "TypeError: Do not know how to serialize a BigInt"
  // See https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-521460510
  const callResult = JSON.stringify(data, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

  return (
    <Card className="max-w-[400px] mx-auto">
      <CardHeader>
        <CardTitle>Contract read</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Block identifier</Label>
          <Select value={blockIdentifier} onValueChange={setBlockIdentifier}>
            <SelectTrigger className="w[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 flex items-center space-x-2">
          <Checkbox
            id="enableQuery"
            checked={enabled}
            onCheckedChange={(c) => setEnabled(c === true)}
          />
          <Label
            htmlFor="enableQuery"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable Query
          </Label>
        </div>
        <div className="space-y-1">
          <Label>Fetch status</Label>
          <p>{fetchStatus}</p>
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <p>{status}</p>
        </div>
        <div className="space-y-1">
          <Label>Call result</Label>
          <p>{callResult}</p>
        </div>
        <div className="space-y-1">
          <Button onClick={() => refetch()}>Refetch data</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContractReadDemo() {
  return (
    <StarknetProvider>
      <ContractRead />
    </StarknetProvider>
  );
}
