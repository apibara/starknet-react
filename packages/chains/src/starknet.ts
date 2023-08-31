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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },

  rpcUrls: {
    default: {
      http: [],
    },
    public: {
      http: [],
    },
  },
} as const satisfies Chain;

export const goerli = {
  id: BigInt("0x534e5f474f45524c49"),
  network: "goerli",
  name: "Starknet Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  testnet: true,
  rpcUrls: {
    default: {
      http: [],
    },
    public: {
      http: [],
    },
  },
} as const satisfies Chain;

export const goerli2 = {
  id: BigInt("0x534e5f474f45524c4932"),
  network: "goerli2",
  name: "Starknet Testnet 2",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  testnet: true,
  rpcUrls: {
    default: {
      http: [],
    },
    public: {
      http: [],
    },
  },
} as const satisfies Chain;
