"use client";
import React, { useCallback, useEffect, useMemo } from "react";

import {
  DeployAccountVariables,
  OverrideAccount,
  useAccount,
  useContract,
  useContractWrite,
  useDeployAccount,
  useNetwork,
  useProvider,
} from "@starknet-react/core";
import { atom, useAtom, useAtomValue } from "jotai";
import { AlertCircle, ArrowDownToLine, ArrowUpToLine, Loader2, Lock, Shield } from "lucide-react";
import {
  Account,
  AccountInterface,
  CallData,
  ec,
  hash,
  selector,
  stark,
  uint256,
} from "starknet";

import { StarknetProvider } from "@/components/starknet/provider";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ConnectWallet from "@/components/starknet/connect";

import { erc20ABI } from "@/lib/erc20";

const BURNER_CLASS_HASH =
  "0x0715b5e10bf63c36e69c402a81e1eb96b9107ef56eb5e821b00893e39bdcf545";

const FUNDING_AMOUNT = 100_000_000_000_000n;

const burnerAddressAtom = atom<string | undefined>(undefined);
const burnerDeployTxAtom = atom<string | undefined>(undefined);

export function AccountsDemo() {
  return (
    <StarknetProvider>
      <ConnectWallet />
      <Outer />
    </StarknetProvider>
  );
}

function useNativeCurrency() {
  const { chain } = useNetwork();
  return useContract({
    address: chain.nativeCurrency.address,
    abi: erc20ABI,
  });
}

function Outer() {
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

function FundBurnerAccount({ address }: { address?: string }) {
  const [fundedAddress, setFundedAddress] = useAtom(burnerAddressAtom);

  const { account: mainAccount } = useAccount();
  const { contract: eth } = useNativeCurrency();

  const {
    writeAsync,
    isLoading,
    error,
  } = useContractWrite({
    calls:
      eth && mainAccount && address
        ? [
          eth.populateTransaction["transfer"]!(
            address,
            uint256.bnToUint256(FUNDING_AMOUNT),
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
          disabled={Boolean(!address || fundedAddress || isLoading)}
        >
          {isLoading ? (
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
}

function DeployBurnerAccount({
  deployAccountArgs = {},
}: { deployAccountArgs?: DeployAccountVariables }) {
  const { address } = useAccount();
  const [deployTx, setDeployTx] = useAtom(burnerDeployTxAtom);
  const { deployAccount, data, error, isError, isLoading } =
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
              disabled={Boolean(!address || data || isLoading)}
            >
              {isLoading ? (
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
}

function InitializeBurnerAccount() {
  const { contract: eth } = useNativeCurrency();
  const burnerAddress = useAtomValue(burnerAddressAtom);
  const { account: walletAccount } = useAccount();

  const {
    write,
    data,
    isLoading,
    isError,
    error,
  } = useContractWrite({
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
          disabled={
            Boolean(!walletAccount || !burnerAddress || isLoading)
          }
        >
          {isLoading ? (
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

function WithdrawFunds({ walletAddress }: { walletAddress?: string }) {
  const { contract: eth } = useNativeCurrency();
  const { address } = useAccount();

  const { write, data, isLoading, isError, error } = useContractWrite({
    calls:
      eth && address && walletAddress
        ? [
          eth.populateTransaction["transfer"]!(
            walletAddress,
            uint256.bnToUint256(FUNDING_AMOUNT / 2n),
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
            wallet account. Notice how the transaction doesn't require a
            signature from the wallet account.
          </p>
        </div>
        {data ? null : (
          <Button
            onClick={() => write()}
            className="w-full"
            disabled={Boolean(!address || !walletAddress || isLoading)}
          >
            {isLoading ? (
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
}
