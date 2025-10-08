import type { Chain } from "@starknet-start/chains";
import { type BlockNumber, type CallOptions, num, shortString } from "starknet";
import { formatUnits } from "viem";

export type BalanceQueryKeyParams = {
  chain: Chain;
  token?: string;
  address?: string;
  blockIdentifier?: BlockNumber;
};

export type BalanceContract = {
  withOptions(options: CallOptions): BalanceContract;
  symbol(): Promise<unknown>;
  decimals(): Promise<unknown>;
  balanceOf(address: string): Promise<unknown>;
};

export type BalanceQueryFnParams = BalanceQueryKeyParams & {
  contract?: BalanceContract;
};

export type BalanceResult = {
  value: bigint;
  decimals: number;
  symbol: string;
  formatted: string;
};

export function balanceQueryKey({
  chain,
  token,
  address,
  blockIdentifier,
}: BalanceQueryKeyParams) {
  return [
    {
      entity: "balance" as const,
      chainId: chain?.name,
      token,
      address,
      blockIdentifier,
    },
  ] as const;
}

export function balanceQueryFn({
  chain,
  token,
  address,
  contract,
  blockIdentifier,
}: BalanceQueryFnParams) {
  return async (): Promise<BalanceResult> => {
    if (!address) throw new Error("address is required");
    if (!contract) throw new Error("contract is required");

    const options: CallOptions = {
      blockIdentifier,
    };

    const contractWithOptions = contract.withOptions(options);
    const isNativeCurrency = token === chain.nativeCurrency.address;

    let symbol = chain.nativeCurrency.symbol;
    if (!isNativeCurrency) {
      const symbol_ = await contractWithOptions.symbol();
      symbol = shortString.decodeShortString(num.toHex(symbol_));
    }

    let decimals = chain.nativeCurrency.decimals;
    if (!isNativeCurrency) {
      const decimals_ = await contractWithOptions.decimals();
      decimals = Number(decimals_);
    }

    const balanceOf = (await contractWithOptions.balanceOf(address)) as bigint;
    const formatted = formatUnits(balanceOf, decimals);

    return {
      value: balanceOf,
      decimals,
      symbol,
      formatted,
    };
  };
}
