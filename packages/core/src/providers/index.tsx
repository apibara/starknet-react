import React from 'react'
import { ProviderInterface } from 'starknet'

import { StarknetBlockProvider } from './block'
import { StarknetTransactionManagerProvider } from './transaction'
import { StarknetLibraryProvider } from './starknet'

interface StarknetProviderProps {
  children?: React.ReactNode
  defaultProvider?: ProviderInterface
}

export function StarknetProvider({
  children,
  defaultProvider,
}: StarknetProviderProps): JSX.Element {
  return (
    <StarknetLibraryProvider defaultProvider={defaultProvider}>
      <StarknetBlockProvider>
        <StarknetTransactionManagerProvider>{children}</StarknetTransactionManagerProvider>
      </StarknetBlockProvider>
    </StarknetLibraryProvider>
  )
}
