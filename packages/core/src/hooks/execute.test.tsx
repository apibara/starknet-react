import { Mock } from 'moq.ts'
import { renderHook, waitFor, act } from '../../test/react'
import { compiledDapp, devnetProvider, deventAccounts } from '../../test/devnet'
import { Call, useStarknetExecute } from './execute'
import { Connector } from '~/connectors'
import { useStarknet } from '~/providers'
import { useAccount } from './account'

const mocks = deventAccounts.map((account, index) => {
  const mock = new Mock<Connector>()
  mock
    .setup((conn) => conn.connect())
    .returnsAsync(account)
    .setup((conn) => conn.available())
    .returns(index > 1)
    .setup((conn) => conn.account())
    .returnsAsync(account)
  return mock
})

const connectors = mocks.map((mock) => mock.object())

describe('useStarknetExecute', () => {
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
    const { data, error, loading, reset, execute } = useStarknetExecute({ calls })
    return {
      account,
      connectors,
      connect,
      data,
      error,
      loading,
      reset,
      execute,
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
          await result.current.execute()
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
        await result.current.execute()
      })

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
        expect(result.current.error).toBeUndefined()
      })
    })
  })
})
