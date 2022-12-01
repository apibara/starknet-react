import { renderHook, waitFor } from '../../test/react'
import { compiledErc20 } from '../../test/devnet'
import { useContract, useContractFactory } from './contract'
import { Abi } from 'starknet'
import { deventAccounts } from '../../test/devnet'

const address = '0x017239d35be9e3a622b01677fff06c05ea7d926b94f864e59188d1a7eca00b1f'

describe('useContract', () => {
  it('returns the contract', () => {
    const { result } = renderHook(() => useContract({ abi: compiledErc20.abi, address }))
    expect(result.current.contract).toBeDefined()
  })

  describe('abi', () => {
    it('returns undefined if undefined', () => {
      const { result } = renderHook(() => useContract({ address }))
      expect(result.current.contract).toBeUndefined()
    })

    it('returns contract if it becomes defined', async () => {
      const { result, rerender } = renderHook(({ abi }: { abi?: Abi } = {}) =>
        useContract({ address, abi })
      )
      expect(result.current.contract).toBeUndefined()

      rerender({ abi: compiledErc20.abi })
      await waitFor(() => {
        expect(result.current.contract).toBeDefined()
      })
    })

    it('returns undefined if it become undefined', async () => {
      const { result, rerender } = renderHook(
        ({ abi }: { abi?: Abi } = { abi: compiledErc20.abi }) => useContract({ address, abi })
      )
      expect(result.current.contract).toBeDefined()

      rerender({ abi: undefined })
      await waitFor(() => {
        expect(result.current.contract).toBeUndefined()
      })
    })
  })

  describe('address', () => {
    it('returns undefined if undefined', () => {
      const { result } = renderHook(() => useContract({ abi: compiledErc20.abi }))
      expect(result.current.contract).toBeUndefined()
    })

    it('returns contract if it becomes defined', async () => {
      const { result, rerender } = renderHook(({ address }: { address?: string } = {}) =>
        useContract({ address, abi: compiledErc20.abi })
      )
      expect(result.current.contract).toBeUndefined()

      rerender({ address })
      await waitFor(() => {
        expect(result.current.contract).toBeDefined()
      })
    })

    it('returns undefined if it become undefined', async () => {
      const { result, rerender } = renderHook(({ addr }: { addr?: string } = { addr: address }) =>
        useContract({ address: addr, abi: compiledErc20.abi })
      )
      expect(result.current.contract).toBeDefined()

      rerender({ addr: undefined })
      await waitFor(() => {
        expect(result.current.contract).toBeUndefined()
      })
    })
  })
})

describe('useContractFactory', () => {
  it('returns the contract factory', async () => {
    const { result } = renderHook(() =>
      useContractFactory({
        abi: compiledErc20.abi,
        account: deventAccounts[0],
        classHash: '0x54328a1075b8820eb43caf0caa233923148c983742402dcfc38541dd843d01a',
        compiledContract: compiledErc20,
      })
    )
    await waitFor(() => {
      expect(result.current.contractFactory).toBeDefined()
    })
  })
})
