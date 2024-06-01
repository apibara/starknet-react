import { TypedData } from "starknet-types";

import {
  RequestArgs,
  RequestResult,
  UseWalletRequestProps,
  UseWalletRequestResult,
  useWalletRequest,
} from "./useWalletRequest";

export type SignTypedDataVariables = Partial<TypedData>;

export type UseSignTypedDataProps = SignTypedDataVariables &
  Omit<
    UseWalletRequestProps<"wallet_signTypedData">,
    keyof RequestArgs<"wallet_signTypedData">
  >;

export type UseSignTypedDataResult = Omit<
  UseWalletRequestResult<"wallet_signTypedData">,
  "request" | "requestAsync"
> & {
  signTypedData: (args?: SignTypedDataVariables) => void;
  signTypedDataAsync: (
    args?: SignTypedDataVariables,
  ) => Promise<RequestResult<"wallet_signTypedData">>;
};

export function useSignTypedData(
  props: UseSignTypedDataProps,
): UseSignTypedDataResult {
  const { domain, types, message, primaryType, ...rest } = props;

  let params: TypedData | undefined;

  if (domain && types && message && primaryType) {
    params = {
      domain,
      types,
      message,
      primaryType,
    };
  }

  const { request, requestAsync, ...result } = useWalletRequest({
    type: "wallet_signTypedData",
    params: params,
    ...rest,
  });

  const signTypedData = (args?: SignTypedDataVariables) => {
    const params_ = args ?? params;

    if (!params_) throw new Error("typedData is required");
    if (!params_.domain) throw new Error("domain is required");
    if (!params_.types) throw new Error("types is required");
    if (!params_.message) throw new Error("message is required");
    if (!params_.primaryType) throw new Error("primaryType is required");

    return request({
      params: params_ as TypedData,
      type: "wallet_signTypedData",
    });
  };

  const signTypedDataAsync = (args?: SignTypedDataVariables) => {
    const params_ = args ?? params;

    if (!params_) throw new Error("typedData is required");
    if (!params_.domain) throw new Error("domain is required");
    if (!params_.types) throw new Error("types is required");
    if (!params_.message) throw new Error("message is required");
    if (!params_.primaryType) throw new Error("primaryType is required");

    return requestAsync({
      params: params_ as TypedData,
      type: "wallet_signTypedData",
    });
  };

  return {
    signTypedData,
    signTypedDataAsync,
    ...result,
  };
}
