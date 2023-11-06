import { Chain } from "@starknet-react/chains";
import { ProviderInterface } from "starknet";

export type ChainProviderFactory<
  T extends ProviderInterface = ProviderInterface,
> = (chain: Chain) => T | null;
