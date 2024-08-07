import type { Chain } from "@starknet-react/chains";
import type { Explorer, ExplorerFactory } from "./explorer";

// Define the VoyagerExplorer class that extends Explorer
export class VoyagerExplorer implements Explorer {
  public name = "Voyager";
  private link: string;

  constructor(chain: Chain) {
    this.link = chain.explorers?.["voyager"]?.toString() ?? "";
  }

  block(hashOrNumber: { hash?: string; number?: number }): string {
    if (hashOrNumber.number !== undefined && hashOrNumber.hash === undefined) {
      throw new Error(
        "The voyager explorer doesn't support numbers for blocks. Please provide a hash.",
      );
    }
    return `${this.link}/block/${hashOrNumber.hash}`;
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

// Define the voyager factory function
export const voyager: ExplorerFactory<VoyagerExplorer> = (chain: Chain) => {
  return new VoyagerExplorer(chain);
};
