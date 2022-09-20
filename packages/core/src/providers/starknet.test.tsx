import { useStarknet } from '~/providers'
import { renderHook, waitFor } from '../../test/react'
import { connectors, deventAccounts } from '../../test/devnet'

describe('StarknetProvider', () => {
  it('accepts a list of connectors', async () => {
    const { result } = renderHook(() => useStarknet(), { connectors })

    expect(result.current.connectors).toHaveLength(3)
  })

  it('connects to the specified connector', async () => {
    const { result } = renderHook(() => useStarknet(), { connectors })

    expect(result.current.account).toBeUndefined()

    result.current.connect(result.current.connectors[1])

    await waitFor(() => {
      expect(result.current.account).toEqual(deventAccounts[1].address)
    })
  })
})
