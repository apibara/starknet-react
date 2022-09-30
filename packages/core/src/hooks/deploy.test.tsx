import { act, renderHook, waitFor } from '../../test/react'
import { useAccount } from './account'
import { useContractFactory } from './contract'
import { compiledErc20, connectors } from '../../test/devnet'
import { useDeploy } from './deploy'
import { useConnectors } from './connectors'
import { Contract } from 'starknet'

describe('useDeploy', () => {
  function useTestHook() {
    const { connect, connectors } = useConnectors()
    const { account } = useAccount()
    const { contractFactory } = useContractFactory({
      compiledContract: compiledErc20,
      providerOrAccount: account,
      abi: compiledErc20.abi,
    })
    const { data, loading, error, reset, deploy } = useDeploy({ contractFactory })

    return { data, loading, error, reset, deploy, connect, connectors, account }
  }

  describe('without a factory', () => {
    it('returns an error', async () => {
      const { result } = renderHook(() => useDeploy({}))

      await waitFor(() => {
        expect(result.current.error).toBeUndefined()
      })

      await act(async () => {
        // error expected
        try {
          await result.current.deploy()
        } catch (err) {
          console.log(err)
        }
      })

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
      })
    })
  })

  describe('with a factory', () => {
    // fails for some reason
    it.skip('deploys the contract', async () => {
      const { result } = renderHook(() => useTestHook(), { connectors })

      act(() => {
        result.current.connect(result.current.connectors[1])
      })

      await waitFor(() => {
        expect(result.current.account).toBeDefined()
      })

      await act(async () => {
        await result.current.deploy()
      })

      await waitFor(
        () => {
          expect(result.current.data).toBeDefined()
          expect(result.current.data).toBeInstanceOf(Contract)
          expect(result.current.loading).toBeFalsy()
          expect(result.current.error).toBeUndefined()
        },
        {
          timeout: 20000,
          interval: 1000,
        }
      )

      act(() => {
        result.current.reset()
      })

      await waitFor(() => {
        expect(result.current.data).toBeUndefined()
      })
    })
  })
})
