import { Call } from "starknet";
import { Call as RequestCall } from "starknet-types";
import {
  RequestArgs,
  RequestResult,
  UseWalletRequestProps,
  UseWalletRequestResult,
  useWalletRequest,
} from "./useWalletRequest";

type UseSendTransactionArgs = {
  /** List of smart contract calls to execute. */
  calls?: Call[];
};

export type UseSendTransactionProps = UseSendTransactionArgs &
  Omit<
    UseWalletRequestProps<"wallet_addInvokeTransaction">,
    keyof RequestArgs<"wallet_addInvokeTransaction">
  >;

export type UseSendTransactionResult = Omit<
  UseWalletRequestResult<"wallet_addInvokeTransaction">,
  "request" | "requestAsync"
> & {
  send: (args?: Call[]) => void;
  sendAsync: (
    args?: Call[],
  ) => Promise<RequestResult<"wallet_addInvokeTransaction">>;
};

export function useSendTransaction(
  props: UseSendTransactionProps,
): UseSendTransactionResult {
  const { calls, ...rest } = props;

  const { request, requestAsync, ...result } = useWalletRequest({
    type: "wallet_addInvokeTransaction",
    params: {
      calls: transformCalls(calls ?? []),
    },
    ...rest,
  });

  const send = (args?: Call[]) => {
    const _calls = args ?? calls;

    if (!_calls) {
      throw new Error("Calls are required");
    }

    return request({
      params: { calls: transformCalls(_calls) },
      type: "wallet_addInvokeTransaction",
    });
  };

  const sendAsync = (args?: Call[]) => {
    const _calls = args ?? calls;

    if (!_calls) {
      throw new Error("Calls are required");
    }

    return requestAsync({
      params: { calls: transformCalls(_calls) },
      type: "wallet_addInvokeTransaction",
    });
  };

  return {
    send,
    sendAsync,
    ...result,
  };
}

function transformCalls(calls: Call[]) {
  return calls.map(
    (call) =>
      ({
        contract_address: call.contractAddress,
        entry_point: call.entrypoint,
        calldata: call.calldata,
      }) as RequestCall,
  );
}
