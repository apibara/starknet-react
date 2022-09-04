import BN from 'bn.js'
import { Abi } from 'starknet'
import naming_abi from './abi/naming_abi.json'
import { BigNumberish } from 'starknet/utils/number'
import { useStarknetCall, useContract } from '@starknet-react/core'

const basicAlphabet = 'abcdefghijklmnopqrstuvwxyz0123456789-'
const basicSizePlusOne = new BN(basicAlphabet.length + 1)
const bigAlphabet = '这来'
const basicAlphabetSize = new BN(basicAlphabet.length)
const bigAlphabetSize = new BN(bigAlphabet.length)
const bigAlphabetSizePlusOne = new BN(bigAlphabet.length + 1)

function useDecoded(encoded: BN[]): string {
  let decoded = ''
  for (let subdomain of encoded) {
    while (!subdomain.isZero()) {
      const code = subdomain.mod(basicSizePlusOne).toNumber()
      subdomain = subdomain.div(basicSizePlusOne)
      if (code === basicAlphabet.length) {
        const nextSubdomain = subdomain.div(bigAlphabetSizePlusOne)
        if (nextSubdomain.isZero()) {
          let code2 = subdomain.mod(bigAlphabetSizePlusOne).toNumber()
          subdomain = nextSubdomain
          if (code2 === 0) decoded += basicAlphabet[0]
          else decoded += bigAlphabet[code2 - 1]
        } else {
          let code2 = subdomain.mod(bigAlphabetSize).toNumber()
          decoded += bigAlphabet[code2]
          subdomain = subdomain.div(bigAlphabetSize)
        }
      } else decoded += basicAlphabet[code]
    }
    decoded += '.'
  }
  return decoded + 'stark'
}

function useEncoded(decoded: string): BN {
  let encoded = new BN(0)
  let multiplier = new BN(1)

  for (let i = 0; i < decoded.length; i++) {
    const char = decoded[i]
    const index = basicAlphabet.indexOf(char)
    const bnIndex = new BN(basicAlphabet.indexOf(char))

    if (index !== -1) {
      // add encoded + multiplier * index
      if (i === decoded.length - 1 && decoded[i] === basicAlphabet[0]) {
        encoded = encoded.add(multiplier.mul(basicAlphabetSize))
        multiplier = multiplier.mul(basicSizePlusOne)
        // add 0
        multiplier = multiplier.mul(basicSizePlusOne)
      } else {
        encoded = encoded.add(multiplier.mul(bnIndex))
        multiplier = multiplier.mul(basicSizePlusOne)
      }
    } else if (bigAlphabet.indexOf(char) !== -1) {
      // add encoded + multiplier * (basicAlphabetSize)
      encoded = encoded.add(multiplier.mul(basicAlphabetSize))
      multiplier = multiplier.mul(basicSizePlusOne)
      // add encoded + multiplier * index
      let newid = (i === decoded.length - 1 ? 1 : 0) + bigAlphabet.indexOf(char)
      encoded = encoded.add(multiplier.mul(new BN(newid)))
      multiplier = multiplier.mul(bigAlphabetSize)
    }
  }

  return encoded
}

const namingContract: string = '0x05cf267a0af6101667013fc6bd3f6c11116a14cda9b8c4b1198520d59f900b17'

function useNamingContract() {
  return useContract({
    abi: naming_abi as Abi,
    address: namingContract,
  })
}

type DomainData = {
  domain?: string
  error?: string
  refresh?: () => void
  loading: boolean
}

export function useDomainFromAddress(address: BigNumberish): DomainData {
  const { contract } = useNamingContract()
  const { data, error, refresh, loading } = useStarknetCall({
    contract,
    method: 'address_to_domain',
    args: [address],
  })

  if (!data || data?.['domain_len'] === 0) {
    return { domain: '', error: error ? error : 'error', refresh, loading }
  } else {
    let domain = useDecoded(data[0] as any)
    return { domain: domain as any, error, refresh, loading }
  }
}

type AddressData = {
  address?: any
  error?: string
  refresh?: () => void
  loading: boolean
}

export function useAddressFromDomain(domain: string): AddressData {
  const { contract } = useNamingContract()
  const encoded: BN[] = []
  for (const subdomain of domain.split('.')) encoded.push(useEncoded(subdomain))

  const { data, error, refresh, loading } = useStarknetCall({
    contract,
    method: 'domain_to_address',
    args: [encoded],
  })

  return { address: data as any, error, refresh, loading }
}

type TokenIdData = {
  tokenId?: any
  error?: string
  refresh?: () => void
  loading: boolean
}

export function useTokenIdFromDomain(domain: string): TokenIdData {
  const { contract } = useNamingContract()
  const encoded: BN[] = []
  for (const subdomain of domain.split('.')) encoded.push(useEncoded(subdomain))

  const { data, error, refresh, loading } = useStarknetCall({
    contract,
    method: 'domain_to_token_id',
    args: [encoded],
  })

  return { tokenId: data as any, error, refresh, loading }
}

type ExpiryData = {
  expiry?: any
  error?: string
  refresh?: () => void
  loading: boolean
}

export function useExpiryFromDomain(domain: string): ExpiryData {
  const { contract } = useNamingContract()
  const encoded: BN[] = []
  for (const subdomain of domain.split('.')) encoded.push(useEncoded(subdomain))

  const { data, error, loading, refresh } = useStarknetCall({
    contract,
    method: 'domain_to_expiry',
    args: [encoded],
  })

  return { expiry: data as any, error, refresh, loading }
}
