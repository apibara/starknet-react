import { useMemo } from "react";
import { Provider, ProviderInterface } from "starknet";

import { UseQueryProps, UseQueryResult, useQuery } from "~/query";
import { useProvider } from "./useProvider";

export type UseStarkAddressProps = UseQueryProps<
  string,
  Error,
  string,
  ReturnType<typeof queryKey>
> & {
  /** Stark name. */
  name?: string;
  /** Naming contract to use . */
  contract?: string;
};

export type UseStarkAddressResult = UseQueryResult<string, Error>;

/**
 * Hook to get the address associated to a stark name.
 *
 * @remarks
 *
 * This hook fetches the address of the specified stark name
 * It defaults to the starknetID contract but a different contract can be targetted by specifying its address
 * If stark name does not have an associated address, it will return "0x0"
 *
 * @example
 * This example shows how to get the address associated to a stark name
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useAddressFromStarkName({ name: 'vitalik.stark' })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error fetching address...</span>
 *   return <span>address: {data}</span>
 * }
 * ```
 */
export function useStarkAddress({
  name,
  contract,
  enabled: enabled_ = true,
  ...props
}: UseStarkAddressProps): UseStarkAddressResult {
  const { provider } = useProvider();

  const enabled = useMemo(() => Boolean(enabled_ && name), [enabled_, name]);

  return useQuery({
    queryKey: queryKey({ name, contract }),
    queryFn: queryFn({ name, contract, provider }),
    enabled,
    ...props,
  });
}

function queryKey({ name, contract }: { name?: string; contract?: string }) {
  return [{ entity: "addressFromStarkName", name, contract }] as const;
}

function queryFn({
  name,
  contract,
  provider,
}: UseStarkAddressProps & { provider: ProviderInterface }) {
  return async function () {
    if (!name) throw new Error("name is required");

    const p = new Provider(provider);
    const result = await p.getAddressFromStarkName(name, contract);
    // StarknetID returns 0x0 if no name is found, but that can be dangerous
    // since we can't expect the user to know that 0x0 is not a valid address.
    if (BigInt(result) === BigInt(0)) throw new Error("Address not found");

    return result;
  };
}
