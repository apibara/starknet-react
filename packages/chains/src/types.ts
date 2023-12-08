// These types are taken from `@wagmi/chains`, but since they don't export them
// we have to copy them here.
// All copyright belongs to weth LLC.
//
// Notice that `Chain.id` is a bigint, because Starknet chain ids are outside of
// the number safe range.

export type Address = `0x${string}`;

export type Chain = {
  /** ID in number form */
  id: bigint;

  /** Human-readable name */
  name: string;

  /** Internal network name */
  network: string;

  /** Currency used by the chain */
  nativeCurrency: NativeCurrency;

  /** Collection of RPC endpoints */
  rpcUrls: {
    [key: string]: RpcUrls;
    default: RpcUrls;
    public: RpcUrls;
  };

  /** Flag for testnet networks */
  testnet?: boolean;

  /** Explorer links*/
  explorers?: {
    [key: string]: readonly string[];
  };
};

export type NativeCurrency = {
  /** Token address */
  address: Address;

  /** Human-readable name */
  name: string;

  /** Currency symbol */
  symbol: string;

  /** Number of decimals */
  decimals: number;
};

export type RpcUrls = {
  http: readonly string[];
  websocket?: readonly string[];
};
