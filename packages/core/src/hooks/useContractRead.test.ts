import type {
  Abi,
  ExtractAbiFunctionNames,
  FunctionArgs,
  FunctionRet,
} from "abi-wan-kanabi/kanabi";
import type { TypedContract } from "abi-wan-kanabi";
import { describe, expect, it } from "vitest";
import { accounts, tokenAddress } from "../../test/devnet";
import { renderHook, waitFor } from "../../test/react";
import { TypedContractV1 } from "starknet";

// import { useContractRead } from "./useContractRead";

const abi = [
  /*
  {
    name: "ekubo::types::i129::i129",
    type: "struct",
    members: [
      {
        name: "mag",
        type: "core::integer::u128",
      },
      {
        name: "sign",
        type: "core::bool",
      },
    ],
  },
  {
    name: "ekubo::types::keys::PoolKey",
    type: "struct",
    members: [
      {
        name: "token0",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "token1",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "fee",
        type: "core::integer::u128",
      },
      {
        name: "tick_spacing",
        type: "core::integer::u128",
      },
      {
        name: "extension",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    name: "ekubo::types::fees_per_liquidity::FeesPerLiquidity",
    type: "struct",
    members: [
      {
        name: "value0",
        type: "core::felt252",
      },
      {
        name: "value1",
        type: "core::felt252",
      },
    ],
  },
  {
    name: "get_pool_fees_per_liquidity",
    type: "function",
    inputs: [
      {
        name: "pool_key",
        type: "ekubo::types::keys::PoolKey",
      },
    ],
    outputs: [
      {
        type: "ekubo::types::fees_per_liquidity::FeesPerLiquidity",
      },
    ],
    state_mutability: "view",
  },
  {
    name: "get_pool_liquidity",
    type: "function",
    inputs: [
      {
        name: "pool_key",
        type: "ekubo::types::keys::PoolKey",
      },
    ],
    outputs: [
      {
        type: "core::integer::u128",
      },
    ],
    state_mutability: "view",
  },
  {
    name: "get_pool_tick_liquidity_delta",
    type: "function",
    inputs: [
      {
        name: "pool_key",
        type: "ekubo::types::keys::PoolKey",
      },
      {
        name: "index",
        type: "ekubo::types::i129::i129",
      },
    ],
    outputs: [
      {
        type: "ekubo::types::i129::i129",
      },
    ],
    state_mutability: "view",
  },
  */
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        type: "felt",
      },
    ],
    state_mutability: "view",
    type: "function",
  },
  {
    name: "balanceOf",
    inputs: [
      {
        name: "address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [
      {
        type: "core::felt252",
      },
    ],
    state_mutability: "view",
    type: "function",
  },
] as const satisfies Abi;

function useContractRead<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TArgs extends FunctionArgs<TAbi, TFunctionName>,
  TRet extends FunctionRet<TAbi, TFunctionName>,
>({}: {
  abi: TAbi;
  functionName: TFunctionName;
  args: TArgs;
}): { data?: TRet } {
  throw new Error("Not implemented");
}

describe("useContractRead", () => {
  it.skip("returns the contract read result", async () => {
    const { data } = useContractRead({
      abi,
      functionName: "balanceOf",
      args: "0x123",
    });
    /*
    const { result } = renderHook(() =>
      useContractRead({
        functionName: "balanceOf",
        args: [accounts.goerli[0].address],
        abi,
        address: tokenAddress,
        watch: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy();
    });
    */
  });
});
