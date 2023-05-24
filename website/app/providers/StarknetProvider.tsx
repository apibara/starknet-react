'use client'

import { StarknetConfig } from '@starknet-react/core'

interface StarknetProviderProps {
  children: React.ReactNode
}

const StarknetProvider = ({ children }: StarknetProviderProps) => {
  return <StarknetConfig>{children}</StarknetConfig>
}

export default StarknetProvider
