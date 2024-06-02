import { useMemo } from "react";
import {
  Call,
  CallData,
  Provider,
  ProviderInterface,
  starknetId,
} from "starknet";

import { UseQueryProps, UseQueryResult, useQuery } from "../query";

import { useNetwork } from "./useNetwork";
import { useProvider } from "./useProvider";

/** Arguments for `useStarkName` hook. */
export type StarkNameArgs = UseQueryProps<
  string,
  Error,
  string,
  ReturnType<typeof queryKey>
> & {
  /** Account address. */
  address?: string;
  /** Naming contract to use . */
  contract?: string;
};

/** Value returned by `useStarkName` hook. */
export type StarkNameResult = UseQueryResult<string, Error>;

/**
 * Hook for fetching Stark name for address.
 *
 * @remarks
 *
 * This hook fetches the stark name of the specified address.
 * It defaults to the starknet.id contract but a different contract can be
 * targetted by specifying its contract address
 * If address does not have a stark name, it will return "stark"
 *
 * @example
 * This example shows how to get the stark name of an address using the default
 * Starknet.id contract
 * ```tsx
 * function Component() {
 *   const address = '0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3'
 *   const { data, isLoading, isError } = useStarkName({ address })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error fetching name...</span>
 *   return <span>StarkName: {data}</span>
 * }
 * ```
 *
 *  @example
 * This example shows how to get the stark name of an address specifying a
 * different contract address
 * ```tsx
 * function Component() {
 *   const address = '0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3'
 *   const { data, isLoading, isError } = useStarkName({ address, contract: '0x1234' })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error fetching name...</span>
 *   return <span>StarkName: {data}</span>
 * }
 * ```
 */
export function useStarkName({
  address,
  contract,
  enabled: enabled_ = true,
  ...props
}: StarkNameArgs): StarkNameResult {
  const { provider } = useProvider();
  const { chain } = useNetwork();

  const enabled = useMemo(
    () => Boolean(enabled_ && address),
    [enabled_, address],
  );

  return useQuery({
    queryKey: queryKey({ address, contract, network: chain.network }),
    queryFn: queryFn({ address, contract, provider, network: chain.network }),
    enabled,
    ...props,
  });
}

function queryKey({
  address,
  contract,
  network,
}: {
  address?: string;
  contract?: string;
  network?: string;
}) {
  return [{ entity: "starkName", address, contract, network }] as const;
}

function queryFn({
  address,
  contract,
  provider,
  network,
}: StarkNameArgs & { provider: ProviderInterface; network: string }) {
  return async () => {
    if (!address) throw new Error("address is required");

    const namingContract = contract ?? StarknetIdNamingContract[network];
    const p = new Provider(provider);
    return await p.getStarkName(address, namingContract);
  };
}

const StarknetIdNamingContract: Record<string, string> = {
  sepolia: "0x154bc2e1af9260b9e66af0e9c46fc757ff893b3ff6a85718a810baf1474",
  mainnet: "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678",
};
