import { useAccount } from './account'
import { renderHook, waitFor, act } from '../../test/react'
import { Mock } from 'moq.ts'
import { deventAccounts } from '../../test/devnet'
import { useStarknet } from '~/providers'
import { Connector } from '~/connectors'

function useTestHook() {
  const { connectors, connect } = useStarknet()
  const {
    account,
    address,
    connector,
    status,
    isConnected,
    isConnecting,
    isReconnecting,
    isDisconnected,
  } = useAccount()
  return {
    account,
    connectors,
    connect,
    address,
    connector,
    status,
    isConnected,
    isConnecting,
    isReconnecting,
    isDisconnected,
  }
}

describe('useAccount', () => {
  describe('before user connects their wallet', () => {
    it('returns no account', async () => {
      const mocks = deventAccounts.map((account, index) => {
        const mock = new Mock<Connector>()
        mock
          .setup((conn) => conn.connect())
          .returnsAsync(account)
          .setup((conn) => conn.available())
          .returns(index > 1)
          .setup((conn) => conn.account())
          .returnsAsync(account)
          .setup((conn) =>
            conn.initEventListener(() => {
              return
            })
          )
          .returns(Promise.resolve())
          .setup((conn) =>
            conn.removeEventListener(() => {
              return
            })
          )
          .returns(Promise.resolve())
        return mock
      })

      const connectors = mocks.map((mock) => mock.object())

      const { result } = renderHook(() => useTestHook(), { connectors })

      await waitFor(() => {
        expect(result.current.account).toBeUndefined()
        expect(result.current.address).toBeUndefined()
        expect(result.current.connector).toBeUndefined()
        expect(result.current.status).toEqual('disconnected')
        expect(result.current.isConnected).toBeFalsy()
        expect(result.current.isConnecting).toBeFalsy()
        expect(result.current.isReconnecting).toBeFalsy()
        expect(result.current.isDisconnected).toBeTruthy()
      })
    })
  })

  describe('after user connects their wallet', () => {
    it('returns the connected account', async () => {
      const mocks = deventAccounts.map((account, index) => {
        const mock = new Mock<Connector>()
        mock
          .setup((conn) => conn.connect())
          .returnsAsync(account)
          .setup((conn) => conn.available())
          .returns(index > 1)
          .setup((conn) => conn.account())
          .returnsAsync(account)
          .setup((conn) =>
            conn.initEventListener(() => {
              return
            })
          )
          .returns(Promise.resolve())
          .setup((conn) =>
            conn.removeEventListener(() => {
              return
            })
          )
          .returns(Promise.resolve())
        return mock
      })

      const connectors = mocks.map((mock) => mock.object())

      const { result } = renderHook(() => useTestHook(), { connectors })

      act(() => {
        result.current.connect(result.current.connectors[2])
      })

      await waitFor(() => {
        expect(result.current.account).toBeDefined()
        expect(result.current.address).toEqual(deventAccounts[2].address)
        expect(result.current.connector).toBeDefined()
        expect(result.current.status).toEqual('connected')
        expect(result.current.isConnected).toBeTruthy()
        expect(result.current.isDisconnected).toBeFalsy()
      })
    })
  })
})
