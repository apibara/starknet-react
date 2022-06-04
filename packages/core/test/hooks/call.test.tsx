import React from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { Contract } from 'starknet'
import { useStarknetCall, StarknetProvider } from '../../src'

import { CounterAbi, COUNTER_ADDRESS } from '../shared/counter'

describe('useStarknetCall', () => {
  const contract = new Contract(CounterAbi, COUNTER_ADDRESS)

  it('performs a call to the specified contract and method', async () => {
    const wrapper = ({ children }) => <StarknetProvider>{children}</StarknetProvider>

    const { result } = renderHook(
      () => useStarknetCall({ contract, method: 'counter', args: [] }),
      { wrapper }
    )

    const { refresh } = result.current

    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeUndefined()
    expect(result.current.loading).toBeTruthy()

    act(() => {
      refresh()
    })

    await waitFor(
      () => {
        expect(result.current.data[0]).toBeDefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.loading).toBeFalsy()
      },
      { timeout: 10000, interval: 1 }
    )
  })
})
