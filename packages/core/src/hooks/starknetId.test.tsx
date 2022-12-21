import { Account } from 'starknet'
import {
  connectors,
  compiledNaming,
  compiledStarknetId,
  devnetProvider,
  deventAccounts,
} from '../../test/devnet'
import { act, renderHook, waitFor } from '../../test/react'
import { useStarknet } from '../providers'
import { useAccount } from './account'
import { useStarknetExecute, Call } from './execute'
import { useStarkName } from './starknetId'

describe('useStarkName', () => {
  let account: Account
  let calls: Call[]

  beforeAll(async () => {
    const namingDeployment = await devnetProvider.deployContract({ contract: compiledNaming })
    const starknetIdDeployment = await devnetProvider.deployContract({
      contract: compiledStarknetId,
    })

    account = deventAccounts[1]!
    calls = [
      {
        contractAddress: namingDeployment.contract_address,
        entrypoint: 'initializer',
        calldata: [
          starknetIdDeployment.contract_address, // starknetid_contract_addr
          '0', // pricing_contract_addr
          account.address, // admin
          await account.signer.getPubKey(), // whitelisting_key
          '0', // l1_contract
        ],
      },
      {
        contractAddress: starknetIdDeployment.contract_address,
        entrypoint: 'mint',
        calldata: ['1'], // TokenId
      },
      {
        contractAddress: namingDeployment.contract_address,
        entrypoint: 'whitelisted_mint',
        calldata: [
          '18925', // Domain encoded "ben"
          '1922775124', // Expiry
          '1', // Starknet id linked
          account.address, // receiver_address
          // signed[0], // sig 0 for whitelist
          // signed[1], // sig 1 for whitelist
        ],
      },
      {
        contractAddress: namingDeployment.contract_address,
        entrypoint: 'set_address_to_domain',
        calldata: [
          '1', // length
          '18925', // Domain encoded "ben"
        ],
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

  it('should get starkname', async () => {
    const { result } = renderHook(() => useTestHook({ calls }), { connectors })

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeUndefined()
    })

    act(() => result.current.connect(result.current.connectors[2]))

    await waitFor(() => {
      console.log('current', result.current)
      expect(result.current.data).toBeUndefined()
    })

    const { result: res } = renderHook(() => useStarkName({ address: account.address }))

    await waitFor(
      () => {
        console.log('starkname', res)
      },
      {
        timeout: 60000,
        interval: 2000,
      }
    )
  })
})
