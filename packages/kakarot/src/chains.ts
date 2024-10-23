import {
  type Chain as StarknetChain,
  mainnet,
  sepolia,
} from "@starknet-react/chains";
import { type Chain as KakarotChain, defineChain } from "viem";

type ChainConfig = {
  kakarotChain: KakarotChain;
  starknetChain: StarknetChain;
  kakarotDeployment: string;
};

export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  [Number(sepolia.id)]: {
    kakarotChain: /*#__PURE__*/ defineChain({
      id: 920637907288165,
      name: "Kakarot Sepolia",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["https://sepolia-rpc.kakarot.org"],
        },
      },
      blockExplorers: {
        default: {
          name: "Kakarot Scan",
          url: "https://sepolia.kakarotscan.org",
        },
      },
      testnet: true,
    }),
    starknetChain: sepolia,
    kakarotDeployment:
      "0x1d2e513630d8120666fc6e7d52ad0c01479fd99c183baac79fff9135f46e359",
  },
};

export const kakarotSepolia = CHAIN_CONFIGS[Number(sepolia.id)].kakarotChain;
export const DEFAULT_CHAIN = CHAIN_CONFIGS[Number(sepolia.id)];

export const KAKAROT_DEPLOYMENTS: Record<number, string> = Object.fromEntries(
  Object.values(CHAIN_CONFIGS).map((config) => [
    Number(config.starknetChain.id),
    config.kakarotDeployment,
  ]),
);

export const getCorrespondingStarknetChain = (
  chainId: number,
): StarknetChain | undefined => {
  return Object.values(CHAIN_CONFIGS).find(
    (config) => config.kakarotChain.id === chainId,
  )?.starknetChain;
};

export const getCorrespondingKakarotChain = (
  starknetChainId: number,
): KakarotChain | undefined => {
  return Object.values(CHAIN_CONFIGS).find(
    (config) => Number(config.starknetChain.id) === starknetChainId,
  )?.kakarotChain;
};
