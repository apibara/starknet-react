import { type BlockNumber, BlockTag, type ProviderInterface } from "starknet";

import { useStarknet } from "../context/starknet";
import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

/** Arguments for `useBlockNumber`. */
export type UseBlockNumberProps = UseQueryProps<
  number | undefined,
  Error,
  number,
  ReturnType<typeof queryKey>
> & {
  /** Identifier for the block to fetch. */
  blockIdentifier?: BlockNumber;
};

/** Value returned from `useBlockNumber`. */
export type UseBlockNumberResult = UseQueryResult<number | undefined, Error>;

/**
 * Hook for fetching the current block number.
 *
 * @remarks
 *
 * Control if and how often data is refreshed with `refetchInterval`.
 */
export function useBlockNumber({
  blockIdentifier = BlockTag.LATEST,
  ...props
}: UseBlockNumberProps = {}): UseBlockNumberResult {
  const { provider } = useStarknet();

  return useQuery({
    queryKey: queryKey({ blockIdentifier }),
    queryFn: queryFn({ provider, blockIdentifier }),
    ...props,
  });
}

function queryKey({ blockIdentifier }: { blockIdentifier: BlockNumber }) {
  return [{ entity: "blockNumber", blockIdentifier }] as const;
}

function queryFn({
  provider,
  blockIdentifier,
}: {
  provider: ProviderInterface;
  blockIdentifier: BlockNumber;
}) {
  return async () => {
    const block = await provider.getBlock(blockIdentifier);
    if (block.status !== "PENDING") {
      return block.block_number;
    }
    return undefined;
  };
}
