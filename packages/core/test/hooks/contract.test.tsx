import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { Abi } from 'starknet'
import { StarknetProvider, useContract } from '../../src'

import { CounterAbi, COUNTER_ADDRESS } from '../shared/counter'

describe('useContract', () => {
  const address = COUNTER_ADDRESS
  const wrapper = ({ children }) => <StarknetProvider>{children}</StarknetProvider>

  it('returns the connected Contract', async () => {
    const { result } = renderHook(() => useContract(CounterAbi as Abi[], address), { wrapper })
    expect(result.current).not.toBeUndefined()
    expect(result.current.connectedTo).toEqual(address)
  })

  it('updates the Contract if address changes', async () => {
    const { result, rerender } = renderHook(
      ({ address }) => useContract(CounterAbi as Abi[], address),
      {
        wrapper,
        initialProps: {
          children: undefined,
          address: undefined,
        },
      }
    )

    expect(result.current).toBeUndefined()

    act(() => {
      rerender({ address, children: undefined })
    })

    expect(result.current).not.toBeUndefined()
  })
})
