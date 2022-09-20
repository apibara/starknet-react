import { useCallback, useEffect, useState } from 'react'
import { AccountInterface } from 'starknet'
import { Connector } from '~/connectors'
import { useConnectors } from './connectors'
import { useStarknet } from '~/providers'

/** Account connection status. */
export type AccountStatus = 'connected' | 'disconnected'

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
  /** The connection status. */
  status: AccountStatus
}

/**
 * Hook for accessing the account and its connection status.
 */
export function useAccount(): UseAccountResult {
  const { account: connectedAccount } = useStarknet()
  const { connectors } = useConnectors()
  const [state, setState] = useState<UseAccountResult>({ status: 'disconnected' })

  const refreshState = useCallback(async () => {
    for (const connector of connectors) {
      const connAccount = await connector.account()
      if (connAccount && connAccount?.address === connectedAccount) {
        setState({
          connector,
          account: connAccount,
          address: connectedAccount,
          status: 'connected',
        })
      }
    }
  }, [setState, connectedAccount, connectors])

  useEffect(() => {
    refreshState()
  }, [refreshState])

  return state
}
