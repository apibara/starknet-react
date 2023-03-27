import { Mock } from 'moq.ts'
import { renderHook, waitFor } from '../../test/react'
import { deventAccounts } from '../../test/devnet'
import { useConnectors } from './connectors'
import { Connector } from '~/connectors'

describe('useConnectors', () => {
  it('returns all installed connectors', async () => {
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

    const { result } = renderHook(() => useConnectors(), { connectors })

    await waitFor(() => {
      expect(result.current.connectors).toHaveLength(connectors.length)
      expect(result.current.available).toHaveLength(0)
    })
  })

  it('returns available connectors', async () => {
    const mocks = deventAccounts.map((account, index) => {
      const mock = new Mock<Connector>()
      mock
        .setup((conn) => conn.connect())
        .returnsAsync(account)
        .setup((conn) => conn.available())
        .returns(index > 1)
      return mock
    })

    const connectors = mocks.map((mock) => mock.object())

    const { result } = renderHook(() => useConnectors(), { connectors })

    await waitFor(() => {
      expect(result.current.connectors).toHaveLength(connectors.length)
      expect(result.current.available).toHaveLength(1)
      expect(result.current.isLoading).toBeFalsy()
    })
  })

  it('refresh available connectors', async () => {
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

    const { result } = renderHook(() => useConnectors(), { connectors })

    await waitFor(() => {
      expect(result.current.connectors).toHaveLength(connectors.length)
      expect(result.current.available).toHaveLength(0)
    })

    mocks[1].setup((conn) => conn.available()).returns(true)
    mocks[2].setup((conn) => conn.available()).returns(true)

    await waitFor(() => {
      result.current.refresh()
      expect(result.current.available).toHaveLength(2)
      expect(result.current.isLoading).toBeFalsy()
    })
  })
})
