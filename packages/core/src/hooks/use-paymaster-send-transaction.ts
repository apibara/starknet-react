import type { BigNumberish, Call, InvokeFunctionResponse, PaymasterDetails } from "starknet";
import { useAccount } from "./use-account";
import { useState } from "react";

export type UsePaymasterSendTransactionArgs = {
  /** List of smart contract calls to execute. */
  calls?: Call[];
  /** Paymaster details. */
  options: PaymasterDetails;
  /** Max fee in gas token. */
  maxFeeInGasToken?: BigNumberish;
};

export type UsePaymasterSendTransactionResult = {
  sendAsync: (args?: Call[]) => Promise<InvokeFunctionResponse>;
  data: InvokeFunctionResponse | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
};

/** Hook to send one or several transaction(s) to the network through a paymaster. */
export function usePaymasterSendTransaction(
  props: UsePaymasterSendTransactionArgs,
): UsePaymasterSendTransactionResult {
  const { calls, options, maxFeeInGasToken } = props;
  const { account } = useAccount();
  const [data, setData] = useState<InvokeFunctionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendAsync = (args?: Call[]) => {
    const _calls = args || calls || [];
    if (!account) {
      throw new Error("No connector connected");
    }

    setIsLoading(true);
    return account?.executePaymasterTransaction(_calls, options, maxFeeInGasToken).then((data) => {
      setData(data);
      setIsSuccess(true);
      return data;
    }).catch((error) => {
      setError(error);
      setIsSuccess(false);
      throw error;
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return {
    sendAsync,
    data,
    isLoading,
    isSuccess,
    error,
  };
}
