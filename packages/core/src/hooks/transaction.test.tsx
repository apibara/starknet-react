import { renderHook, waitFor } from '../../test/react'
import { compiledErc20, devnetProvider } from '../../test/devnet'
import { useTransaction, useTransactions } from './transaction'

describe('useTransaction', () => {
  let hash: string
  beforeAll(async () => {
    const tx = await devnetProvider.deployContract({ contract: compiledErc20 })
    hash = tx.transaction_hash
  })

  describe('when given a valid tx hash', () => {
    it('returns the transaction data', async () => {
      const { result } = renderHook(() => useTransaction({ hash }))

      await waitFor(
        () => {
          expect(result.current.error).toBeUndefined()
          expect(result.current.loading).toBeFalsy()
          expect(result.current.data?.transaction_hash).toEqual(hash)
        },
        {
          timeout: 10000,
          interval: 1000,
        }
      )
    })

    it('refreshes data on hash change', async () => {
      const { result, rerender } = renderHook(({ hash }: { hash?: string } = { hash: undefined }) =>
        useTransaction({ hash })
      )

      await waitFor(
        () => {
          expect(result.current.error).toBeDefined()
          expect(result.current.loading).toBeFalsy()
          expect(result.current.data).toBeUndefined()
        },
        {
          timeout: 10000,
          interval: 1000,
        }
      )

      rerender({ hash })

      await waitFor(
        () => {
          expect(result.current.error).toBeUndefined()
          expect(result.current.loading).toBeFalsy()
          expect(result.current.data?.transaction_hash).toEqual(hash)
        },
        {
          timeout: 10000,
          interval: 1000,
        }
      )
    })
  })
})

describe('useTransactions', () => {
  let hash0: string
  let hash1: string
  beforeAll(async () => {
    const tx0 = await devnetProvider.deployContract({ contract: compiledErc20 })
    hash0 = tx0.transaction_hash
    const tx1 = await devnetProvider.deployContract({ contract: compiledErc20 })
    hash1 = tx1.transaction_hash
  })

  describe('when changing the number of hashes', () => {
    it('refreshes the data', async () => {
      const { result, rerender } = renderHook(({ hashes }: { hashes: string[] } = { hashes: [] }) =>
        useTransactions({ hashes })
      )

      await waitFor(
        () => {
          expect(result.current.length).toEqual(0)
        },
        {
          timeout: 10000,
          interval: 1000,
        }
      )

      rerender({ hashes: [hash0, hash1] })

      await waitFor(
        () => {
          expect(result.current.length).toEqual(2)
        },
        {
          timeout: 10000,
          interval: 1000,
        }
      )
    })
  })

  describe('when given an invalid hash', () => {
    it('returns the other transactions without error', async () => {
      const { result } = renderHook(() => useTransactions({ hashes: [hash0, '0x0', hash1] }))

      await waitFor(
        () => {
          expect(result.current.length).toEqual(3)
          expect(result.current[0].loading).toBeFalsy()
          expect(result.current[1].loading).toBeFalsy()
          expect(result.current[2].loading).toBeFalsy()

          expect(result.current[0].data?.transaction_hash).toEqual(hash0)
          expect(result.current[1].error).toBeDefined()
          expect(result.current[2].data?.transaction_hash).toEqual(hash1)
        },
        {
          timeout: 10000,
          interval: 1000,
        }
      )
    })
  })
})
