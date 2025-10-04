import type { Chain } from "../types";
import type { ProviderInterface } from "starknet";

export type ChainProviderFactory<
  T extends ProviderInterface = ProviderInterface,
> = (chain: Chain) => T | null;
