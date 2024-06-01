import { AddDeclareTransactionParameters } from "starknet-types";

import {
  RequestArgs,
  RequestResult,
  UseWalletRequestProps,
  UseWalletRequestResult,
  useWalletRequest,
} from "./useWalletRequest";

export type DeclareContractVariables = Partial<AddDeclareTransactionParameters>;

export type UseDeclareContractProps = DeclareContractVariables &
  Omit<
    UseWalletRequestProps<"wallet_addDeclareTransaction">,
    keyof RequestArgs<"wallet_addDeclareTransaction">
  >;

export type UseDeclareContractResult = Omit<
  UseWalletRequestResult<"wallet_addDeclareTransaction">,
  "request" | "requestAsync"
> & {
  declare: (args?: DeclareContractVariables) => void;
  declareAsync: (
    args?: DeclareContractVariables,
  ) => Promise<RequestResult<"wallet_addDeclareTransaction">>;
};

/**
 * Hook to declare a new class in the current network.
 *
 */
export function useDeclareContract(
  props: UseDeclareContractProps,
): UseDeclareContractResult {
  const { class_hash, compiled_class_hash, contract_class, ...rest } = props;

  let params: AddDeclareTransactionParameters | undefined;

  if (compiled_class_hash && contract_class) {
    params = {
      class_hash,
      compiled_class_hash,
      contract_class,
    };
  }

  const { request, requestAsync, ...result } = useWalletRequest({
    type: "wallet_addDeclareTransaction",
    params,
    ...rest,
  });

  const declare = (args?: DeclareContractVariables) => {
    const params_ = args ?? params;

    if (!params_)
      throw new Error("declare transaction parameters are required");
    if (!params_.compiled_class_hash)
      throw new Error("compiled class hash is required");
    if (!params_.contract_class) throw new Error("contract class is required");

    return request({
      params: params_ as AddDeclareTransactionParameters,
      type: "wallet_addDeclareTransaction",
    });
  };

  const declareAsync = (args?: DeclareContractVariables) => {
    const params_ = args ?? params;

    if (!params_)
      throw new Error("declare transaction parameters are required");
    if (!params_.compiled_class_hash)
      throw new Error("compiled class hash is required");
    if (!params_.contract_class) throw new Error("contract class is required");

    return requestAsync({
      params: params_ as AddDeclareTransactionParameters,
      type: "wallet_addDeclareTransaction",
    });
  };

  return {
    declare,
    declareAsync,
    ...result,
  };
}
