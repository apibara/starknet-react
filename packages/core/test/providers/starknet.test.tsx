import React from 'react'
import { renderHook } from '@testing-library/react'
import { useStarknet, StarknetProvider } from '../../src'
import { Provider } from 'starknet'

describe('useStarknet', () => {
  it('returns the current account', async () => {
    const wrapper = ({ children }) => <StarknetProvider>{children}</StarknetProvider>
    const { result } = renderHook(() => useStarknet(), { wrapper })

    const { account } = result.current
    expect(account).toBeUndefined()
  })

  it('can customize the default provider', async () => {
    const wrapper = ({ children }) => (
      <StarknetProvider defaultProvider={new Provider({ network: 'mainnet-alpha' })}>
        {children}
      </StarknetProvider>
    )
    const { result } = renderHook(() => useStarknet(), { wrapper })
    const { library } = result.current
    expect(library.baseUrl).toContain('https://alpha-mainnet.starknet.io')
  })
})
