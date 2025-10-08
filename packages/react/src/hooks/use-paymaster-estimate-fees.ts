import { useMemo } from "react";
import type { PaymasterFeeEstimate } from "starknet";

import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

import { useAccount } from "./use-account";
import { useInvalidateOnBlock } from "./use-invalidate-on-block";
import {
  paymasterEstimateFeesQueryFn,
  paymasterEstimateFeesQueryKey,
  type PaymasterEstimateFeesArgs,
} from "@starknet-start/query";

/** Options for `useEstimateFees`. */
export type UsePaymasterEstimateFeesProps = PaymasterEstimateFeesArgs &
  UseQueryProps<
    PaymasterFeeEstimate,
    Error,
    PaymasterFeeEstimate,
    ReturnType<typeof paymasterEstimateFeesQueryKey>
  > & {
    /** Refresh data at every block. */
    watch?: boolean;
  };

/** Value returned from `useEstimateFees`. */
export type UsePaymasterEstimateFeesResult = UseQueryResult<
  PaymasterFeeEstimate,
  Error
>;

/**
 * Hook to estimate fees for smart contract calls.
 *
 * @remarks
 *
 * The hook only performs estimation if the `calls` is not undefined.
 */
export function usePaymasterEstimateFees({
  calls,
  options,
  watch = false,
  enabled: enabled_ = true,
  ...props
}: UsePaymasterEstimateFeesProps): UsePaymasterEstimateFeesResult {
  const { account } = useAccount();

  const queryKey_ = useMemo(
    () => paymasterEstimateFeesQueryKey({ calls, options }),
    [calls, options],
  );

  const enabled = useMemo(() => Boolean(enabled_ && calls), [enabled_, calls]);

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: queryKey_,
  });

  return useQuery({
    queryKey: queryKey_,
    queryFn: paymasterEstimateFeesQueryFn({
      account,
      calls,
      options,
    }),
    enabled,
    ...props,
  });
}
