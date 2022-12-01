import { constants } from 'starknet'

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
export function chainById(chainId: constants.StarknetChainId): Chain | undefined {
  return KNOWN_CHAINS[chainId]
}

const KNOWN_CHAINS: Record<constants.StarknetChainId, Chain> = {
  [constants.StarknetChainId.MAINNET]: {
    id: constants.StarknetChainId.MAINNET,
    name: 'StarkNet Mainnet',
    blockExplorer: {
      name: 'Voyager',
      url: 'https://voyager.online',
    },
    testnet: false,
  },
  [constants.StarknetChainId.TESTNET]: {
    id: constants.StarknetChainId.TESTNET,
    name: 'StarkNet Görli',
    blockExplorer: {
      name: 'Voyager',
      url: 'https://goerli.voyager.online',
    },
  },
  [constants.StarknetChainId.TESTNET2]: {
    id: constants.StarknetChainId.TESTNET2,
    name: 'StarkNet Görli 2',
    blockExplorer: {
      name: 'Voyager',
      url: 'https://goerli-2.voyager.online',
    },
  },
}
