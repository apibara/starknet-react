import { constants } from 'starknet'
import { renderHook, waitFor } from '../../test/react'
import { useNetwork } from './network'

describe('useNetwork', () => {
  it('returns the current chain', async () => {
    const { result } = renderHook(() => useNetwork())
    await waitFor(() => {
      expect(result.current.chain).toBeDefined()
      expect(result.current.chain?.id).toEqual(constants.StarknetChainId.SN_GOERLI)
    })
  })
})
