import {
  BlockNumber,
  ContractInterface,
  ProviderInterface,
  Result,
  shortString,
  uint256,
} from 'starknet'
import { UseContractReadOptions, UseContractReadResult } from './call'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useInvalidateOnBlock } from './invalidate'
import { useContract, useStarknet } from '..'

/** Arguments for `useBalance`. */
export interface UseBalanceArgs extends UseContractReadOptions {
  /** The contract's address. Defaults to the ETH token. */
  token?: string
  /** The address to fetch balance for. */
  address?: string
  /** Decimals to format the balance. Defaults to the token's decimals */
  formatUnits?: number
}

export interface UseBalanceReadResult extends Omit<UseContractReadResult, 'data'> {
  data?: {
    decimals: number
    formatted: string
    symbol: string
    value: ReturnType<typeof uint256.uint256ToBN>
  }
}

const ETHTokenAddress = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
const balanceABIFragment = [
  {
    members: [
      {
        name: 'low',
        offset: 0,
        type: 'felt',
      },
      {
        name: 'high',
        offset: 1,
        type: 'felt',
      },
    ],
    name: 'Uint256',
    size: 2,
    type: 'struct',
  },
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

/**
 * Hook for fetching balance information for ERC-20 tokens.
 *
 * @remarks
 *
 * The hook only performs a call if the target `address` is defined.
 *
 * @example
 * This example shows how to fetch the user Ethereum token balance.
 * ```tsx
 * function Component() {
 *   const { address } = useAccount()
 *   const { data, isLoading, error, refetch } = useBalance({
 *     address
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   if (error) return <span>Error: {error}</span>
 *
 *   return (
 *     <div>
 *       <button onClick={refetch}>Refetch</button>
 *       <p>Balance: {data.formatted} {data.symbol}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useBalance({
  token = ETHTokenAddress,
  address,
  formatUnits,
  watch = false,
  blockIdentifier = 'pending',
}: UseBalanceArgs): UseBalanceReadResult {
  const { library } = useStarknet()
  const { contract } = useContract({ abi: balanceABIFragment, address: token })

  const queryKey_ = useMemo(
    () => queryKey({ library, args: { contract, address, blockIdentifier } }),
    [library, contract, address, blockIdentifier]
  )

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
    readContract({ args: { contract, address, blockIdentifier } }),
    {
      enabled: !!address,
    }
  )

  useInvalidateOnBlock({ enabled: watch, queryKey: queryKey_ })

  const data = useMemo<UseBalanceReadResult['data']>(() => {
    if (!contractData) {
      return undefined
    }

    const {
      decimals: { decimals: contractDecimals },
      balance: { balance: balanceUint256 },
      symbol: { symbol },
    } = contractData

    const decimals = contractDecimals.toNumber()
    const balanceAsBN = uint256.uint256ToBN(balanceUint256)
    const formatted = (Number(balanceAsBN.toString()) / 10 ** (formatUnits || decimals)).toString()
    const formattedSymbol = shortString.decodeShortString(symbol)

    return {
      decimals,
      formatted,
      symbol: formattedSymbol,
      value: balanceAsBN,
    }
  }, [contractData, formatUnits])

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
  address?: string
  blockIdentifier: BlockNumber
}

type ReadContractResult = {
  balance: Result
  symbol: Result
  decimals: Result
} | null

function readContract({ args }: { args: ReadContractArgs }) {
  return async () => {
    if (!args.address || !args.contract) return null

    try {
      const [balance, symbol, decimals] = await Promise.all([
        args.contract.call('balanceOf', [args.address]),
        args.contract.call('symbol', []),
        args.contract.call('decimals', []),
      ])

      return { balance, symbol, decimals }
    } catch {
      return null
    }
  }
}

function queryKey({ library, args }: { library: ProviderInterface; args: ReadContractArgs }) {
  const { contract, address: callArgs, blockIdentifier } = args
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
