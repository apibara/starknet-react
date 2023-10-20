import { Chain } from "@starknet-react/chains";
import { useMemo } from "react";
import {
  CallData,
  ContractInterface,
  num,
  shortString,
  uint256,
} from "starknet";
import { z } from "zod";

import { UseQueryProps, UseQueryResult, useQuery } from "~/query";

import { useContract } from "./useContract";
import { useInvalidateOnBlock } from "./useInvalidateOnBlock";
import { useNetwork } from "./useNetwork";

export type Balance = {
  decimals: number;
  symbol: string;
  formatted: string;
  value: bigint;
};

export type UseBalanceProps = UseQueryProps<
  Balance,
  Error,
  Balance,
  ReturnType<typeof queryKey>
> & {
  /** The contract's address. Defaults to the native currency. */
  token?: string;
  /** The address to fetch balance for. */
  address?: string;
  /** Whether to watch for changes. */
  watch?: boolean;
};

export type UseBalanceResult = UseQueryResult<Balance, Error>;

export function useBalance({
  token,
  address,
  watch = false,
  enabled: enabled_ = true,
  ...props
}: UseBalanceProps) {
  const { chain } = useNetwork();
  const { contract } = useContract({
    abi: balanceABIFragment,
    address: token ?? chain.nativeCurrency.address,
  });

  const queryKey_ = useMemo(
    () => queryKey({ chain, contract, token, address }),
    [chain, contract, token, address],
  );

  const enabled = useMemo(
    () => Boolean(enabled_ && contract && address),
    [enabled_, contract, address],
  );

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: queryKey_,
  });

  return useQuery({
    queryKey: queryKey_,
    queryFn: queryFn({ chain, contract, token, address }),
    ...props,
  });
}

function queryKey({
  chain,
  contract,
  token,
  address,
}: {
  chain: Chain;
  contract?: ContractInterface;
  token?: string;
  address?: string;
}) {
  return [
    {
      entity: "balance",
      chainId: chain?.name,
      contract,
      token,
      address,
    },
  ] as const;
}

function queryFn({
  chain,
  token,
  address,
  contract,
}: {
  chain: Chain;
  token?: string;
  address?: string;
  contract?: ContractInterface;
}) {
  return async function () {
    if (!address) throw new Error("address is required");
    if (!contract) throw new Error("contract is required");

    let symbolPromise = Promise.resolve(chain.nativeCurrency.symbol);
    if (token) {
      symbolPromise = contract.call("symbol", []).then((result) => {
        const s = symbolSchema.parse(result).symbol;
        return shortString.decodeShortString(num.toHex(s));
      });
    }

    let decimalsPromise = Promise.resolve(chain.nativeCurrency.decimals);
    if (token) {
      decimalsPromise = contract.call("decimals", []).then((result) => {
        return Number(decimalsSchema.parse(result).decimals);
      });
    }

    const balanceOfPromise = contract
      .call("balanceOf", CallData.compile({ address }))
      .then((result) => {
        return uint256.uint256ToBN(balanceSchema.parse(result).balance);
      });

    const [balanceOf, decimals, symbol] = await Promise.all([
      balanceOfPromise,
      decimalsPromise,
      symbolPromise,
    ]);

    const formatted = (Number(balanceOf) / 10 ** decimals).toString();

    return {
      value: balanceOf,
      decimals,
      symbol,
      formatted,
    };
  };
}

const uint256Schema = z.object({
  low: z.bigint(),
  high: z.bigint(),
});

const balanceSchema = z.object({
  balance: uint256Schema,
});

const decimalsSchema = z.object({
  decimals: z.bigint(),
});

const symbolSchema = z.object({
  symbol: z.bigint(),
});

const balanceABIFragment = [
  {
    members: [
      {
        name: "low",
        offset: 0,
        type: "felt",
      },
      {
        name: "high",
        offset: 1,
        type: "felt",
      },
    ],
    name: "Uint256",
    size: 2,
    type: "struct",
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [
      {
        name: "account",
        type: "felt",
      },
    ],
    outputs: [
      {
        name: "balance",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
  },
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
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "decimals",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
