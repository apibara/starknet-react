import { useStarknet } from "../context/starknet";
import type { Explorer } from "../explorers";

/** Access the current explorer, should be inside a StarknetConfig. */
export function useExplorer(): Explorer {
  const { explorer, chain } = useStarknet();
  if (!explorer)
    throw Error("Explorer is undefined. Try adding it to StarknetConfig.");
  const explorerInstance = explorer(chain);
  if (!explorerInstance) throw Error("Explorer Instance is undefined");
  return explorerInstance;
}
