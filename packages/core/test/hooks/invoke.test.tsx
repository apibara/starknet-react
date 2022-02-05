import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { Contract } from 'starknet'
import { useStarknetInvoke, StarknetProvider, StarknetBlockProvider } from '../../src'

import { CounterAbi, COUNTER_ADDRESS } from '../shared/counter'

describe('useStarknetInvoke', () => {
  const contract = new Contract(CounterAbi, COUNTER_ADDRESS)

  it('invokes the specified contract method', async () => {
    const wrapper = ({ children }) => (
      <StarknetProvider>
        <StarknetBlockProvider>{children}</StarknetBlockProvider>
      </StarknetProvider>
    )

    const { result, waitForValueToChange } = renderHook(
      () => useStarknetInvoke(contract, 'incrementCounter'),
      { wrapper }
    )

    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeUndefined()
    expect(result.current.loading).toBeFalsy()

    act(() => {
      result.current.invoke({ amount: '0x1' })
    })

    await waitForValueToChange(() => result.current.data)

    expect(result.current.data.code).toEqual('TRANSACTION_RECEIVED')
    expect(result.current.error).toBeUndefined()
    expect(result.current.loading).toBeFalsy()
  })
})
