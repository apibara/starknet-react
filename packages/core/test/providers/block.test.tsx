import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { useStarknetBlock, StarknetProvider, StarknetBlockProvider } from '../../src'

describe('useStarknetBlock', () => {
  it('returns the current block', async () => {
    const wrapper = ({ children }) => (
      <StarknetProvider>
        <StarknetBlockProvider>{children}</StarknetBlockProvider>
      </StarknetProvider>
    )
    const { result, waitForNextUpdate } = renderHook(() => useStarknetBlock(), { wrapper })
    expect(result.current).toBeUndefined()
    // wait up to one minute for a block
    await waitForNextUpdate({ timeout: 60000 })
    expect(result.current.timestamp).toBeGreaterThan(0)
    expect(result.current.block_hash).not.toBeUndefined()
  })
})
