import { renderHook, waitFor } from '../../test/react'
import { compiledErc20, devnetProvider } from '../../test/devnet'
import { useTransaction } from './transaction'

describe('useTransaction', () => {
  let hash: string
  beforeAll(async () => {
    const tx = await devnetProvider.deployContract({ contract: compiledErc20 })
    hash = tx.transaction_hash
  })

  describe('when given a valid tx hash', () => {
    it('returns the transaction data', async () => {
      const { result } = renderHook(() => useTransaction({ hash }))

      await waitFor(() => {
        expect(result.current.error).toBeUndefined()
        expect(result.current.loading).toBeFalsy()
        expect(result.current.data?.transaction_hash).toEqual(hash)
      })
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
