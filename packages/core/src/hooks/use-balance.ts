import type { Address, Chain } from "@starknet-react/chains";
import { useMemo } from "react";
import {
  type BlockNumber,
  BlockTag,
  type CallOptions,
  num,
  shortString,
} from "starknet";
import { formatUnits } from "viem";

import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

import { type StarknetTypedContract, useContract } from "./use-contract";
import { useInvalidateOnBlock } from "./use-invalidate-on-block";
import { useNetwork } from "./use-network";

const DEFAULT_FETCH_INTERVAL = 5_000;

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
  token?: Address;
  /** The address to fetch balance for. */
  address?: Address;
  /** Whether to watch for changes. */
  watch?: boolean;
  /** Block identifier used when performing call. */
  blockIdentifier?: BlockNumber;
};

export type UseBalanceResult = UseQueryResult<Balance, Error>;

type TAbi = typeof balanceABIFragment;
type Contract = StarknetTypedContract<TAbi>;

/**
 * Fetch the balance for the provided address and token.
 *
 * If no token is provided, the native currency is used.
 */
export function useBalance({
  token: token_,
  address,
  refetchInterval: refetchInterval_,
  watch = false,
  enabled: enabled_ = true,
  blockIdentifier = BlockTag.LATEST,
  ...props
}: UseBalanceProps) {
  const { chain } = useNetwork();
  const token = token_ ?? chain.nativeCurrency.address;

  const { contract } = useContract({
    abi: balanceABIFragment,
    address: token,
  });

  const queryKey_ = useMemo(
    () => queryKey({ chain, token, address, blockIdentifier }),
    [chain, token, address, blockIdentifier],
  );

  const enabled = useMemo(
    () => Boolean(enabled_ && contract && address),
    [enabled_, contract, address],
  );

  const refetchInterval =
    refetchInterval_ ??
    (blockIdentifier === BlockTag.PENDING && watch
      ? DEFAULT_FETCH_INTERVAL
      : undefined);

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: queryKey_,
  });

  return useQuery({
    enabled,
    refetchInterval,
    queryKey: queryKey_,
    queryFn: queryFn({ chain, contract, token, address, blockIdentifier }),
    ...props,
  });
}

function queryKey({
  chain,
  token,
  address,
  blockIdentifier,
}: {
  chain: Chain;
  token?: string;
  address?: string;
  blockIdentifier?: BlockNumber;
}) {
  return [
    {
      entity: "balance",
      chainId: chain?.name,
      token,
      address,
      blockIdentifier,
    },
  ] as const;
}

function queryFn({
  chain,
  token,
  address,
  contract,
  blockIdentifier,
}: {
  chain: Chain;
  token?: string;
  address?: string;
  contract?: Contract;
  blockIdentifier?: BlockNumber;
}) {
  return async () => {
    if (!address) throw new Error("address is required");
    if (!contract) throw new Error("contract is required");

    const options: CallOptions = {
      blockIdentifier,
    };

    const isNativeCurrency = token === chain.nativeCurrency.address;

    let symbol = chain.nativeCurrency.symbol;
    if (!isNativeCurrency) {
      const symbol_ = await contract.symbol(options);
      symbol = shortString.decodeShortString(num.toHex(symbol_));
    }

    let decimals = chain.nativeCurrency.decimals;
    if (!isNativeCurrency) {
      const decimals_ = await contract.decimals(options);
      decimals = Number(decimals_);
    }

    const balanceOf = (await contract.balanceOf(address, options)) as bigint;

    const formatted = formatUnits(balanceOf, decimals);

    return {
      value: balanceOf,
      decimals: decimals,
      symbol: symbol,
      formatted: formatted,
    };
  };
}

const balanceABIFragment = [
  {
    name: "core::integer::u256",
    type: "struct",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [
      {
        type: "core::integer::u256",
      },
    ],
    state_mutability: "view",
  },
  {
    name: "symbol",
    type: "function",
    inputs: [],
    outputs: [
      {
        type: "core::felt252",
      },
    ],
    state_mutability: "view",
  },
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [
      {
        type: "core::integer::u8",
      },
    ],
    state_mutability: "view",
  },
] as const;
