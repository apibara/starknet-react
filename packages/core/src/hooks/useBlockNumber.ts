import { BlockNumber, BlockTag, ProviderInterface } from "starknet";

import { useStarknet } from "~/context/starknet";
import { UseQueryProps, UseQueryResult, useQuery } from "~/query";

/** Arguments for `useBlockNumber`. */
export type UseBlockNumberProps = UseQueryProps<
  number,
  Error,
  number,
  ReturnType<typeof queryKey>
> & {
  /** Identifier for the block to fetch. */
  blockIdentifier?: BlockNumber;
};

/** Value returned from `useBlockNumber`. */
export type UseBlockNumberResult = UseQueryResult<number, Error>;

/**
 * Hook for fetching the current block number.
 *
 * @remarks
 *
 * Control if and how often data is refreshed with `refetchInterval`.
 *
 * @example
 * This example shows how to fetch the current block only once.
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useBlockNumber({
 *     refetchInterval: false
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>Block number: {data}</span>
 * }
 * ```
 *
 * @example
 * This example shows how to fetch the current block every 3 seconds.
 * Use your browser network monitor to verify that the hook is refetching the
 * data.
 * ```tsx
 * function Component() {
 *   const { data, isLoading, isError } = useBlockNumber({
 *     refetchInterval: 3000
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (isError) return <span>Error...</span>
 *   return <span>Block Number: {data}</span>
 * }
 * ```
 */
export function useBlockNumber({
  blockIdentifier = BlockTag.latest,
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
}: { provider: ProviderInterface; blockIdentifier: BlockNumber }) {
  return async function () {
    const block = await provider.getBlock(blockIdentifier);
    return block.block_number;
  };
}
