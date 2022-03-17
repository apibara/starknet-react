import React from 'react'
import { ProviderInterface } from 'starknet'

import { StarknetContext } from './context'
import { useStarknetManager } from './manager'

export interface StarknetProviderProps {
  children: React.ReactNode
  defaultProvider?: ProviderInterface
}

export function StarknetLibraryProvider({
  children,
  defaultProvider,
}: StarknetProviderProps): JSX.Element {
  const state = useStarknetManager({ defaultProvider })
  return <StarknetContext.Provider value={state}>{children}</StarknetContext.Provider>
}
