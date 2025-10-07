import { useMemo } from "react";
import type {
  AccountInterface,
  Call,
  PaymasterDetails,
  PaymasterFeeEstimate,
} from "starknet";

import { type UseQueryProps, type UseQueryResult, useQuery } from "../query";

import { useAccount } from "./use-account";
import { useInvalidateOnBlock } from "./use-invalidate-on-block";

export type PaymasterEstimateFeesArgs = {
  /** List of smart contract calls to estimate. */
  calls?: Call[];
  /** Estimate Fee options. */
  options: PaymasterDetails;
};

/** Options for `useEstimateFees`. */
export type UsePaymasterEstimateFeesProps = PaymasterEstimateFeesArgs &
  UseQueryProps<
    PaymasterFeeEstimate,
    Error,
    PaymasterFeeEstimate,
    ReturnType<typeof queryKey>
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
    () => queryKey({ calls, options }),
    [calls, options],
  );

  const enabled = useMemo(() => Boolean(enabled_ && calls), [enabled_, calls]);

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: queryKey_,
  });

  return useQuery({
    queryKey: queryKey_,
    queryFn: queryFn({
      account,
      calls,
      options,
    }),
    enabled,
    ...props,
  });
}

function queryKey({ calls, options }: PaymasterEstimateFeesArgs) {
  return [
    {
      entity: "estimatePaymasterTransactionFee",
      calls,
      options,
    },
  ] as const;
}

function queryFn({
  account,
  calls,
  options,
}: { account?: AccountInterface } & PaymasterEstimateFeesArgs) {
  return async () => {
    if (!account) throw new Error("account is required");
    if (!calls || calls.length === 0) throw new Error("calls are required");
    return await account.estimatePaymasterTransactionFee(calls, options);
  };
}
