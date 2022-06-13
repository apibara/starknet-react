import { useMemo } from 'react'
import { Connector } from '~/connectors'
import { useStarknet } from './context'

export interface UseConnectors {
  connectors: Connector[]
  available: Connector[]
  connect: (conn: Connector) => void
  disconnect: () => void
}

export function useConnectors(): UseConnectors {
  const { connectors, connect, disconnect } = useStarknet()

  const available = useMemo(() => {
    return connectors.filter((c) => c.available())
  }, [connectors])

  return { available, connectors, connect, disconnect }
}
