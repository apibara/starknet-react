import { SwitchStarknetChainParameters } from "starknet-types";

import {
  RequestArgs,
  RequestResult,
  UseWalletRequestProps,
  UseWalletRequestResult,
  useWalletRequest,
} from "./useWalletRequest";

export type SwitchChainVariables = Partial<SwitchStarknetChainParameters>;

export type SwitchChainProps = SwitchChainVariables &
  Omit<
    UseWalletRequestProps<"wallet_switchStarknetChain">,
    keyof RequestArgs<"wallet_switchStarknetChain">
  >;

export type SwitchChainResult = Omit<
  UseWalletRequestResult<"wallet_switchStarknetChain">,
  "request" | "requestAsync"
> & {
  switchChain: (args?: SwitchChainVariables) => void;
  switchChainAsync: (
    args?: SwitchChainVariables,
  ) => Promise<RequestResult<"wallet_switchStarknetChain">>;
};

/**
 * Hook to change the current network of the wallet.
 *
 */
export function useSwitchChain(props: SwitchChainProps): SwitchChainResult {
  const { chainId, ...rest } = props;

  let params: SwitchStarknetChainParameters | undefined;

  if (chainId) {
    params = { chainId };
  }

  const { request, requestAsync, ...result } = useWalletRequest({
    type: "wallet_switchStarknetChain",
    params,
    ...rest,
  });

  const switchChain = (args?: SwitchChainVariables) => {
    const params_ = args ?? params;

    if (!params_ || !params_.chainId) throw new Error("chainId is required");

    return request({
      params: params_ as SwitchStarknetChainParameters,
      type: "wallet_switchStarknetChain",
    });
  };

  const switchChainAsync = (args?: SwitchChainVariables) => {
    const params_ = args ?? params;

    if (!params_ || !params_.chainId) throw new Error("chainId is required");

    return requestAsync({
      params: params_ as SwitchStarknetChainParameters,
      type: "wallet_switchStarknetChain",
    });
  };

  return {
    switchChain,
    switchChainAsync,
    ...result,
  };
}
