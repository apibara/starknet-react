import React from 'react'

import { StarknetContext } from './context'
import { useStarknetManager } from './manager'

export interface StarknetProviderProps {
  children: React.ReactNode
}

export function StarknetLibraryProvider({ children }: StarknetProviderProps): JSX.Element {
  const state = useStarknetManager()
  return <StarknetContext.Provider value={state}>{children}</StarknetContext.Provider>
}
