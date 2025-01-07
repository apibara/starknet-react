import type { Events } from "@starknet-io/types-js";
import {
  type BlockIdentifier as BlockIdentifier_,
  BlockTag,
  type RpcProvider,
  hash,
  num,
} from "starknet";
import {
  type UseInfiniteQueryProps,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from "../query";
import { useProvider } from "./use-provider";

type EventsType = Events;
type BlockIdentifier = Exclude<BlockIdentifier_, bigint>;

/** Arguments for `useEvents`. */
export type UseEventsProps = UseInfiniteQueryProps<
  EventsType,
  Error,
  EventsType,
  EventsType,
  ReturnType<typeof queryKey>,
  string
> & {
  /** Filter events emitted by a specific contract address */
  address?: string;
  // TODO: support complex/nested events
  /** Filter events using the event name, example: Transfer */
  eventName?: string;
  /** Start fetching events from this block */
  fromBlock?: BlockIdentifier;
  /** Stop fetching events at this block */
  toBlock?: BlockIdentifier;
  /** The number of events returned from each individual query */
  chunkSize: number;
};

/** Value returned from `useEvents`. */
export type UseEventsResult = UseInfiniteQueryResult<EventsType, Error>;

/**
 * Hook to fetch events continuously
 *
 * The parameters could be used to filter the events by contract address, name
 * or specify a range of blocks to get the events from
 *
 * The returned object contain different functions and props to fetch next pages
 */
export function useEvents({
  address,
  eventName,
  fromBlock: fromBlock_,
  toBlock: toBlock_,
  chunkSize,
}: UseEventsProps): UseEventsResult {
  const { provider } = useProvider();
  const rpcProvider = provider as RpcProvider;

  const keyFilter = eventName
    ? [num.toHex(hash.starknetKeccak(eventName))]
    : [];
  const keys = [keyFilter];

  const fromBlock = fromBlock_
    ? blockIdentifierToBlockId(fromBlock_)
    : undefined;

  const toBlock = toBlock_ ? blockIdentifierToBlockId(toBlock_) : undefined;

  const fetchEvents = async ({
    pageParam,
  }: {
    pageParam?: string;
  }): Promise<EventsType> => {
    const res = await rpcProvider.getEvents({
      from_block: fromBlock,
      to_block: toBlock,
      address: address,
      keys: keys,
      chunk_size: chunkSize,
      continuation_token: pageParam === "0" ? undefined : pageParam,
    });
    return res;
  };

  return useInfiniteQuery({
    // TODO: useMemo ?
    queryKey: queryKey({
      address,
      eventName,
      fromBlock: fromBlock_,
      toBlock: toBlock_,
      chunkSize,
    }),
    queryFn: fetchEvents,
    initialPageParam: "0",
    getNextPageParam: (lastPage, pages) => lastPage.continuation_token,
  });
}

function queryKey({
  address,
  eventName,
  fromBlock,
  toBlock,
  chunkSize,
}: {
  address?: string;
  eventName?: string;
  fromBlock?: BlockIdentifier;
  toBlock?: BlockIdentifier;
  chunkSize?: number;
}) {
  return [
    {
      entity: "events",
      address,
      eventName,
      fromBlock,
      toBlock,
      chunkSize,
    },
  ] as const;
}

// Function to transform BlockIdentifier into a BLOCK_ID
function blockIdentifierToBlockId(blockIdentifier: BlockIdentifier) {
  if (blockIdentifier === null) {
    return BlockTag.PENDING; // null maps to 'pending' as per the BlockIdentifier doc
  }

  if (typeof blockIdentifier === "number") {
    return { block_number: blockIdentifier };
  }

  if (typeof blockIdentifier === "string") {
    if (blockIdentifier === "latest" || blockIdentifier === "pending") {
      return blockIdentifier as BlockTag; // BlockTag values map directly
    }

    // If it's a regular string, assume it's a block hash
    return { block_hash: blockIdentifier };
  }

  throw new Error(
    `Unsupported BlockIdentifier type: ${typeof blockIdentifier}`,
  );
}
