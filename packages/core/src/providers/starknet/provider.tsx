import React from 'react'
import { ProviderInterface } from 'starknet'
import { Connector } from '../../connectors'

import { StarknetContext } from './context'
import { useStarknetManager } from './manager'

export interface StarknetProviderProps {
  children: React.ReactNode
  defaultProvider?: ProviderInterface
  connectors?: Connector[]
  autoConnect?: boolean
}

export function StarknetLibraryProvider({
  children,
  defaultProvider,
  connectors,
  autoConnect,
}: StarknetProviderProps): JSX.Element {
  const state = useStarknetManager({ defaultProvider, connectors, autoConnect })
  return <StarknetContext.Provider value={state}>{children}</StarknetContext.Provider>
}
