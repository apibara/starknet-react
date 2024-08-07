import type { Address } from "@starknet-react/chains";
import { useMemo } from "react";
import {
  CallData,
  Provider,
  type ProviderInterface,
  starknetId,
} from "starknet";

import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

import { useNetwork } from "./use-network";
import { useProvider } from "./use-provider";

export type UseStarkAddressProps = UseQueryProps<
  string,
  Error,
  string,
  ReturnType<typeof queryKey>
> & {
  /** Stark name. */
  name?: string;
  /** Naming contract to use . */
  contract?: Address;
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
 */
export function useStarkAddress({
  name,
  contract,
  enabled: enabled_ = true,
  ...props
}: UseStarkAddressProps): UseStarkAddressResult {
  const { provider } = useProvider();
  const { chain } = useNetwork();

  const enabled = useMemo(() => Boolean(enabled_ && name), [enabled_, name]);

  return useQuery({
    queryKey: queryKey({ name, contract, network: chain.network }),
    queryFn: queryFn({ name, contract, provider, network: chain.network }),
    enabled,
    ...props,
  });
}

function queryKey({
  name,
  contract,
  network,
}: {
  name?: string;
  contract?: string;
  network?: string;
}) {
  return [{ entity: "addressFromStarkName", name, contract, network }] as const;
}

function queryFn({
  name,
  contract,
  provider,
  network,
}: UseStarkAddressProps & { provider: ProviderInterface; network: string }) {
  return async () => {
    if (!name) throw new Error("name is required");

    const namingContract = contract ?? StarknetIdNamingContract[network];
    const p = new Provider(provider);
    const encodedDomain = encodeDomain(name);
    const result = await p.callContract({
      contractAddress: namingContract as string,
      entrypoint: "domain_to_address",
      calldata: CallData.compile({ domain: encodedDomain, hint: [] }),
    });

    // StarknetID returns 0x0 if no name is found, but that can be dangerous
    // since we can't expect the user to know that 0x0 is not a valid address.
    if (BigInt(result[0]) === BigInt(0)) throw new Error("Address not found");

    return result[0];
  };
}

const StarknetIdNamingContract: Record<string, string> = {
  sepolia: "0x154bc2e1af9260b9e66af0e9c46fc757ff893b3ff6a85718a810baf1474",
  mainnet: "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678",
};

const encodeDomain = (domain: string): string[] => {
  if (!domain) return ["0"];

  const encoded = [];
  for (const subdomain of domain.replace(".stark", "").split("."))
    encoded.push(starknetId.useEncoded(subdomain).toString(10));
  return encoded;
};
