import {
  BlockNumber,
  ContractInterface,
  ProviderInterface,
  Result,
  shortString,
  uint256,
} from 'starknet'
import { UseContractReadOptions, UseContractReadResult } from './call'
import { useContract, useStarknet } from '..'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useInvalidateOnBlock } from './invalidate'

/** Arguments for `useBalance`. */
export interface UseBalanceArgs extends UseContractReadOptions {
  /** The target contract's address. */
  token?: string
  /** The target address. */
  address?: string
  /** Decimals. */
  decimals?: number
}

export interface UseBalanceReadResult extends Omit<UseContractReadResult, 'data'> {
  data?: {
    decimals: number
    formatted: string
    symbol: string
    value: bigint
  }
}

const ETH_TOKEN_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
const BALANCE_ABI_FRAGMENT = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [
      {
        name: 'account',
        type: 'felt',
      },
    ],
    outputs: [
      {
        name: 'balance',
        type: 'Uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: 'symbol',
        type: 'felt',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: 'decimals',
        type: 'felt',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export function useBalance({
  token = ETH_TOKEN_ADDRESS,
  address,
  decimals,
  watch = false,
  blockIdentifier = 'pending',
}: UseBalanceArgs): UseBalanceReadResult {
  const { library } = useStarknet()
  const { contract } = useContract({ abi: BALANCE_ABI_FRAGMENT, address: token })

  const queryKey_ = useMemo(
    () => queryKey({ library, args: { contract, args: [address], blockIdentifier } }),
    [library, contract, address, blockIdentifier]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    data: contractData,
    error,
    isStale: isIdle,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  } = useQuery<ReadContractResult | undefined>(
    queryKey_,
    readContract({ args: { contract, args: [address], blockIdentifier } }),
    {
      enabled: !!address,
    }
  )

  useInvalidateOnBlock({ enabled: watch, queryKey: queryKey_ })

  const data = useMemo<UseBalanceReadResult['data']>(() => {
    if (!contractData) {
      return undefined
    }

    const contractDecimals = Number(BigInt(contractData.decimals.decimals).toString())
    const balance = Number(BigInt(contractData.balance.balance).toString())
    const formatted = (balance / 10 ** (decimals || contractDecimals)).toString()
    const formattedSymbol = shortString.decodeShortString(contractData.symbol.symbol)

    return {
      decimals: decimals || contractDecimals,
      formatted,
      symbol: formattedSymbol,
      value: contractData.balance.balance,
    }
  }, [contractData, decimals])

  return {
    data,
    error: error ?? undefined,
    isIdle,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    refetch,
    status,
  }
}

interface ReadContractArgs {
  contract?: ContractInterface
  args?: unknown[]
  blockIdentifier: BlockNumber
}

type ReadContractResult = {
  balance: Result
  symbol: Result
  decimals: Result
} | null

function readContract({ args }: { args: ReadContractArgs }) {
  return async () => {
    if (!args.args || !args.contract) return null

    const [balance, symbol, decimals] = await Promise.all([
      args.contract.call('balanceOf', args.args),
      args.contract.call('symbol', []),
      args.contract.call('decimals', []),
    ])

    return { balance, symbol, decimals }
  }
}

function queryKey({ library, args }: { library: ProviderInterface; args: ReadContractArgs }) {
  const { contract, args: callArgs, blockIdentifier } = args
  return [
    {
      entity: 'balance',
      chainId: library.chainId,
      contract: contract?.address,
      args: callArgs,
      blockIdentifier,
    },
  ] as const
}
