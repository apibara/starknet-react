import React from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useStarknetBlock, StarknetProvider } from '../../src'

describe('useStarknetBlock', () => {
  jest.setTimeout(15000)
  it('returns the current block', async () => {
    const wrapper = ({ children }) => <StarknetProvider>{children}</StarknetProvider>
    const { result } = renderHook(() => useStarknetBlock(), { wrapper })
    act(() => {
      expect(result.current.data).toBeUndefined()
      expect(result.current.loading).toBeTruthy()
    })

    await waitFor(
      () => {
        expect(result.current.data.timestamp).toBeGreaterThan(0)
        expect(result.current.data.block_hash).not.toBeUndefined()
        expect(result.current.loading).toBeFalsy()
      },
      { timeout: 15000, interval: 1 }
    )
  })
})
