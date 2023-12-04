import { Chain } from "@starknet-react/chains";
import { StarkscanExplorer } from "./starkscan";
import { StarkcompassExplorer } from "./starkCompass";
import { ViewblockExplorer } from "./viewblock";

export interface Explorer {
  // link to a block
  block(hashOrNumber: string | number): string;
  // link to a transaction
  transaction(hash: string): string;
  // link to a contract/account
  contract(address: string): string;
  // link to class hash
  class(hash: string): string;
}

export type ExplorerFactory<
  T extends Explorer,
> = (chain: Chain) => T | null;
