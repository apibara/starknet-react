import { renderHook, waitFor } from '../../test/react'
import { deventAccounts } from '../../test/devnet'
import { useBalance } from './balance'

describe('useBalance', () => {
  function useTestHook({ address, token }: { address?: string; token?: string }) {
    return useBalance({
      address,
      token,
    })
  }

  describe('when address is undefined', () => {
    it('returns no data', async () => {
      const { result } = renderHook(() => useTestHook({ address: '' }))
      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.isIdle).toBeTruthy()
        expect(result.current.isLoading).toBeTruthy()
        expect(result.current.isFetching).toBeFalsy()
        expect(result.current.isSuccess).toBeFalsy()
        expect(result.current.isError).toBeFalsy()
        expect(result.current.isFetched).toBeFalsy()
        expect(result.current.isFetchedAfterMount).toBeFalsy()
        expect(result.current.isRefetching).toBeFalsy()
        expect(result.current.status).toEqual('loading')
      })
    })
  })

  describe('when reading', () => {
    it('returns data if it succeeds', async () => {
      const { result } = renderHook(() => useTestHook({ address: deventAccounts[1].address }))

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.isIdle).toBeTruthy()
        expect(result.current.isLoading).toBeFalsy()
        expect(result.current.isFetching).toBeFalsy()
        expect(result.current.isSuccess).toBeTruthy()
        expect(result.current.isError).toBeFalsy()
        expect(result.current.isFetched).toBeTruthy()
        expect(result.current.isFetchedAfterMount).toBeTruthy()
        expect(result.current.isRefetching).toBeFalsy()
        expect(result.current.status).toEqual('success')
      })
    })

    it('formats balance correctly', async () => {
      const devnetETHTokenAddress =
        '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
      const defaultAccountBalanceWei = 1000000000000000000000
      const balanceInEther = defaultAccountBalanceWei / 10 ** 18

      const { result } = renderHook(() =>
        useTestHook({
          address: deventAccounts[0].address,
          token: devnetETHTokenAddress,
        })
      )

      await waitFor(() => {
        expect(result.current.data?.formatted).toBe(balanceInEther.toString())
      })
    })
  })
})
