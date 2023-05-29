'use client'

import { ReactNode } from 'react'
import { StarknetConfig } from '@starknet-react/core'

interface StarknetProviderProps {
  children: ReactNode
}

const StarknetProvider = ({ children }: StarknetProviderProps) => {
  return (
    <StarknetConfig>
      <>{children}</>
    </StarknetConfig>
  )
}

export default StarknetProvider
