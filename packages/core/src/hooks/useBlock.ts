import {
  BlockNumber,
  BlockTag,
  GetBlockResponse,
  ProviderInterface,
} from "starknet";

import { useStarknet } from "~/context/starknet";
import { UseQueryProps, UseQueryResult, useQuery } from "~/query";

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
 *
 * @example
 * This example shows how to fetch the latest block only once.
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useBlock({
 *     refetchInterval: false,
 *     blockIdentifier: 'latest'
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>Hash: {data.block_hash}</span>
 * }
 * ```
 *
 * @example
 * This example shows how to fetch the pending block every 3 seconds.
 * Use your browser network monitor to verify that the hook is refetching the
 * data.
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useBlock({
 *     refetchInterval: 3000,
 *     blockIdentifier: 'pending'
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>Hash: {data.block_hash}</span>
 * }
 * ```
 */
export function useBlock({
  blockIdentifier = BlockTag.latest,
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
}: { provider: ProviderInterface; blockIdentifier: BlockNumber }) {
  return async function () {
    return await provider.getBlock(blockIdentifier);
  };
}
