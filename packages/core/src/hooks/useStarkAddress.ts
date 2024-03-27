import { useMemo } from "react";
import { CallData, Provider, ProviderInterface, starknetId } from "starknet";
import { mainnet, sepolia, goerli } from "@starknet-react/chains";

import { UseQueryProps, UseQueryResult, useQuery } from "~/query";
import { useProvider } from "./useProvider";
import { useNetwork } from "./useNetwork";

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
  /** ChainID to use.*/
  chainId?: bigint;
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
  chainId: chainId_,
  ...props
}: UseStarkAddressProps): UseStarkAddressResult {
  const { chain } = useNetwork();
  const chainId = chainId_ ?? chain.id;
  const { provider } = useProvider({chainId});

  const enabled = useMemo(() => Boolean(enabled_ && name), [enabled_, name]);

  return useQuery({
    queryKey: queryKey({ name, contract, chainId }),
    queryFn: queryFn({ name, contract, provider, chainId }),
    enabled,
    ...props,
  });
}

function queryKey({
  name,
  contract,
  chainId,
}: {
  name?: string;
  contract?: string;
  chainId?: bigint
}) {
  return [{ entity: "addressFromStarkName", name, contract, chainId }] as const;
}

function queryFn({
  name,
  contract,
  provider,
  chainId
}: UseStarkAddressProps & { provider: ProviderInterface } ) {
  return async function () {
    if (!name) throw new Error("name is required");

    const namingContract = contract ?? StarknetIdNamingContract[mainnet.id.toString(), sepolia.id.toString(), goerli.id.toString()];
    const p = new Provider(provider);
    const encodedDomain = decodeDomain(name);
    const result = await p.callContract({
      contractAddress: namingContract as string,
      entrypoint: "domain_to_address",
      calldata: CallData.compile({ domain: encodedDomain, hint: []}),
    });

    // StarknetID returns 0x0 if no name is found, but that can be dangerous
    // since we can't expect the user to know that 0x0 is not a valid address.
    if (BigInt(result.result[0] as string) === BigInt(0))
      throw new Error("Address not found");

    return result.result[0] as string;
  };
}

const StarknetIdNamingContract: Record<string, string> = {
  goerli: "0x3bab268e932d2cecd1946f100ae67ce3dff9fd234119ea2f6da57d16d29fce",
  sepolia: "0x0707f09bc576bd7cfee59694846291047e965f4184fe13dac62c56759b3b6fa7",
  mainnet: "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678",
};

const decodeDomain = (domain: string): string[] => {
  if (!domain) return ["0"];

  const encoded = [];
  for (const subdomain of domain.replace(".stark", "").split("."))
    encoded.push(starknetId.useEncoded(subdomain).toString(10));
  return encoded;
};
