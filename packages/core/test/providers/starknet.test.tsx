import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { useStarknet, StarknetProvider } from '../../src'

describe('useStarknetBlock', () => {
  it('returns the current block', async () => {
    const wrapper = ({ children }) => <StarknetProvider>{children}</StarknetProvider>
    const { result } = renderHook(() => useStarknet(), { wrapper })
    const { account, hasStarknet } = result.current
    expect(account).toBeUndefined()
    expect(hasStarknet).toBeFalsy()
  })
})
