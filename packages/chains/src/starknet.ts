import { Chain } from "./types";

// Starknet chain ids are generated as follows:
//
// 1. Take the name of the network as string (SN_MAIN, SN_GOERLI, SN_GOERLI2).
// 2. Encode it as Starknet short string.
//
// For example, `encodeShortString('SN_MAIN')` returns `0x535f4d41494e`, which
// is the chain id.

export const mainnet = {
  id: BigInt("0x534e5f4d41494e"),
  network: "mainnet",
  name: "Starknet",
  nativeCurrency: {
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },

  rpcUrls: {
    alchemy: {
      http: ["https://starknet-mainnet.g.alchemy.com/v2"],
    },
    infura: {
      http: ["https://starknet-mainnet.infura.io/v3"],
    },
    lava: {
      http: ["https://g.w.lavanet.xyz:443/gateway/strk/rpc-http"],
    },
    default: {
      http: [],
    },
    public: {
      http: ["https://rpc.starknet.lava.build"],
    },
  },
} as const satisfies Chain;

export const goerli = {
  id: BigInt("0x534e5f474f45524c49"),
  network: "goerli",
  name: "Starknet Testnet",
  nativeCurrency: {
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  testnet: true,
  rpcUrls: {
    alchemy: {
      http: ["https://starknet-goerli.g.alchemy.com/v2"],
    },
    infura: {
      http: ["https://starknet-goerli.infura.io/v3"],
    },
    lava: {
      http: ["https://g.w.lavanet.xyz:443/gateway/strkt/rpc-http"],
    },
    default: {
      http: [],
    },
    public: {
      http: ["https://rpc.starknet-testnet.lava.build"],
    },
  },
} as const satisfies Chain;
