import { useMemo } from "react";
import { Provider, ProviderInterface } from "starknet";

import { UseQueryProps, UseQueryResult, useQuery } from "~/query";
import { useProvider } from "./useProvider";

/** Arguments for `useStarkName` hook. */
export type StarkNameArgs = UseQueryProps<
  string,
  unknown,
  string,
  ReturnType<typeof queryKey>
> & {
  /** Account address. */
  address?: string;
  /** Naming contract to use . */
  contract?: string;
};

/** Value returned by `useStarkName` hook. */
export type StarkNameResult = UseQueryResult<string, unknown>;

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

  const enabled = useMemo(
    () => Boolean(enabled_ && address),
    [enabled_, address],
  );

  return useQuery({
    queryKey: queryKey({ address, contract }),
    queryFn: queryFn({ address, contract, provider }),
    enabled,
    ...props,
  });
}

function queryKey({
  address,
  contract,
}: { address?: string; contract?: string }) {
  return [{ entity: "starkName", address, contract }] as const;
}

function queryFn({
  address,
  contract,
  provider,
}: StarkNameArgs & { provider: ProviderInterface }) {
  return async function () {
    if (!address) throw new Error("address is required");

    const p = new Provider(provider);
    return await p.getStarkName(address, contract);
  };
}
