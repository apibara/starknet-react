import { useCallback, useEffect, useState } from "react";
import { AccountInterface } from "starknet";

import { Connector } from "~/connectors";
import { useStarknet } from "~/context/starknet";

import { useConnect } from "./useConnect";

/** Arguments for `useAccount` hook. */
export type UseAccountProps = {
  /** Function to invoke when connected. */
  onConnect?: (args: {
    address?: UseAccountResult["address"];
    connector?: UseAccountResult["connector"];
  }) => void;
  /** Function to invoke when disconnected. */
  onDisconnect?: () => void;
};

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
  address?: string;
  /** The connected connector. */
  connector?: Connector;
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
 *
 * @example
 * This example shows how to display the wallet connection status and
 * the currently connected wallet address.
 * ```tsx
 * function Component() {
 *   const { account, address, status } = useAccount()
 *
 *   if (status === 'disconnected') return <p>Disconnected</p>
 *   return <p>Account: {address}</p>
 * }
 * ```
 */
export function useAccount({
  onConnect,
  onDisconnect,
}: UseAccountProps = {}): UseAccountResult {
  const { account: connectedAccount } = useStarknet();
  const { connectors } = useConnect();
  const [state, setState] = useState<UseAccountResult>({
    status: "disconnected",
  });

  const refreshState = useCallback(async () => {
    if (!connectedAccount) {
      if (!state.isDisconnected && onDisconnect !== undefined) {
        onDisconnect();
      }
      return setState({
        status: "disconnected",
        isDisconnected: true,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
      });
    }
    for (const connector of connectors) {
      if (!connector.available()) continue;
      const connAccount = await connector.account();
      if (connAccount && connAccount?.address === connectedAccount.address) {
        if (state.isDisconnected && onConnect !== undefined) {
          onConnect({ address: connectedAccount.address, connector });
        }

        return setState({
          connector,
          account: connectedAccount,
          address: connectedAccount.address,
          status: "connected",
          isConnected: true,
          isConnecting: false,
          isDisconnected: false,
          isReconnecting: false,
        });
      }
    }
  }, [
    setState,
    connectedAccount,
    connectors,
    onConnect,
    onDisconnect,
    state.isDisconnected,
  ]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  return state;
}
