import { useMemo } from "react";
import type { EstimateFeeResponseOverhead } from "starknet";

import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

import { useAccount } from "./use-account";
import { useInvalidateOnBlock } from "./use-invalidate-on-block";
import {
  estimateFeesQueryFn,
  estimateFeesQueryKey,
  type EstimateFeesArgs,
} from "@starknet-start/query";

/** Options for `useEstimateFees`. */
export type UseEstimateFeesProps = EstimateFeesArgs &
  UseQueryProps<
    EstimateFeeResponseOverhead,
    Error,
    EstimateFeeResponseOverhead,
    ReturnType<typeof estimateFeesQueryKey>
  > & {
    /** Refresh data at every block. */
    watch?: boolean;
  };

/** Value returned from `useEstimateFees`. */
export type UseEstimateFeesResult = UseQueryResult<
  EstimateFeeResponseOverhead,
  Error
>;

/**
 * Hook to estimate fees for smart contract calls.
 *
 * @remarks
 *
 * The hook only performs estimation if the `calls` is not undefined.
 */
export function useEstimateFees({
  calls,
  options,
  watch = false,
  enabled: enabled_ = true,
  ...props
}: UseEstimateFeesProps): UseEstimateFeesResult {
  const { account } = useAccount();

  const queryKey_ = useMemo(
    () => estimateFeesQueryKey({ calls, options }),
    [calls, options],
  );

  const enabled = useMemo(() => Boolean(enabled_ && calls), [enabled_, calls]);

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: queryKey_,
  });

  return useQuery({
    queryKey: queryKey_,
    queryFn: estimateFeesQueryFn({
      account,
      calls,
      options,
    }),
    enabled,
    ...props,
  });
}
