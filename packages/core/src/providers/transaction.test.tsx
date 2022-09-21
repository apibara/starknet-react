import { useTransactionManager } from '~/providers'
import { act, renderHook, waitFor } from '../../test/react'

describe('useTransactionManager', () => {
  it('starts with no tracked transactions', async () => {
    const { result } = renderHook(() => useTransactionManager())

    await waitFor(() => {
      expect(result.current.hashes.length).toEqual(0)
      expect(result.current.transactions.length).toEqual(0)
    })
  })

  it('can add and remove transactions', async () => {
    const { result } = renderHook(() => useTransactionManager<{ id: number }>())

    act(() => {
      result.current.addTransaction({ hash: '0x0', metadata: { id: 0 } })
    })

    await waitFor(() => {
      expect(result.current.hashes.length).toEqual(1)
      expect(result.current.transactions.length).toEqual(1)
      expect(result.current.hashes).toEqual(['0x0'])
      expect(result.current.transactions).toEqual([{ hash: '0x0', metadata: { id: 0 } }])
    })

    act(() => {
      result.current.addTransaction({ hash: '0x1' })
      result.current.removeTransaction({ hash: '0x0' })
    })

    await waitFor(() => {
      expect(result.current.hashes.length).toEqual(1)
      expect(result.current.transactions.length).toEqual(1)
      expect(result.current.hashes).toEqual(['0x1'])
      expect(result.current.transactions).toEqual([{ hash: '0x1' }])
    })
  })
})
