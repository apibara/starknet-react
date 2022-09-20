import { renderHook, waitFor, act } from '../../test/react'
import { compiledDapp, devnetProvider, connectors } from '../../test/devnet'
import { useStarknetInvoke } from './invoke'
import { Contract, ContractInterface } from 'starknet'
import { useStarknet } from '~/providers'
import { useAccount } from './account'

describe('useStarknetExecute', () => {
  let address: string
  let contract: ContractInterface
  beforeAll(async () => {
    const tx = await devnetProvider.deployContract({ contract: compiledDapp })
    await devnetProvider.waitForTransaction(tx.transaction_hash)
    address = tx.contract_address
    contract = new Contract(compiledDapp.abi, address)
  })

  function useTestHook({ contract, method }: { contract?: ContractInterface; method?: string }) {
    const { connectors, connect } = useStarknet()
    const { account } = useAccount()
    const { data, error, loading, reset, invoke } = useStarknetInvoke({ contract, method })
    return {
      account,
      connectors,
      connect,
      data,
      error,
      loading,
      reset,
      invoke,
    }
  }

  describe('without a contract', () => {
    it('returns an error', async () => {
      const { result } = renderHook(() => useTestHook({ method: 'set_number' }), {
        connectors,
      })

      act(() => {
        result.current.connect(result.current.connectors[2])
      })

      await waitFor(() => {
        expect(result.current.account).toBeDefined()
      })

      await act(async () => {
        try {
          await result.current.invoke({ args: [42] })
        } catch (err) {
          // error is expected
          console.log(err)
        }
      })

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeDefined()
      })

      act(() => {
        result.current.reset()
      })

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
      })
    })
  })

  describe('without a method', () => {
    it('returns an error', async () => {
      const { result } = renderHook(() => useTestHook({ contract }), {
        connectors,
      })

      act(() => {
        result.current.connect(result.current.connectors[2])
      })

      await waitFor(() => {
        expect(result.current.account).toBeDefined()
      })

      await act(async () => {
        try {
          await result.current.invoke({ args: [42] })
        } catch (err) {
          // error is expected
          console.log(err)
        }
      })

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeDefined()
      })

      act(() => {
        result.current.reset()
      })

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
      })
    })
  })

  describe('without a connected account', () => {
    it('returns an error', async () => {
      const { result } = renderHook(() => useTestHook({ contract }), {
        connectors,
      })

      await act(async () => {
        try {
          await result.current.invoke({ args: [42] })
        } catch (err) {
          // error is expected
          console.log(err)
        }
      })

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeDefined()
      })
    })
  })

  describe('when calling invoke', () => {
    it.skip('performs the contract invocation', async () => {
      const { result } = renderHook(() => useTestHook({ contract, method: 'set_number' }), {
        connectors,
      })

      act(() => {
        result.current.connect(result.current.connectors[2])
      })

      await waitFor(() => {
        expect(result.current.account).toBeDefined()
      })

      await act(async () => {
        await result.current.invoke({ args: [42], overrides: { maxFee: 1000 } })
      })

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
        expect(result.current.error).toBeUndefined()
      })
    })
  })
})
