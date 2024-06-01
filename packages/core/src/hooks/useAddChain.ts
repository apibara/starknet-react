import { AddStarknetChainParameters } from "starknet-types";

import {
  RequestArgs,
  RequestResult,
  UseWalletRequestProps,
  UseWalletRequestResult,
  useWalletRequest,
} from "./useWalletRequest";

export type AddChainVariables = Partial<AddStarknetChainParameters>;

export type AddChainProps = AddChainVariables &
  Omit<
    UseWalletRequestProps<"wallet_addStarknetChain">,
    keyof RequestArgs<"wallet_addStarknetChain">
  >;

export type AddChainResult = Omit<
  UseWalletRequestResult<"wallet_addStarknetChain">,
  "request" | "requestAsync"
> & {
  addChain: (args?: AddChainVariables) => void;
  addChainAsync: (
    args?: AddChainVariables,
  ) => Promise<RequestResult<"wallet_addStarknetChain">>;
};

/**
 * Hook to add a new network in the list of networks of the wallet.
 *
 */
export function useAddChain(props: AddChainProps): AddChainResult {
  const {
    block_explorer_url,
    chain_id,
    chain_name,
    icon_urls,
    id,
    native_currency,
    rpc_urls,
    ...rest
  } = props;

  let params: AddStarknetChainParameters | undefined;

  if (id && chain_id && chain_name) {
    params = {
      block_explorer_url,
      chain_id,
      chain_name,
      icon_urls,
      id,
      native_currency,
      rpc_urls,
    };
  }

  const { request, requestAsync, ...result } = useWalletRequest({
    type: "wallet_addStarknetChain",
    params,
    ...rest,
  });

  const addChain = (args?: AddChainVariables) => {
    const params_ = args ?? params;

    if (!params_) throw new Error("chain arguments are required");
    if (!params_.id) throw new Error("id is required");
    if (!params_.chain_id) throw new Error("chain_id is required");
    if (!params_.chain_name) throw new Error("chain_name is required");

    return request({
      params: params_ as AddStarknetChainParameters,
      type: "wallet_addStarknetChain",
    });
  };

  const addChainAsync = (args?: AddChainVariables) => {
    const params_ = args ?? params;

    if (!params_) throw new Error("chain arguments are required");
    if (!params_.id) throw new Error("id is required");
    if (!params_.chain_id) throw new Error("chain_id is required");
    if (!params_.chain_name) throw new Error("chain_name is required");

    return requestAsync({
      params: params_ as AddStarknetChainParameters,
      type: "wallet_addStarknetChain",
    });
  };

  return {
    addChain,
    addChainAsync,
    ...result,
  };
}
