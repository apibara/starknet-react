import { renderHook, waitFor } from '../../test/react'
import { compiledErc20, devnetProvider } from '../../test/devnet'
import { useTransactionReceipt } from './receipt'

describe('useTransactionReceipt', () => {
  let hash: string
  beforeAll(async () => {
    const tx = await devnetProvider.deployContract({ contract: compiledErc20 })
    hash = tx.transaction_hash
  })

  describe('when given a valid tx hash', () => {
    it('returns the transaction receipt', async () => {
      const { result } = renderHook(() => useTransactionReceipt({ hash }))

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
        useTransactionReceipt({ hash })
      )

      await waitFor(
        () => {
          expect(result.current.error).toBeUndefined()
          expect(result.current.loading).toBeTruthy()
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
