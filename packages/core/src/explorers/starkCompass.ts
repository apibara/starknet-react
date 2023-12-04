import { Chain } from "@starknet-react/chains";
import { Explorer, ExplorerFactory } from "./explorer";

// Define the StarkcompassExplorer class that extends Explorer
export class StarkcompassExplorer implements Explorer {
    private link: string;

    constructor(private chain: Chain) {
        this.link = `https://www.starkcompass.com/${this.chain.name == "testnet" ? "testnet/" : ""}`
    }

    block(hashOrNumber: string | number): string {
        return `${this.link}/blocks/${hashOrNumber}`;
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
export const starkcompass: ExplorerFactory<StarkcompassExplorer> = (chain: Chain) => {
    return new StarkcompassExplorer(chain);
};