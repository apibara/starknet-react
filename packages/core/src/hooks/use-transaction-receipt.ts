import type { Chain } from "@starknet-react/chains";
import { useMemo } from "react";
import type {
  GetTransactionReceiptResponse,
  ProviderInterface,
} from "starknet";

import { useStarknet } from "../context/starknet";
import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

import { useInvalidateOnBlock } from "./use-invalidate-on-block";

/** Arguments for the `useTransactionReceipt` hook. */
export type UseTransactionReceiptProps = UseQueryProps<
  GetTransactionReceiptResponse,
  Error,
  GetTransactionReceiptResponse,
  ReturnType<typeof queryKey>
> & {
  /** The transaction hash. */
  hash?: string;
  /** Refresh data at every block. */
  watch?: boolean;
};

export type UseTransactionReceiptResult = UseQueryResult<
  GetTransactionReceiptResponse,
  Error
>;

/**
 * Hook to fetch a single transaction receipt.
 *
 * @remarks
 *
 * This hook keeps a cache of receipts by chain and transaction hash
 * so that you can use the hook freely in your application without worrying
 * about sending duplicate network requests.
 *
 * If you need to refresh the transaction receipt data, set `watch: true` in
 * the props. The hook will periodically refresh the transaction data in the
 * background.
 *
 */
export function useTransactionReceipt({
  hash,
  watch,
  enabled: enabled_ = true,
  ...props
}: UseTransactionReceiptProps): UseTransactionReceiptResult {
  const { provider, chain } = useStarknet();

  const queryKey_ = useMemo(() => queryKey({ chain, hash }), [chain, hash]);

  const enabled = useMemo(() => Boolean(enabled_ && hash), [enabled_, hash]);

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: queryKey_,
  });

  return useQuery({
    queryKey: queryKey_,
    queryFn: queryFn({ provider, hash }),
    enabled,
    ...props,
  });
}

function queryKey({ chain, hash }: { chain?: Chain; hash?: string }) {
  return [
    { entity: "transactionReceipt", chainId: chain?.name, hash },
  ] as const;
}

function queryFn({
  provider,
  hash,
}: {
  provider: ProviderInterface;
  hash?: string;
}) {
  return async () => {
    if (!hash) throw new Error("hash is required");

    return await provider.getTransactionReceipt(hash);
  };
}
