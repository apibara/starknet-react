import type { Address } from "@starknet-react/chains";
import { useCallback, useEffect, useState } from "react";
import type { AccountInterface } from "starknet";
import type { Connector } from "../connectors";
import { useStarknetAccount } from "../context/account";
import { useStarknet } from "../context/starknet";
import { getAddress } from "../utils";
import { useProvider } from "./use-provider";

/** Account connection status. */
export type AccountStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "reconnecting";

/** Value returned from `useAccount`. */
export type UseAccountResult = {
  /** The connected account object. */
  account?: AccountInterface;
  /** The address of the connected account. */
  address?: Address;
  /** The connected connector. */
  connector?: Connector;
  /** Connector's chain id */
  chainId?: bigint;
  /** True if connecting. */
  isConnecting?: boolean;
  /** True if reconnecting. */
  isReconnecting?: boolean;
  /** True if connected. */
  isConnected?: boolean;
  /** True if disconnected. */
  isDisconnected?: boolean;
  /** The connection status. */
  status: AccountStatus;
};

/**
 * Hook for accessing the account and its connection status.
 *
 * @remarks
 *
 * This hook is used to access the `AccountInterface` object provided by the
 * currently connected wallet.
 */
export function useAccount(): UseAccountResult {
  const { connector, chain } = useStarknet();
  const { provider, paymasterProvider } = useProvider();
  const { address: connectedAddress } = useStarknetAccount();
  const [state, setState] = useState<UseAccountResult>(
    connectedAddress === undefined
      ? {
          status: "disconnected",
        }
      : {
          status: "connected" as const,
          connector,
          chainId: chain.id,
          account: undefined,
          address: getAddress(connectedAddress),
          isConnected: true,
          isConnecting: false,
          isDisconnected: false,
          isReconnecting: false,
        },
  );

  const refreshState = useCallback(async () => {
    if (connector && provider && connectedAddress) {
      setState({
        status: "connected" as const,
        connector,
        chainId: chain.id,
        account: undefined,
        address: getAddress(connectedAddress),
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
      });

      // Lazily build the account since it makes a wallet call to check if the wallet is locked.
      connector
        .account(provider, paymasterProvider)
        .then((connectedAccount) =>
          setState((state) => ({ ...state, account: connectedAccount })),
        );
    } else {
      return setState({
        status: "disconnected" as const,
        connector: undefined,
        chainId: undefined,
        account: undefined,
        address: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
      });
    }
  }, [provider, paymasterProvider, connector, chain.id, connectedAddress]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  return state;
}
