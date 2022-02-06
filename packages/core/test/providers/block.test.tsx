import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { useStarknetBlock, StarknetProvider } from '../../src'

describe('useStarknetBlock', () => {
  it('returns the current block', async () => {
    const wrapper = ({ children }) => <StarknetProvider>{children}</StarknetProvider>
    const { result, waitForValueToChange } = renderHook(() => useStarknetBlock(), { wrapper })
    act(() => {
      expect(result.current.data).toBeUndefined()
      expect(result.current.loading).toBeTruthy()
    })

    await waitForValueToChange(() => result.current.data, { timeout: 10000 })

    expect(result.current.data.timestamp).toBeGreaterThan(0)
    expect(result.current.data.block_hash).not.toBeUndefined()
    expect(result.current.loading).toBeFalsy()
  })
})
