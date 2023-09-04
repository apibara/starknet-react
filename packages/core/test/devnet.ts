import { devnet } from "@starknet-react/chains";
import { Mock } from "moq.ts";
import { Account, RpcProvider } from "starknet";
import { Connector } from "../src/connectors";

const provider = new RpcProvider({ nodeUrl: devnet.rpcUrls.public.http[0] });

export const tokenAddress =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

export const address =
  "0x6b0a93aafd6a3d06ecd80eb4d7d6708cef12f94607b8d7feb25f8aa33d0da63";
export const account = new Account(
  provider,
  address,
  "0x395d7c753f20cd410168df2b36f13613",
);

export const connector = new Mock<Connector>()
  .setup((conn) => conn.connect())
  .returnsAsync(account)
  .setup((conn) => conn.disconnect())
  .returns(Promise.resolve())
  .setup((conn) => conn.available())
  .returns(true)
  .setup((conn) => conn.account())
  .returnsAsync(account)
  .setup((conn) => conn.on("change", (_state) => undefined))
  .returns({} as Connector)
  .setup((conn) => conn.off("change", (state) => undefined))
  .returns({} as Connector)
  .object();

export const unavailableConnector = new Mock<Connector>()
  .setup((conn) => conn.available())
  .returns(false)
  .object();
