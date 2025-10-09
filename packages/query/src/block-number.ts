import type {
  BlockNumber,
  GetBlockResponse,
  ProviderInterface,
} from "starknet";

export type BlockNumberQueryKeyParams = {
  blockIdentifier: BlockNumber;
};

export type BlockNumberQueryFnParams = {
  provider: ProviderInterface;
  blockIdentifier: BlockNumber;
};

export function blockNumberQueryKey({
  blockIdentifier,
}: BlockNumberQueryKeyParams) {
  return [{ entity: "blockNumber" as const, blockIdentifier }] as const;
}

export function blockNumberQueryFn({
  provider,
  blockIdentifier,
}: BlockNumberQueryFnParams) {
  return async (): Promise<number | undefined> => {
    const block = (await provider.getBlock(
      blockIdentifier,
    )) as GetBlockResponse;
    if (block.status !== "PENDING") {
      return block.block_number;
    }
    return undefined;
  };
}
