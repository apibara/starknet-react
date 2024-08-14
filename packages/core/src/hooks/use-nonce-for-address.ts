import type { Address } from "@starknet-react/chains";

import {
  type BlockNumber,
  BlockTag,
  type Nonce,
  type ProviderInterface,
} from "starknet";

import { useStarknet } from "../context/starknet";
import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

/** Arguments for `useNonceForAddress`. */
export type UseNonceForAddressProps = UseQueryProps<
  Nonce,
  Error,
  Nonce,
  ReturnType<typeof queryKey>
> & {
  /** Address to fetch nonce for. */
  address: Address;
  /** Identifier for the block to fetch. */
  blockIdentifier?: BlockNumber;
};

/** Value returned from `useNonceForAddress`. */
export type UseNonceForAddressResult = UseQueryResult<Nonce, Error>;

/**
 * Hook for fetching the nonce for the given address.
 */
export function useNonceForAddress({
  address,
  blockIdentifier = BlockTag.LATEST,
  ...props
}: UseNonceForAddressProps): UseNonceForAddressResult {
  const { provider } = useStarknet();

  return useQuery({
    queryKey: queryKey({ address, blockIdentifier }),
    queryFn: queryFn({ address, provider, blockIdentifier }),
    ...props,
  });
}

function queryKey({
  address,
  blockIdentifier,
}: { address: Address; blockIdentifier: BlockNumber }) {
  return [{ entity: "nonce", blockIdentifier, address }] as const;
}

function queryFn({
  provider,
  blockIdentifier,
  address,
}: {
  provider: ProviderInterface;
  address: Address;
  blockIdentifier: BlockNumber;
}) {
  return async () => {
    const nonce = await provider.getNonceForAddress(address, blockIdentifier);
    return nonce;
  };
}
