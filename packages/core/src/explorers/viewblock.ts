import { goerli, type Chain } from "@starknet-react/chains";
import { Explorer, ExplorerFactory } from "./explorer";

// Define the ViewblockExplorer class that extends Explorer
export class ViewblockExplorer implements Explorer {
  public name = "Viewblock";
  private chainParam: string;
  private link: string;

  constructor(chain: Chain) {
    this.link = chain.explorers?.["viewblock"]?.toString() ?? "";
    this.chainParam = chain.id === goerli.id ? "?network=goerli" : "";
  }

  block(hashOrNumber: { hash?: string; number?: number }): string {
    if (hashOrNumber.hash && hashOrNumber.number === undefined) {
      throw new Error(
        `The viewblock explorer doesnt support hashes for blocks. Please provide a hash.`,
      );
    }
    return `${this.link}/block/${hashOrNumber.number}${this.chainParam}`;
  }

  transaction(hash: string): string {
    return `${this.link}/tx/${hash}${this.chainParam}`;
  }

  contract(address: string): string {
    return `${this.link}/contract/${address}${this.chainParam}`;
  }

  class(hash: string): string {
    return `${this.link}/class/${hash}${this.chainParam}`;
  }
}

// Define the viewblock factory function
export const viewblock: ExplorerFactory<ViewblockExplorer> = (chain: Chain) => {
  return new ViewblockExplorer(chain);
};
