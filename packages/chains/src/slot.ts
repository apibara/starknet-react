import type { Chain } from "./types";

export function getSlotChain(projectId: string) {
  return {
    id: BigInt(projectId),
    network: `slot-${projectId}`,
    name: `${projectId}`,
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
        http: [`https://api.cartridge.gg/x/${projectId}/katana`],
      },
    },
  } as const satisfies Chain;
}
