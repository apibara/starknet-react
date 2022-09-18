import { StarknetChainId } from 'starknet/constants'
import { renderHook, waitFor } from '../../test/react'
import { useNetwork } from './network'

describe('useNetwork', () => {
  it('returns the current chain', async () => {
    const { result } = renderHook(() => useNetwork())
    await waitFor(() => {
      expect(result.current.chain).toBeDefined()
      expect(result.current.chain?.id).toEqual(StarknetChainId.TESTNET)
    })
  })
})
