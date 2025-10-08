import type { Address } from "@starknet-start/chains";
import type { BlockNumber, Nonce, ProviderInterface } from "starknet";

export type NonceForAddressQueryKeyParams = {
  address: Address;
  blockIdentifier: BlockNumber;
};

export type NonceForAddressQueryFnParams = {
  provider: ProviderInterface;
} & NonceForAddressQueryKeyParams;

export function nonceForAddressQueryKey({
  address,
  blockIdentifier,
}: NonceForAddressQueryKeyParams) {
  return [{ entity: "nonce" as const, blockIdentifier, address }] as const;
}

export function nonceForAddressQueryFn({
  provider,
  blockIdentifier,
  address,
}: NonceForAddressQueryFnParams) {
  return async (): Promise<Nonce> => {
    const nonce = await provider.getNonceForAddress(address, blockIdentifier);
    return nonce;
  };
}
