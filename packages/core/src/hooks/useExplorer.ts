import { useStarknet } from "~/context/starknet";
import { Explorer, StarkcompassExplorer, StarkscanExplorer, ViewblockExplorer, VoyagerExplorer } from "..";

export function useExplorer():Explorer {
    const { explorer, chain } = useStarknet()
    if (!explorer) throw Error("Explorer is undefined. Try adding it to StarknetConfig.")
    let explorerInstance = explorer(chain)
    if (!explorerInstance) throw Error("Explorer is undefined. Try adding it to StarknetConfig.")
    return explorerInstance
}
