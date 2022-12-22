import { renderHook, waitFor } from '../../test/react'
import { compiledErc20, devnetProvider } from '../../test/devnet'
import { useContractRead } from './call'

describe('useStarknetCall', () => {
  let address: string
  beforeAll(async () => {
    const tx = await devnetProvider.deployContract({ contract: compiledErc20 })
    address = tx.contract_address
  })

  function useTestHook({
    address = '',
    functionName = '',
    args,
  }: {
    address?: string
    functionName?: string
    args?: unknown[]
  }) {
    return useContractRead({
      abi: compiledErc20.abi,
      address,
      functionName,
      args,
      watch: false,
    })
  }

  describe('when reading', () => {
    it('returns an error if the read fails', async () => {
      const { result } = renderHook(() =>
        useTestHook({ functionName: 'balance_of', address, args: [] })
      )

      await waitFor(
        () => {
          expect(result.current.data).toBeUndefined()
          expect(result.current.error).toBeDefined()
          expect(result.current.isIdle).toBeTruthy()
          expect(result.current.isLoading).toBeFalsy()
          expect(result.current.isFetching).toBeFalsy()
          expect(result.current.isSuccess).toBeFalsy()
          expect(result.current.isError).toBeTruthy()
          expect(result.current.isFetched).toBeTruthy()
          expect(result.current.isFetchedAfterMount).toBeTruthy()
          expect(result.current.isRefetching).toBeFalsy()
          expect(result.current.status).toEqual('error')
        },
        {
          timeout: 30000,
          interval: 1000,
        }
      )
    })

    it('returns data if the read succeed', async () => {
      const { result } = renderHook(() =>
        useTestHook({ functionName: 'get_total_supply', address, args: [] })
      )

      await waitFor(
        () => {
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
        },
        {
          timeout: 30000,
          interval: 1000,
        }
      )
    })
  })

  describe('when contract is undefined', () => {
    it('returns no data', async () => {
      const { result } = renderHook(() =>
        useTestHook({ functionName: 'get_total_supply', args: [] })
      )

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.isIdle).toBeTruthy()
        expect(result.current.isLoading).toBeTruthy()
        expect(result.current.isFetching).toBeTruthy()
        expect(result.current.isSuccess).toBeFalsy()
        expect(result.current.isError).toBeFalsy()
        expect(result.current.isFetched).toBeFalsy()
        expect(result.current.isFetchedAfterMount).toBeFalsy()
        expect(result.current.isRefetching).toBeFalsy()
        expect(result.current.status).toEqual('loading')
      })
    })
  })

  describe('when method is undefined', () => {
    it('returns no data', async () => {
      const { result } = renderHook(() => useTestHook({ address, args: [] }))

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.isIdle).toBeTruthy()
        expect(result.current.isLoading).toBeTruthy()
        expect(result.current.isFetching).toBeTruthy()
        expect(result.current.isSuccess).toBeFalsy()
        expect(result.current.isError).toBeFalsy()
        expect(result.current.isFetched).toBeFalsy()
        expect(result.current.isFetchedAfterMount).toBeFalsy()
        expect(result.current.isRefetching).toBeFalsy()
        expect(result.current.status).toEqual('loading')
      })
    })
  })

  describe('when args is undefined', () => {
    it('returns no data', async () => {
      const { result } = renderHook(() =>
        useTestHook({ functionName: 'get_total_supply', address })
      )

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.isIdle).toBeTruthy()
        expect(result.current.isLoading).toBeTruthy()
        expect(result.current.isFetching).toBeTruthy()
        expect(result.current.isSuccess).toBeFalsy()
        expect(result.current.isError).toBeFalsy()
        expect(result.current.isFetched).toBeFalsy()
        expect(result.current.isFetchedAfterMount).toBeFalsy()
        expect(result.current.isRefetching).toBeFalsy()
        expect(result.current.status).toEqual('loading')
      })
    })
  })
})
