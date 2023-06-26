import { useBlock, useBlockNumber } from './block'
import { renderHook, waitFor } from '../../test/react'
import { connectors, compiledErc20, deventAccounts, erc20ClassHash } from '../../test/devnet'

describe('useBlock', () => {
  beforeAll(async () => {
    const account = deventAccounts[1]!
    await account.declareAndDeploy({ contract: compiledErc20, classHash: erc20ClassHash })
  })

  it('returns the latest block by default', async () => {
    const { result } = renderHook(() => useBlock({ refetchInterval: false }), { connectors })

    await waitFor(
      () => {
        expect(result.current.data).toBeDefined()
        expect(result.current.status).toEqual('success')
      },
      {
        timeout: 30000,
        interval: 1000,
      }
    )
  })

  it.skip('returns an error', async () => {
    const { result } = renderHook(() => useBlock(), { connectors })

    await waitFor(
      () => {
        expect(result.current.isError).toBeTruthy()
      },
      {
        timeout: 30000,
        interval: 1000,
      }
    )
  })
})

describe('useBlockNumber', () => {
  beforeAll(async () => {
    const account = deventAccounts[1]!
    await account.declareAndDeploy({ contract: compiledErc20, classHash: erc20ClassHash })
  })

  it('returns the current block', async () => {
    const { result } = renderHook(() => useBlockNumber(), { connectors })

    await waitFor(
      () => {
        expect(result.current.data).toBeDefined()
        expect(result.current.status).toEqual('success')
      },
      {
        timeout: 30000,
        interval: 1000,
      }
    )
  })
})
