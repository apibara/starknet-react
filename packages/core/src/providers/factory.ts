import type { Chain } from "@starknet-react/chains";
import type { ProviderInterface } from "starknet";

export type ChainProviderFactory<
  T extends ProviderInterface = ProviderInterface,
> = (chain: Chain) => T | null;
