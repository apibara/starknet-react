import { goerli, mainnet, sepolia } from "@starknet-react/chains";
import { constants } from "starknet";

/**
 * Converts a numerical chain id to a Starknet.js chain id.
 *
 * @param chainId The chain id.
 * @returns a Starknet.js chain id or undefined if the chain id is not a well-known chain.
 */
export function starknetChainId(
  chainId: bigint,
): constants.StarknetChainId | undefined {
  switch (chainId) {
    case mainnet.id:
      return constants.StarknetChainId.SN_MAIN;
    case goerli.id:
      return constants.StarknetChainId.SN_GOERLI;
    case sepolia.id:
      return constants.StarknetChainId.SN_SEPOLIA;
    default:
      return undefined;
  }
}
