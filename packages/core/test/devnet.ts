import { devnet } from "@starknet-react/chains";
import { AccountInterface } from "starknet";
import { Account, RpcProvider } from "starknet";
import { MockConnector } from "../src/connectors";

const provider = new RpcProvider({ nodeUrl: devnet.rpcUrls.public.http[0] });

export const tokenAddress =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

const devnetAccounts = [
  {
    address: "0x5deccd84c24333d10f4ad34ff2b2dd891b9842cb05a86a401ef39de4974183",
    privateKey: "0x5610de175f2eaf556b7d7808599f871c",
  },
  {
    address:
      "0x79d719ac68e56635121bf9317fae4f281e23b7ad95b6900ccafd2b9668b410f",
    privateKey: "0xa2866149d7a34fba053b2c8682d98d55",
  },
  {
    address:
      "0x61d688465fb5a35ab6c90ab552ece2557506d94c593f3c672b42b528bce4d76",
    privateKey: "0xa86b50d6970c5d1b978275a2ebcd8641",
  },
  {
    address:
      "0x573cb89bba93cf64b21ff62bb021dc25361c2288db93390fca2b531f5bd2011",
    privateKey: "0xb104a2c90e395ba3ad9f168588405c4d",
  },
  {
    address:
      "0x4aa8370514e442bcb9463b35d13320fed700c429cd883e9aa8a5f757033cfb5",
    privateKey: "0x51993b0c6aace18708226d8e50247d82",
  },
];

function makeAccount({ address, privateKey }): AccountInterface {
  return new Account(provider, address, privateKey);
}

export const accounts = {
  goerli: [makeAccount(devnetAccounts[1]), makeAccount(devnetAccounts[3])],
  mainnet: [makeAccount(devnetAccounts[0]), makeAccount(devnetAccounts[2])],
};

export const defaultConnector = new MockConnector({
  accounts,
  options: {
    id: "mock",
    name: "Mock Connector",
    icon: {},
  },
});
