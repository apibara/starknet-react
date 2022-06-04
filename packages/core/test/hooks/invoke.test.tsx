import React from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { Contract } from 'starknet'
import { useStarknetInvoke, StarknetProvider } from '../../src'

import { CounterAbi, COUNTER_ADDRESS } from '../shared/counter'

describe('useStarknetInvoke', () => {
  const contract = new Contract(CounterAbi, COUNTER_ADDRESS)

  it('invokes the specified contract method', async () => {
    const wrapper = ({ children }) => <StarknetProvider>{children}</StarknetProvider>

    const { result } = renderHook(
      () => useStarknetInvoke({ contract, method: 'incrementCounter' }),
      { wrapper }
    )

    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeUndefined()
    expect(result.current.loading).toBeFalsy()

    act(() => {
      result.current.invoke({ args: ['0x1'] })
    })

    expect(result.current.loading).toBeTruthy()

    await waitFor(
      () => {
        expect(result.current.data).toBeDefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.loading).toBeFalsy()
      },
      { timeout: 10000, interval: 1 }
    )
  })
})
