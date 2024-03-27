"use client";
import React, { useState } from "react";

import {
  useStarkName,
  useStarkAddress,
  useStarkProfile,
} from "@starknet-react/core";
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
import { mainnet } from "@starknet-react/chains";

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="address">Lookup address</TabsTrigger>
            <TabsTrigger value="name">Lookup name</TabsTrigger>
            <TabsTrigger value="profile">Lookup profile</TabsTrigger>
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
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Lookup Starknet profile</CardTitle>
                <CardDescription>
                  Lookup a Starknet ID profile by its Starknet address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LookupProfile />
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
    chainId: mainnet.id
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

function LookupProfile() {
  const [address, setAddress] = useState<string>(
    "0x01FE253BFf450209C148A4b381416837e33e244463553916B982101909111103"
  );

  const debounceAddress = useDebounce(address, 500);

  const { data, error, isLoading } = useStarkProfile({
    address: debounceAddress,
    useDefaultPfp: true,
  });

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
          <>
            <p>Name: {data?.name}</p>
            <p>Discord id: {data?.discord ?? "-"}</p>
            <p>Twitter id: {data?.twitter ?? "-"}</p>
            <p>Github id: {data?.github ?? "-"}</p>
            <p>
              Proof of personhood verification:{" "}
              {data?.proofOfPersonhood ? "true" : "-"}
            </p>
            <p>Profile picture metadata uri : {data?.profile}</p>
            <p>Profile picture uri : {data?.profilePicture}</p>
          </>
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
