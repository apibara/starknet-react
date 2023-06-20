import { renderHook, waitFor } from '../../test/react'
import { compiledErc20, deventAccounts, erc20ClassHash } from '../../test/devnet'
import { useTransaction, useTransactions } from './transaction'

describe('useTransaction', () => {
  jest.setTimeout(500000)
  let hash: string
  beforeAll(async () => {
    const account = deventAccounts[1]!
    const tx = await account.declareAndDeploy({
      contract: compiledErc20,
      classHash: erc20ClassHash,
    })
    hash = tx.deploy.transaction_hash
  })

  describe('when given a valid tx hash', () => {
    it('returns the transaction data', async () => {
      const { result } = renderHook(() => useTransaction({ hash }))

      await waitFor(
        () => {
          expect(result.current.data?.transaction_hash).toEqual(hash)
          expect(result.current.error).toBeUndefined()
          expect(result.current.isIdle).toBeTruthy()
          expect(result.current.isLoading).toBeFalsy()
          expect(result.current.isFetching).toBeFalsy()
          expect(result.current.isFetched).toBeTruthy()
          expect(result.current.isFetchedAfterMount).toBeTruthy()
          expect(result.current.isRefetching).toBeFalsy()
          expect(result.current.status).toEqual('success')
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
          expect(result.current.data).toBeUndefined()
          expect(result.current.isLoading).toBeFalsy()
          expect(result.current.isIdle).toBeTruthy()
          expect(result.current.isFetching).toBeFalsy()
          expect(result.current.isSuccess).toBeFalsy()
          expect(result.current.isError).toBeTruthy()
          expect(result.current.isFetched).toBeTruthy()
          expect(result.current.isFetchedAfterMount).toBeTruthy()
          expect(result.current.isRefetching).toBeFalsy()
          expect(result.current.status).toEqual('error')
        },
        {
          timeout: 10000,
          interval: 1000,
        }
      )

      rerender({ hash })

      await waitFor(
        () => {
          expect(result.current.data?.transaction_hash).toEqual(hash)
          expect(result.current.error).toBeUndefined()
          expect(result.current.isLoading).toBeFalsy()
          expect(result.current.isIdle).toBeTruthy()
          expect(result.current.isLoading).toBeFalsy()
          expect(result.current.isFetching).toBeFalsy()
          expect(result.current.isSuccess).toBeTruthy()
          expect(result.current.isError).toBeFalsy()
          expect(result.current.isFetched).toBeTruthy()
          expect(result.current.isFetchedAfterMount).toBeTruthy()
          expect(result.current.isRefetching).toBeFalsy()
          expect(result.current.status).toEqual('success')
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
    const account = deventAccounts[1]!
    const tx0 = await account.declareAndDeploy({
      contract: compiledErc20,
      classHash: erc20ClassHash,
    })
    hash0 = tx0.deploy.transaction_hash
    const tx1 = await account.declareAndDeploy({
      contract: compiledErc20,
      classHash: erc20ClassHash,
    })
    hash1 = tx1.deploy.transaction_hash
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
          expect(result.current[0].isLoading).toBeFalsy()
          expect(result.current[1].isLoading).toBeFalsy()
          expect(result.current[2].isLoading).toBeFalsy()

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
