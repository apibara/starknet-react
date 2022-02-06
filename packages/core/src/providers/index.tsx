import React from 'react'
import { StarknetBlockProvider } from './block'
import { StarknetTransactionManagerProvider } from './transaction'
import { StarknetLibraryProvider } from './starknet'

interface StarknetProviderProps {
  children?: React.ReactNode
}

export function StarknetProvider({ children }: StarknetProviderProps): JSX.Element {
  return (
    <StarknetLibraryProvider>
      <StarknetBlockProvider>
        <StarknetTransactionManagerProvider>{children}</StarknetTransactionManagerProvider>
      </StarknetBlockProvider>
    </StarknetLibraryProvider>
  )
}
