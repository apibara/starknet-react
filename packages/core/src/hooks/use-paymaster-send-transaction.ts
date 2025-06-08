import { useCallback } from "react";
import type {
  AccountInterface,
  BigNumberish,
  Call,
  InvokeFunctionResponse,
  PaymasterDetails,
} from "starknet";
import { type UseMutationResult, useMutation } from "../query";
import { useAccount } from "./use-account";

export type UsePaymasterSendTransactionArgs = {
  /** List of smart contract calls to execute. */
  calls?: Call[];
  /** Paymaster details. */
  options: PaymasterDetails;
  /** Max fee in gas token. */
  maxFeeInGasToken?: BigNumberish;
};

/** Value returned from `usePaymasterSendTransaction`. */
export type UsePaymasterSendTransactionResult = Omit<
  UseMutationResult<InvokeFunctionResponse, Error, Call[]>,
  "mutate" | "mutateAsync"
> & {
  send: (args?: Call[]) => void;
  sendAsync: (args?: Call[]) => Promise<InvokeFunctionResponse>;
};

/** Hook to send one or several transaction(s) to the network through a paymaster. */
export function usePaymasterSendTransaction(
  props: UsePaymasterSendTransactionArgs,
): UsePaymasterSendTransactionResult {
  const { calls, options, maxFeeInGasToken, ...rest } = props;
  const { account } = useAccount();

  const { mutate, mutateAsync, ...result } = useMutation<
    InvokeFunctionResponse,
    Error,
    Call[]
  >({
    mutationKey: mutationKey(calls || []),
    mutationFn: mutationFn({ account, options, maxFeeInGasToken }),
    ...rest,
  });

  const send = useCallback(
    (args?: Call[]) => {
      mutate(args || calls || []);
    },
    [mutate, calls],
  );

  const sendAsync = useCallback(
    (args?: Call[]) => {
      return mutateAsync(args || calls || []);
    },
    [mutateAsync, calls],
  );

  return {
    send,
    sendAsync,
    ...result,
  };
}

function mutationKey(args: Call[]) {
  return [{ entity: "paymaster_sendTransaction", calls: args }] as const;
}

function mutationFn({
  account,
  options,
  maxFeeInGasToken,
}: {
  account?: AccountInterface;
  options: PaymasterDetails;
  maxFeeInGasToken?: BigNumberish;
}) {
  return async (calls: Call[]) => {
    if (!account) throw new Error("account is required");
    if (!calls || calls.length === 0) throw new Error("calls are required");
    return account.executePaymasterTransaction(
      calls,
      options,
      maxFeeInGasToken,
    );
  };
}
