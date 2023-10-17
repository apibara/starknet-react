import { SwitchStarknetChainParameter } from "get-starknet-core";

import { useAccount } from "./useAccount";

type ChainId = "SN_MAIN" | "SN_GOERLI";

export interface UseSwitchNetworkResult {
  /** Function used to switch network. */
  switchNetwork: (chainId: ChainId) => Promise<void>;
}

export function useSwitchNetwork() {
  const { connector } = useAccount();

  const switchNetwork =
    connector !== undefined
      ? (chainId: ChainId) => connector.switchNetwork({ chainId })
      : undefined;

  console.log(connector, switchNetwork);

  return { switchNetwork };
}
