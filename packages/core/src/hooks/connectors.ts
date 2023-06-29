import { useCallback, useEffect, useState } from 'react'
import { Connector } from '../connectors'
import { useStarknet } from '../providers'

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
  /** Whether the connectors are loading. */
  isLoading: boolean
}

/**
 * Hook to work with connectors.
 *
 * @remarks
 *
 * This hook is the recommended way to interact with the connectors.
 *
 * Notice that the `available` connectors are computed as soon as the hook is
 * rendered, which could happen _before_ the browser wallets had the opportunity
 * to inject themselves in the page.
 *
 * The best practice is to periodically `refresh` the available connectors.
 *
 * @example
 * This example shows all registered connectors and connects
 * to the specified one.
 * ```tsx
 * function Component() {
 *   const { connect, connectors } = useConnectors()
 *
 *   return (
 *     <ul>
 *       {connectors.map((connector) => (
 *         <li key={connector.id}>
 *           <button onClick={() => connect(connector)}>
 *             Connect {connector.id}
 *           </button>
 *         </li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 *
 * @example
 * This example shows how to refresh the available connectors
 * every 5 seconds.
 * ```tsx
 * function Component() {
 *   const { available, refresh } = useConnectors()
 *
 *   useEffect(() => {
 *     const interval = setInterval(refresh, 5000)
 *     return () => clearInterval(interval)
 *   }, [refresh])
 *
 *   return (
 *     <ul>
 *       {available.map((connector) => (
 *         <li key={connector.id}>
 *           <img
 *             src={connector.icon}
 *             alt={connector.id}
 *             style={{ width: '40px' }}/>
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setAvailable(connectors.filter((conn) => conn.available()))
    setIsLoading(false)
  }, [connectors, setAvailable])

  const refresh = useCallback(() => {
    setAvailable(connectors.filter((conn) => conn.available()))
    setIsLoading(false)
  }, [connectors, setAvailable, setIsLoading])

  return { available, connectors, connect, disconnect, refresh, isLoading }
}
