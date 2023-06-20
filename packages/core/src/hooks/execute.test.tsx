import { renderHook, waitFor, act } from '../../test/react'
import {
  compiledDapp,
  devnetProvider,
  connectors,
  deventAccounts,
  dappClassHash,
} from '../../test/devnet'
import { useContractWrite } from './execute'
import { useStarknet } from '~/providers'
import { useAccount } from './account'
import { Call } from 'starknet'

describe('useContractWrite', () => {
  let address: string
  let calls: Call[]
  beforeAll(async () => {
    const account = deventAccounts[1]!
    const tx = await account.declareAndDeploy({ contract: compiledDapp, classHash: dappClassHash })
    await devnetProvider.waitForTransaction(tx.deploy.transaction_hash)
    address = tx.deploy.contract_address
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
