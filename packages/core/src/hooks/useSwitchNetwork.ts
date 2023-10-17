export interface UseSwitchNetworkResult {
  /** Function used to switch network. */
  switchNetwork: (chainId: SwitchStarknetChainParameter) => Promise<void>;
}

import { SwitchStarknetChainParameter } from "get-starknet-core";
import { useAccount } from "./useAccount";

export function useSwitchNetwork() {
  const { connector } = useAccount();

  const switchNetwork =
    connector !== undefined ? connector.switchNetwork : undefined;

  return { switchNetwork };
}
