import { mainnet, sepolia } from "./starknet";

const SN_MAIN = "0x534e5f4d41494e" as const;
const SN_SEPOLIA = "0x534e5f5345504f4c4941" as const;

export type StarknetChainId = typeof SN_MAIN | typeof SN_SEPOLIA;

export function starknetChainId(chainId: bigint): StarknetChainId | undefined {
  switch (chainId) {
    case mainnet.id:
      return SN_MAIN;
    case sepolia.id:
      return SN_SEPOLIA;
    default:
      return undefined;
  }
}
