import { Chain } from "@starknet-react/chains";
import { ProviderInterface } from "starknet";

export type ChainProviderFactory = (chain: Chain) => ProviderInterface | null;
