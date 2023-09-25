"use client";
import React, { useState } from "react";

import { useStarkName, useStarkAddress } from "@starknet-react/core";
import { AlertCircle, Loader2 } from "lucide-react";
import { useDebounce } from "usehooks-ts";

import { StarknetProvider } from "@/components/starknet/provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function StarknetIDDemo() {
  return (
    <StarknetProvider>
      <Inner />
    </StarknetProvider>
  );
}

function Inner() {
  return (
    <div className="w-full">
      <div className="max-w-[600px] mx-auto">
        <Tabs defaultValue="address" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="address">Lookup address</TabsTrigger>
            <TabsTrigger value="name">Lookup name</TabsTrigger>
          </TabsList>
          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Lookup address</CardTitle>
                <CardDescription>
                  Lookup a Starknet address by its Starknet ID.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LookupAddress />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="name">
            <Card>
              <CardHeader>
                <CardTitle>Lookup name</CardTitle>
                <CardDescription>
                  Lookup a Starknet ID by its Starknet address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LookupName />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LookupAddress() {
  const [starknetId, setStarknetId] = useState<string>("");

  const debouncedStarknetId = useDebounce(starknetId, 500);

  const { data, error, isLoading } = useStarkAddress({
    name: debouncedStarknetId,
  });

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="starknet-id">Starknet ID</Label>
        <Input
          id="starknet-id"
          placeholder="vitalik.stark"
          value={starknetId}
          onChange={(evt) => setStarknetId(evt.target.value)}
        />
      </div>
      <div className="space-y-1">
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <p>Address: {data}</p>
        )}
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}

function LookupName() {
  const [address, setAddress] = useState<string>("");

  const debounceAddress = useDebounce(address, 500);

  const { data, error, isLoading } = useStarkName({ address: debounceAddress });

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="0x0508...8775"
          value={address}
          onChange={(evt) => setAddress(evt.target.value)}
        />
      </div>
      <div className="space-y-1">
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <p>Name: {data}</p>
        )}
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
