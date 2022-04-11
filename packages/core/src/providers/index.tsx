import React from 'react'
import { ProviderInterface } from 'starknet'

import { StarknetBlockProvider } from './block'
import { StarknetTransactionManagerProvider } from './transaction'
import { StarknetLibraryProvider } from './starknet'
import { Connector } from '../connectors'

interface StarknetProviderProps {
  children?: React.ReactNode
  defaultProvider?: ProviderInterface
  connectors?: Connector[]
  autoConnect?: boolean
}

export function StarknetProvider({
  children,
  defaultProvider,
  connectors,
  autoConnect,
}: StarknetProviderProps): JSX.Element {
  return (
    <StarknetLibraryProvider
      defaultProvider={defaultProvider}
      autoConnect={autoConnect}
      connectors={connectors}
    >
      <StarknetBlockProvider>
        <StarknetTransactionManagerProvider>{children}</StarknetTransactionManagerProvider>
      </StarknetBlockProvider>
    </StarknetLibraryProvider>
  )
}
