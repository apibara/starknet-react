import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { useStarknet, StarknetProvider } from '../../src'

describe('useStarknet', () => {
  it('returns the current account', async () => {
    const wrapper = ({ children }) => <StarknetProvider>{children}</StarknetProvider>
    const { result } = renderHook(() => useStarknet(), { wrapper })

    const { account } = result.current
    expect(account).toBeUndefined()
  })
})
