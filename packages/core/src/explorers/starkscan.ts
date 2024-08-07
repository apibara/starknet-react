import type { Chain } from "@starknet-react/chains";
import type { Explorer, ExplorerFactory } from "./explorer";

// Define the StarkscanExplorer class that extends Explorer
export class StarkscanExplorer implements Explorer {
  public name = "Starkscan";
  private link: string;

  constructor(chain: Chain) {
    this.link = chain.explorers?.["starkscan"]?.toString() ?? "";
  }

  block(hashOrNumber: { hash?: string; number?: number }): string {
    return `${this.link}/block/${hashOrNumber.hash ?? hashOrNumber.number}`;
  }

  transaction(hash: string): string {
    return `${this.link}/tx/${hash}`;
  }

  contract(address: string): string {
    return `${this.link}/contract/${address}`;
  }

  class(hash: string): string {
    return `${this.link}/class/${hash}`;
  }
}

// Define the starkscan factory function
export const starkscan: ExplorerFactory<StarkscanExplorer> = (chain: Chain) => {
  return new StarkscanExplorer(chain);
};
