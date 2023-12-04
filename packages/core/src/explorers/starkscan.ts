import { Chain } from "@starknet-react/chains";
import { Explorer, ExplorerFactory } from "./explorer";

// Define the StarkscanExplorer class that extends Explorer
export class StarkscanExplorer implements Explorer {
    private link: string;

    constructor(private chain: Chain) {
        this.link = `https://${this.chain.name == "testnet" ? "testnet." : ""}starkscan.co`
    }

    block(hashOrNumber: string | number): string {
        return `${this.link}/block/${hashOrNumber}`;
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