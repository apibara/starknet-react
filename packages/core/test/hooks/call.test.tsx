import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { Contract } from 'starknet'
import { useStarknetCall, StarknetProvider } from '../../src'

import { CounterAbi, COUNTER_ADDRESS } from '../shared/counter'

describe('useStarknetCall', () => {
  const contract = new Contract(CounterAbi, COUNTER_ADDRESS)

  it('performs a call to the specified contract and method', async () => {
    const wrapper = ({ children }) => <StarknetProvider>{children}</StarknetProvider>

    const { result, waitForValueToChange } = renderHook(
      () => useStarknetCall({ contract, method: 'counter', args: {} }),
      { wrapper }
    )

    const { refresh } = result.current

    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeUndefined()
    expect(result.current.loading).toBeTruthy()

    act(() => {
      refresh()
    })

    await waitForValueToChange(() => result.current.data, { timeout: 10000 })

    expect(result.current.data.count).toBeDefined()
    expect(result.current.error).toBeUndefined()
    expect(result.current.loading).toBeFalsy()
  })
})
