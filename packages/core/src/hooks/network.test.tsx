import { renderHook } from '../../test/react'
import { UseNetwork } from './network'
import { StarknetChainId } from 'starknet/constants'

describe.only('useNetwork', () => {
  it('returns the default chain', () => {
    const { result } = renderHook(() => UseNetwork())
    expect(result.current.chain).toBeDefined()
  })

  describe('chain', () => {
    it('returns the alpha-goerli network by default', () => {
      const { result } = renderHook(() => UseNetwork())
      expect(result.current.chain?.id).toBe(StarknetChainId.TESTNET)
      expect(result.current.chain?.testnet).toBe(true)
    })
  })
})
