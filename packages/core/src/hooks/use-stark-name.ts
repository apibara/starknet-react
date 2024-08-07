import type { Address } from "@starknet-react/chains";
import { useMemo } from "react";
import {
  Call,
  CallData,
  Provider,
  type ProviderInterface,
  starknetId,
} from "starknet";

import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

import { useNetwork } from "./use-network";
import { useProvider } from "./use-provider";

/** Arguments for `useStarkName` hook. */
export type StarkNameArgs = UseQueryProps<
  string,
  Error,
  string,
  ReturnType<typeof queryKey>
> & {
  /** Account address. */
  address?: Address;
  /** Naming contract to use . */
  contract?: Address;
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
