import { Chain } from "@starknet-react/chains";
import { Explorer, ExplorerFactory } from "./explorer";

// Define the ViewblockExplorer class that extends Explorer
export class ViewblockExplorer implements Explorer {
    private chainParam: string;

    constructor(private chain: Chain) {
        this.chainParam = this.chain.name == "goerli" ? "?network=goerli": ""
    }
  
    block(number: (string | number)): string {
      if (typeof number === 'string' && number.startsWith("0x")) {
        throw new Error("The viewblock explorer doesnt support hashes for blocks. Invalid block number format.");
      }
        return `https://viewblock.io/starknet/block/${number}${this.chainParam}`;
    }
  
    transaction(hash: string): string {
      return `https://viewblock.io/starknet/tx/${hash}${this.chainParam}`;
    }
  
    contract(address: string): string {
      return `https://viewblock.io/starknet/contract/${address}${this.chainParam}`;
    }
  
    class(hash: string): string {

      return `https://viewblock.io/starknet/class/${hash}${this.chainParam}`;
    }
  }
  
  // Define the viewblock factory function
  export const viewblock: ExplorerFactory<ViewblockExplorer> = (chain: Chain) => {
    return new ViewblockExplorer(chain);
  };