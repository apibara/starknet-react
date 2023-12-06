"use client";
import React, { useMemo } from "react";

import {
  OverrideAccount,
  useAccount,
  useContract,
  useNetwork,
  useProvider,
} from "@starknet-react/core";
import { atom, useAtomValue } from "jotai";
import {
  Account,
  AccountInterface,
  CallData,
  ec,
  hash,
  stark,
} from "starknet";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { erc20ABI } from "@/lib/erc20";
import FundBurnerAccount from "./fund-burner-account";
import DeployBurnerAccount from "./deploy-burner-account";
import InitializeBurnerAccount from "./initialize-burner-account";
import WithdrawFunds from "./withdraw-funds";

const BURNER_CLASS_HASH =
  "0x0715b5e10bf63c36e69c402a81e1eb96b9107ef56eb5e821b00893e39bdcf545";

const burnerAddressAtom = atom<string | undefined>(undefined);

export function useNativeCurrency() {
  const { chain } = useNetwork();
  return useContract({
    address: chain.nativeCurrency.address,
    abi: erc20ABI,
  });
}

export default function Outer() {
  const { provider } = useProvider();
  const { address } = useAccount();

  const fundedBurnerAddress = useAtomValue(burnerAddressAtom);

  const { deployAccountArgs, burnerAccount } = useMemo(() => {
    if (!address) {
      return {
        deployAccountArgs: undefined,
        burnerAccount: undefined,
      };
    }

    // generate burner account
    const privateKey = stark.randomAddress();
    const publicKey = ec.starkCurve.getStarkKey(privateKey);

    const constructorCalldata = CallData.compile({
      _public_key: publicKey,
      _master_account: address,
    });

    const burnerAddress = hash.calculateContractAddressFromHash(
      publicKey,
      BURNER_CLASS_HASH,
      constructorCalldata,
      0,
    );
    const burnerAccount = new Account(provider, burnerAddress, privateKey, "1");
    // @ts-ignore: Account provider is instantiated to a gateway provider by
    // default, but we want to keep using the rpc provider.
    burnerAccount.provider = provider;
    const deployAccountArgs = {
      classHash: BURNER_CLASS_HASH,
      constructorCalldata,
      contractAddress: burnerAddress,
      addressSalt: publicKey,
    };

    return {
      deployAccountArgs,
      burnerAccount: burnerAccount as AccountInterface,
    };
  }, [address, provider]);

  const shortAddress = address
    ? `${address.slice(0, 8)}...${address.slice(-4)}`
    : "not connected";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account {shortAddress}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FundBurnerAccount address={burnerAccount?.address} />
        <OverrideAccount
          account={fundedBurnerAddress ? burnerAccount : undefined}
        >
          <DeployBurnerAccount deployAccountArgs={deployAccountArgs} />
        </OverrideAccount>
        <InitializeBurnerAccount />
        <OverrideAccount
          account={fundedBurnerAddress ? burnerAccount : undefined}
        >
          <WithdrawFunds walletAddress={address} />
        </OverrideAccount>
      </CardContent>
    </Card>
  );
}
