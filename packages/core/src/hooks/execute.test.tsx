import { renderHook, waitFor, act } from '../../test/react'
import { compiledDapp, devnetProvider, connectors } from '../../test/devnet'
import { Call, useContractWrite } from './execute'
import { useStarknet } from '~/providers'
import { useAccount } from './account'

describe('useContractWrite', () => {
  let address: string
  let calls: Call[]
  beforeAll(async () => {
    const tx = await devnetProvider.deployContract({ contract: compiledDapp })
    await devnetProvider.waitForTransaction(tx.transaction_hash)
    address = tx.contract_address
    calls = [
      {
        contractAddress: address,
        entrypoint: 'set_number',
        calldata: ['44'],
      },
      {
        contractAddress: address,
        entrypoint: 'increase_number',
        calldata: ['11'],
      },
    ]
  })

  function useTestHook({ calls }: { calls?: Call[] }) {
    const { connectors, connect } = useStarknet()
    const { account } = useAccount()
    const test = useContractWrite({ calls })
    console.log(test)
    const { data, error, isLoading, reset, writeAsync } = useContractWrite({ calls })
    return {
      account,
      connectors,
      connect,
      data,
      error,
      isLoading,
      reset,
      writeAsync,
    }
  }

  describe('without a connected account', () => {
    it('returns an error', async () => {
      const { result } = renderHook(() => useTestHook({ calls }), { connectors })

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeUndefined()
      })

      await act(async () => {
        try {
          await result.current.writeAsync()
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

  describe('when calling execute', () => {
    // TODO: why devnet says no contract at deployed address?
    it.skip('performs the provided calls', async () => {
      const { result } = renderHook(() => useTestHook({ calls }), { connectors })

      act(() => {
        result.current.connect(result.current.connectors[2])
      })

      await waitFor(() => {
        expect(result.current.account).toBeDefined()
      })

      await act(async () => {
        await result.current.writeAsync()
      })

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
        expect(result.current.error).toBeUndefined()
      })
    })
  })
})
