import { useCallback, useEffect, useState } from 'react'
import { Connector } from '~/connectors'
import { useStarknet } from '~/providers'

/** Value returned from `useConnectors`. */
export interface UseConnectorsResult {
  /** List of all registered connectors. */
  connectors: Connector[]
  /** List of available connectors. */
  available: Connector[]
  /** Connect the given connector. */
  connect: (conn: Connector) => void
  /** Disconnect the currently connected connector. */
  disconnect: () => void
  /** Refresh the list of available connectors. */
  refresh: () => void
}

/**
 * Hook to work with connectors.
 *
 * @example
 * This example shows all registered connectors and connects
 * to the specified one.
 * ```tsx
 * import { useConnectors } from '@starknet-react/core'
 *
 * function Component() {
 *   const { connect, connectors } = useConnectors()
 *
 *   return (
 *     <ul>
 *       {connectors.map((connector) => (
 *         <li id={connector.id()}>
 *           <button onClick={() => connect(connector)}>
 *             Connect {connector.id()}
 *           </button>
 *         </li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useConnectors(): UseConnectorsResult {
  const { connectors, connect, disconnect } = useStarknet()
  const [available, setAvailable] = useState<Connector[]>([])

  useEffect(() => {
    setAvailable(connectors.filter((conn) => conn.available()))
  }, [connectors, setAvailable])

  const refresh = useCallback(() => {
    setAvailable(connectors.filter((conn) => conn.available()))
  }, [connectors, setAvailable])

  return { available, connectors, connect, disconnect, refresh }
}
