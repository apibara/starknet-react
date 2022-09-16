import { renderHook, waitFor } from '../../test/react'
import { compiledErc20, devnetProvider } from '../../test/devnet'
import { useStarknetCall } from './call'
import { useContract } from './contract'

describe('useStarknetCall', () => {
  let address: string
  beforeAll(async () => {
    const tx = await devnetProvider.deployContract({ contract: compiledErc20 })
    address = tx.contract_address
  })

  function useTestHook({
    address,
    method,
    args,
  }: {
    address?: string
    method?: string
    args?: unknown[]
  }) {
    const { contract } = useContract({ abi: compiledErc20.abi, address })
    return useStarknetCall({
      contract,
      method,
      args,
      options: {
        watch: false,
      },
    })
  }

  describe('when reading', () => {
    it('returns an error if the read fails', async () => {
      const { result } = renderHook(() => useTestHook({ method: 'balance_of', address, args: [] }))

      await waitFor(
        () => {
          expect(result.current.data).toBeUndefined()
          expect(result.current.error).toBeDefined()
          expect(result.current.loading).toBeFalsy()
        },
        {
          timeout: 30000,
          interval: 1000,
        }
      )
    })

    it('returns data if the read succeed', async () => {
      const { result } = renderHook(() =>
        useTestHook({ method: 'get_total_supply', address, args: [] })
      )

      await waitFor(
        () => {
          expect(result.current.data).toBeDefined()
          expect(result.current.error).toBeUndefined()
          expect(result.current.loading).toBeFalsy()
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
      const { result } = renderHook(() => useTestHook({ method: 'get_total_supply', args: [] }))

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.loading).toBeTruthy()
      })
    })
  })

  describe('when method is undefined', () => {
    it('returns no data', async () => {
      const { result } = renderHook(() => useTestHook({ address, args: [] }))

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.loading).toBeTruthy()
      })
    })
  })

  describe('when args is undefined', () => {
    it('returns no data', async () => {
      const { result } = renderHook(() => useTestHook({ method: 'get_total_supply', address }))

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
        expect(result.current.loading).toBeTruthy()
      })
    })
  })
})
