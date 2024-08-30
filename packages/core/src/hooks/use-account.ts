import { Permission } from "@starknet-io/types-js";
import type { Address } from "@starknet-react/chains";
import { useCallback, useEffect, useState } from "react";
import type { AccountInterface } from "starknet";
import type { Connector } from "../connectors";
import { useStarknetAccount } from "../context/account";
import { getAddress } from "../utils";
import { useConnect } from "./use-connect";

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

    const connectorPromises = connectors
      // If the account is connected, we get the address
      .filter((connector) => connector.available())
      .map(async (connector) => {
        try {
          // we get permissions from the wallet
          const permissions: Permission[] = await connector.request({
            type: "wallet_getPermissions",
          });

          // if the wallet doesn't have the permission to get accounts,
          // that means the wallet is not connected and we skip it
          if (!permissions.includes(Permission.ACCOUNTS)) return null;

          // if the wallet is connected and has permissions, so we request the accounts
          const connAccount = await connector.request({
            type: "wallet_requestAccounts",
            params: { silent_mode: true },
          });

          // Check if the account matches the connected account
          if (connAccount?.[0] === connectedAccount.address) {
            return {
              connector,
              chainId: await connector.chainId(),
              account: connectedAccount,
              address: getAddress(connectedAccount.address),
              status: "connected" as const,
              isConnected: true,
              isConnecting: false,
              isDisconnected: false,
              isReconnecting: false,
            };
          }

          return null; // Continue to the next connector if account doesn't match
        } catch {
          return null;
        }
      });

    try {
      const state = await Promise.any(connectorPromises);
      if (state) {
        return setState(state);
      }
    } catch {
      // If we get here, we're not connected to any connector.
      // This can happen if it's an arcade account.
      setState({
        connector: undefined,
        chainId: undefined,
        account: connectedAccount,
        address: getAddress(connectedAccount.address),
        status: "connected",
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
      });
    }
  }, [connectedAccount, connectors]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  return state;
}
