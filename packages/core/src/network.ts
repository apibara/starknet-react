import { StarknetChainId } from 'starknet/constants'

export type BlockExplorerName = 'voyager'
export type BlockExplorer = { name: string; url: string }

/** Information about a StarkNet network. */
export type Chain = {
  /** Chain ID. */
  id: string
  /** Human-readable name. */
  name: string
  /** Block explorer. */
  blockExplorer?: BlockExplorer
  /** Flag for test networks. */
  testnet?: boolean
}

/** Returns a chain information from its id. */
export function chainById(chainId: StarknetChainId): Chain | undefined {
  return KNOWN_CHAINS[chainId]
}

const KNOWN_CHAINS: Record<StarknetChainId, Chain> = {
  [StarknetChainId.MAINNET]: {
    id: StarknetChainId.MAINNET,
    name: 'StarkNet Mainnet',
    blockExplorer: {
      name: 'Voyager',
      url: 'https://voyager.online',
    },
    testnet: false,
  },
  [StarknetChainId.TESTNET]: {
    id: StarknetChainId.TESTNET,
    name: 'StarkNet Görli',
    blockExplorer: {
      name: 'Voyager',
      url: 'https://goerli.voyager.online',
    },
  },
}
