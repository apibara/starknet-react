import React from 'react'
import { StarknetProviderProps, StarknetProvider } from './starknet'
import { TransactionManagerProvider } from './transaction'

export * from './starknet'
export * from './transaction'

/** Arguments for `StarknetConfig`. */
export type StarknetConfigProps = Omit<StarknetProviderProps, 'children'> & {
  children: React.ReactNode
}

/** Root component that manages the state of all starknet-react hooks. */
export function StarknetConfig({ children, ...config }: StarknetConfigProps) {
  return (
    <StarknetProvider {...config}>
      <TransactionManagerProvider>{children}</TransactionManagerProvider>
    </StarknetProvider>
  )
}
