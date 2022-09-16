import { useCallback, useEffect, useState } from 'react'
import { Connector } from '~/connectors'
import { useStarknet } from '~/providers'

export interface UseConnectorsResult {
  connectors: Connector[]
  available: Connector[]
  connect: (conn: Connector) => void
  disconnect: () => void
  refresh: () => void
}

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
