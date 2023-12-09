import { Chain } from "@starknet-react/chains";
import { Explorer, ExplorerFactory } from "./explorer";

// Define the StarkCompassExplorer class that extends Explorer
export class StarkCompassExplorer implements Explorer {
  public name = "Stark Compass";
  private link: string;

  constructor(chain: Chain) {
    this.link = chain.explorers?.["starkCompass"]?.toString() ?? "";
  }

  block(hashOrNumber: { hash?: string; number?: number }): string {
    return `${this.link}/blocks/${hashOrNumber.hash ?? hashOrNumber.number}`;
  }

  transaction(hash: string): string {
    return `${this.link}/transactions/${hash}`;
  }

  contract(address: string): string {
    return `${this.link}/contracts/${address}`;
  }

  class(hash: string): string {
    return `${this.link}/classes/${hash}`;
  }
}

// Define the starkcompass factory function
export const starkcompass: ExplorerFactory<StarkCompassExplorer> = (
  chain: Chain,
) => {
  return new StarkCompassExplorer(chain);
};
