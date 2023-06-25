import { constants } from 'starknet'

/** Information about a Starknet network. */
export type Chain = {
  /** Chain ID. */
  id: string
  /** Human-readable name. */
  name: string
  /** Flag for test networks. */
  testnet?: boolean
}

/** Returns a chain information from its id. */
export function chainById(chainId: constants.StarknetChainId): Chain | undefined {
  return KNOWN_CHAINS[chainId]
}

const KNOWN_CHAINS: Record<constants.StarknetChainId, Chain> = {
  [constants.StarknetChainId.SN_MAIN]: {
    id: constants.StarknetChainId.SN_MAIN,
    name: 'Starknet Mainnet',
    testnet: false,
  },
  [constants.StarknetChainId.SN_GOERLI]: {
    id: constants.StarknetChainId.SN_GOERLI,
    name: 'Starknet Görli',
  },
  [constants.StarknetChainId.SN_GOERLI2]: {
    id: constants.StarknetChainId.SN_GOERLI2,
    name: 'Starknet Görli 2',
  },
}
