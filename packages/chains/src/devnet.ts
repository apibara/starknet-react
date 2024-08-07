import type { Chain } from "./types";

export const devnet = {
  id: BigInt("0x534e5f5345504f4c4941"),
  network: "devnet",
  name: "Starknet Devnet",
  nativeCurrency: {
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
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
      http: ["http://localhost:5050/rpc"],
    },
  },
} as const satisfies Chain;
