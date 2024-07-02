import { type Address } from "@starknet-react/chains";
import { useCallback, useEffect, useState } from "react";
import { AccountInterface } from "starknet";

import { Connector } from "../connectors";
import { useStarknetAccount } from "../context/account";

import { useConnect } from "./use-connect";
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
  const { account: connectedAccount } = useStarknetAccount();
  const { connectors } = useConnect();
  const { provider } = useProvider();
  const [state, setState] = useState<UseAccountResult>({
    status: "disconnected",
  });

  const refreshState = useCallback(async () => {
    if (!connectedAccount) {
      return setState({
        status: "disconnected",
        isDisconnected: true,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
      });
    }

    const address = connectedAccount.address as Address;
    for (const connector of connectors) {
      if (!connector.available()) continue;

      // If the connector is not authorized, `.account()` will throw.
      let connAccount: AccountInterface | undefined;
      try {
        connAccount = await connector.account(provider);
      } catch {}

      if (connAccount && connAccount?.address === connectedAccount.address) {
        return setState({
          connector,
          chainId: await connector.chainId(),
          account: connectedAccount,
          address,
          status: "connected",
          isConnected: true,
          isConnecting: false,
          isDisconnected: false,
          isReconnecting: false,
        });
      }
    }

    // If we get here, we're not connected to any connector.
    // This can happen if it's an arcade account.
    setState({
      connector: undefined,
      chainId: undefined,
      account: connectedAccount,
      address,
      status: "connected",
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
    });
  }, [connectedAccount, connectors, provider]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  return state;
}
