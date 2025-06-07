import type { BigNumberish, Call, InvokeFunctionResponse, PaymasterDetails } from "starknet";
import { useAccount } from "./use-account";

export type UsePaymasterSendTransactionArgs = {
  /** List of smart contract calls to execute. */
  calls?: Call[];
  /** Paymaster details. */
  options: PaymasterDetails;
  /** Max fee in gas token. */
  maxFeeInGasToken?: BigNumberish;
};

export type UsePaymasterSendTransactionResult = {
  send: (args?: Call[]) => Promise<InvokeFunctionResponse>;
};

/** Hook to send one or several transaction(s) to the network through a paymaster. */
export function usePaymasterSendTransaction(
  props: UsePaymasterSendTransactionArgs,
): UsePaymasterSendTransactionResult {
  const { calls, options, maxFeeInGasToken } = props;
  const { account } = useAccount();

  const send = (args?: Call[]) => {
    const _calls = args || calls;
    if (!_calls) {
      throw new Error("No calls provided");
    }

    if (!account) {
      throw new Error("Account not connected");
    }

    return account?.executePaymasterTransaction(_calls, options, maxFeeInGasToken);
  };

  return {
    send,
  };
}
