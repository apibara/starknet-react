import { useCallback, useEffect, useState } from 'react'
import { AccountInterface } from 'starknet'
import { Connector } from '../connectors'
import { useConnectors } from './connectors'
import { useStarknet } from '../providers'

/** Account connection status. */
export type AccountStatus = 'connected' | 'disconnected' | 'connecting' | 'reconnecting'

/**
 * Value returned from `useAccount`.
 */
export interface UseAccountResult {
  /** The connected account object. */
  account?: AccountInterface
  /** The address of the connected account. */
  address?: string
  /** The connected connector. */
  connector?: Connector
  isConnecting?: boolean
  isReconnecting?: boolean
  isConnected?: boolean
  isDisconnected?: boolean
  /** The connection status. */
  status: AccountStatus
}

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
export function useAccount(): UseAccountResult {
  const { account: connectedAccount } = useStarknet()
  const { connectors } = useConnectors()
  const [state, setState] = useState<UseAccountResult>({ status: 'disconnected' })

  const refreshState = useCallback(async () => {
    if (!connectedAccount) {
      return setState({
        status: 'disconnected',
        isDisconnected: true,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
      })
    }
    for (const connector of connectors) {
      if (!connector.available()) continue
      const connAccount = await connector.account()
      if (connAccount && connAccount?.address === connectedAccount) {
        return setState({
          connector,
          account: connAccount,
          address: connectedAccount,
          status: 'connected',
          isConnected: true,
          isConnecting: false,
          isDisconnected: false,
          isReconnecting: false,
        })
      }
    }
  }, [setState, connectedAccount, connectors])

  useEffect(() => {
    refreshState()
  }, [refreshState])

  return state
}
