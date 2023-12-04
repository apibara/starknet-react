import { Chain } from "@starknet-react/chains";
import { Explorer, ExplorerFactory } from "./explorer";

// Define the VoyagerExplorer class that extends Explorer
export class VoyagerExplorer implements Explorer {
  private link: string;

  constructor(private chain: Chain) {
    this.link = `https://${this.chain.name == "goerli" ? "goerli." : ""}voyager.online`
  }

  block(hash: string): string {
    if (!hash.startsWith("0x")) {
      throw new Error("The voyager explorer doesn't support numbers for blocks. Invalid hash format. Hash must start with '0x'.");
    }
    return `${this.link}/block/${hash}`;
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