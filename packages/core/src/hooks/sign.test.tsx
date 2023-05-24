import { Mock } from 'moq.ts'
import { renderHook, waitFor, act } from '../../test/react'
import { deventAccounts } from '../../test/devnet'
import { useSignTypedData } from './sign'
import { Connector } from '~/connectors'
import { typedData } from 'starknet'
import { useStarknet } from '~/providers'

const exampleData = {
  types: {
    StarkNetDomain: [
      { name: 'name', type: 'felt' },
      { name: 'version', type: 'felt' },
      { name: 'chainId', type: 'felt' },
    ],
    Person: [
      { name: 'name', type: 'felt' },
      { name: 'wallet', type: 'felt' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'felt' },
    ],
  },
  primaryType: 'Mail',
  domain: {
    name: 'Starknet Mail',
    version: '1',
    chainId: 1,
  },
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
  },
}

describe('useSignTypedData', () => {
  describe('with no connector available', () => {
    it('returns an error', async () => {
      const mocks = deventAccounts.map((account) => {
        const mock = new Mock<Connector>()
        mock
          .setup((conn) => conn.connect())
          .returnsAsync(account)
          .setup((conn) => conn.available())
          .returns(false)
        return mock
      })

      const connectors = mocks.map((mock) => mock.object())

      const { result } = renderHook(() => useSignTypedData(exampleData), { connectors })

      await act(async () => {
        await result.current.signTypedData()
      })

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
        expect(result.current.data).toBeUndefined()
      })
    })
  })

  describe('with no connector connected', () => {
    it('returns an error', async () => {
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

      const { result } = renderHook(() => useSignTypedData(exampleData), { connectors })

      await act(async () => {
        await result.current.signTypedData()
      })

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
        expect(result.current.data).toBeUndefined()
      })
    })
  })

  describe('with a connected connector', () => {
    function useTestHook({ data }: { data: typedData.TypedData }) {
      const { connectors, connect, account } = useStarknet()
      const { error, data: result, reset, signTypedData } = useSignTypedData(data)
      return {
        account,
        connectors,
        connect,
        error,
        data: result,
        reset,
        signTypedData,
      }
    }

    // There is an issue with the injected TextEncoder
    it.skip('returns the data signed by the account', async () => {
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

      const { result } = renderHook(() => useTestHook({ data: exampleData }), { connectors })

      result.current.connect(connectors[2])
      await waitFor(() => {
        expect(result.current.account).toBeDefined()
      })

      await act(async () => {
        await result.current.signTypedData()
      })

      await waitFor(() => {
        expect(result.current.error).toBeUndefined()
        expect(result.current.data).toBeDefined()
      })
    })
  })
})
