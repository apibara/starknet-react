import { Account, ec, num, stark } from 'starknet'
import {
  compiledNaming,
  compiledStarknetId,
  devnetProvider,
  deventAccounts,
} from '../../test/devnet'
import { renderHook, waitFor } from '../../test/react'
import { useStarkName, useAddressFromStarkName } from './starknetid'

// Tests skipped for now because devnet provider is initialized with a custom baseUrl
// but the chainId of testnet which result in the provider object being setup to testnet
// instead of devnet in the starknetid hooks.

describe('useStarkName', () => {
  jest.setTimeout(500000)
  let account: Account
  let otherAccount: Account
  let namingAddress: string

  beforeAll(async () => {
    account = deventAccounts[1]!
    otherAccount = deventAccounts[2]!

    // Declare & deploy Naming and id contract
    const namingResponse = await account.declareAndDeploy({
      contract: compiledNaming,
      classHash: '0x3f2f8c80ab2d404bcfb4182e8528708e4efa2c646dd711bdd7b721ecc6111f7',
    })
    namingAddress = namingResponse.deploy.contract_address

    const idResponse = await account.declareAndDeploy({
      contract: compiledStarknetId,
      classHash: '0x1eb5a8308760d82321cb3ee8967581bb1d38348c7d2f082a07580040c52217c',
    })
    const idAddress = idResponse.deploy.contract_address

    // Initialize & mint identity and domain
    const whitelistingPublicKey =
      '1893860513534673656759973582609638731665558071107553163765293299136715951024'
    const whitelistingPrivateKey =
      '301579081698031303837612923223391524790804435085778862878979120159194507372'
    const hashed = ec.starkCurve.pedersen(
      ec.starkCurve.pedersen(num.toBigInt('18925'), num.toBigInt('1922775124')),
      num.toBigInt(num.hexToDecimalString(account.address))
    )
    const signed = stark.formatSignature(ec.starkCurve.sign(whitelistingPrivateKey, hashed))

    const { transaction_hash } = await account.execute([
      {
        contractAddress: namingAddress,
        entrypoint: 'initializer',
        calldata: [
          idAddress, // starknetid_contract_addr
          '0', // pricing_contract_addr
          account.address, // admin
          whitelistingPublicKey, // whitelisting_key
          '0', // l1_contract
        ],
      },
      {
        contractAddress: idAddress,
        entrypoint: 'mint',
        calldata: ['1'], // TokenId
      },
      {
        contractAddress: namingAddress,
        entrypoint: 'whitelisted_mint',
        calldata: [
          '18925', // Domain encoded "ben"
          '1922775124', // Expiry
          '1', // Starknet id linked
          account.address, // receiver_address
          signed[0], // sig 0 for whitelist
          signed[1], // sig 1 for whitelist
        ],
      },
      {
        contractAddress: namingAddress,
        entrypoint: 'set_address_to_domain',
        calldata: [
          '1', // length
          '18925', // Domain encoded "ben"
        ],
      },
    ])
    await devnetProvider.waitForTransaction(transaction_hash)
  })

  it.skip('should get starkname from custom starknet.id contract', async () => {
    const { result: starkNameResult } = renderHook(() =>
      useStarkName({ address: account.address, contract: namingAddress })
    )
    await waitFor(
      () => {
        expect(starkNameResult.current.data).toEqual('ben.stark')
        expect(starkNameResult.current.isLoading).toBeFalsy()
        expect(starkNameResult.current.isSuccess).toBeTruthy()
        expect(starkNameResult.current.isError).toBeFalsy()
        expect(starkNameResult.current.isIdle).toBeTruthy()
        expect(starkNameResult.current.isFetching).toBeFalsy()
        expect(starkNameResult.current.isFetched).toBeTruthy()
        expect(starkNameResult.current.isFetchedAfterMount).toBeTruthy()
        expect(starkNameResult.current.isRefetching).toBeFalsy()
        expect(starkNameResult.current.status).toEqual('success')
      },
      {
        timeout: 30000,
        interval: 1000,
      }
    )
  })

  it.skip('get starkname should fail because contract not deployed', async () => {
    const { result: starkNameResult } = renderHook(() => useStarkName({ address: account.address }))

    await waitFor(
      () => {
        expect(starkNameResult.current.data).toBeUndefined()
        expect(starkNameResult.current.isLoading).toBeFalsy()
        expect(starkNameResult.current.isSuccess).toBeFalsy()
        expect(starkNameResult.current.isError).toBeTruthy()
        expect(starkNameResult.current.error).toBeDefined()
        expect(starkNameResult.current.isIdle).toBeTruthy()
        expect(starkNameResult.current.isFetching).toBeFalsy()
        expect(starkNameResult.current.isFetched).toBeTruthy()
        expect(starkNameResult.current.isFetchedAfterMount).toBeTruthy()
        expect(starkNameResult.current.status).toEqual('error')
      },
      {
        timeout: 30000,
        interval: 1000,
      }
    )
  })

  it.skip('get starkname should fail because address does not have a starkname', async () => {
    const { result: starkNameResult } = renderHook(() =>
      useStarkName({ address: otherAccount.address, contract: namingAddress })
    )
    await waitFor(
      () => {
        expect(starkNameResult.current.data).toEqual('stark')
        expect(starkNameResult.current.isLoading).toBeFalsy()
        expect(starkNameResult.current.isSuccess).toBeTruthy()
        expect(starkNameResult.current.isError).toBeFalsy()
        expect(starkNameResult.current.error).toEqual(null)
        expect(starkNameResult.current.isIdle).toBeTruthy()
        expect(starkNameResult.current.isFetching).toBeFalsy()
        expect(starkNameResult.current.isFetched).toBeTruthy()
        expect(starkNameResult.current.isFetchedAfterMount).toBeTruthy()
        expect(starkNameResult.current.status).toEqual('success')
      },
      {
        timeout: 30000,
        interval: 1000,
      }
    )
  })

  it.skip('should get address from starkname from custom naming contract', async () => {
    const { result: addressFromStarkName } = renderHook(() =>
      useAddressFromStarkName({ name: 'ben.stark', contract: namingAddress })
    )
    await waitFor(
      () => {
        expect(addressFromStarkName.current.data).toEqual(account.address)
        expect(addressFromStarkName.current.isLoading).toBeFalsy()
        expect(addressFromStarkName.current.isSuccess).toBeTruthy()
        expect(addressFromStarkName.current.isError).toBeFalsy()
        expect(addressFromStarkName.current.isIdle).toBeTruthy()
        expect(addressFromStarkName.current.isFetching).toBeFalsy()
        expect(addressFromStarkName.current.isFetched).toBeTruthy()
        expect(addressFromStarkName.current.isFetchedAfterMount).toBeTruthy()
        expect(addressFromStarkName.current.isRefetching).toBeFalsy()
        expect(addressFromStarkName.current.status).toEqual('success')
      },
      {
        timeout: 30000,
        interval: 1000,
      }
    )
  })

  it.skip('get address from starkname should fail because contract not deployed', async () => {
    const { result: addressFromStarkName } = renderHook(() =>
      useAddressFromStarkName({ name: 'ben.stark' })
    )
    await waitFor(
      () => {
        expect(addressFromStarkName.current.data).toBeUndefined()
        expect(addressFromStarkName.current.isLoading).toBeFalsy()
        expect(addressFromStarkName.current.isSuccess).toBeFalsy()
        expect(addressFromStarkName.current.isError).toBeTruthy()
        expect(addressFromStarkName.current.error).toBeDefined()
        expect(addressFromStarkName.current.isIdle).toBeTruthy()
        expect(addressFromStarkName.current.isFetching).toBeFalsy()
        expect(addressFromStarkName.current.isFetched).toBeTruthy()
        expect(addressFromStarkName.current.isFetchedAfterMount).toBeTruthy()
        expect(addressFromStarkName.current.status).toEqual('error')
      },
      {
        timeout: 30000,
        interval: 1000,
      }
    )
  })

  it.skip('get address from starkname should return 0x0 because name does not exist', async () => {
    const { result: addressFromStarkName } = renderHook(() =>
      useAddressFromStarkName({ name: 'starknet-react.stark', contract: namingAddress })
    )
    await waitFor(
      () => {
        expect(addressFromStarkName.current.data).toEqual('0x0')
        expect(addressFromStarkName.current.isLoading).toBeFalsy()
        expect(addressFromStarkName.current.isSuccess).toBeTruthy()
        expect(addressFromStarkName.current.isError).toBeFalsy()
        expect(addressFromStarkName.current.error).toEqual(null)
        expect(addressFromStarkName.current.isIdle).toBeTruthy()
        expect(addressFromStarkName.current.isFetching).toBeFalsy()
        expect(addressFromStarkName.current.isFetched).toBeTruthy()
        expect(addressFromStarkName.current.isFetchedAfterMount).toBeTruthy()
        expect(addressFromStarkName.current.status).toEqual('success')
      },
      {
        timeout: 30000,
        interval: 1000,
      }
    )
  })
})
