import {
  type BlockNumber,
  BlockTag,
  type GetBlockResponse,
  type ProviderInterface,
} from "starknet";

import { useStarknet } from "../context/starknet";
import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

/** Arguments for `useBlock`. */
export type UseBlockProps = UseQueryProps<
  GetBlockResponse,
  Error,
  GetBlockResponse,
  ReturnType<typeof queryKey>
> & {
  /** Identifier for the block to fetch. */
  blockIdentifier?: BlockNumber;
};

/** Value returned from `useBlock`. */
export type UseBlockResult = UseQueryResult<GetBlockResponse, Error>;

/**
 * Hook for fetching a block.
 *
 * @remarks
 *
 * Specify which block to fetch with the `blockIdentifier` argument.
 * Control if and how often data is refreshed with `refetchInterval`.
 */
export function useBlock({
  blockIdentifier = BlockTag.LATEST,
  ...props
}: UseBlockProps = {}): UseBlockResult {
  const { provider } = useStarknet();
  return useQuery({
    queryKey: queryKey({ blockIdentifier }),
    queryFn: queryFn({ provider, blockIdentifier }),
    ...props,
  });
}

function queryKey({ blockIdentifier }: { blockIdentifier: BlockNumber }) {
  return [{ entity: "block", blockIdentifier }] as const;
}

function queryFn({
  provider,
  blockIdentifier,
}: {
  provider: ProviderInterface;
  blockIdentifier: BlockNumber;
}) {
  return async () => await provider.getBlock(blockIdentifier);
}
