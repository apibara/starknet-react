import { BlockExplorer } from '~/constants/constants'

export type Chain = {
  /** Chain ID */
  id: string
  /** Human-readable name */
  name: string
  /** Currency used by chain */
  /* nativeCurrency?: Unknow yet */
  /** Collection of RPC endpoints */
  /* rpcUrls: No public RPC yet */
  /** Block explorer */
  blockExplorer?: BlockExplorer
  /** Flag for test networks */
  testnet?: boolean
}
