import { devnet, goerli, mainnet } from "@starknet-react/chains";
import { MockContext, describe, expect, it } from "vitest";
import { accounts, defaultConnector } from "../../test/devnet";
import { act, renderHook } from "../../test/react";
import { MockConnector } from "../connectors";

import { useStarknet } from "./starknet";

describe("StarknetProvider", () => {
  it("defaults to the first chain", async () => {
    const { result } = renderHook(() => useStarknet());

    expect(result.current.chain.name).toEqual("Starknet Devnet");
    expect(await result.current.provider.getChainId()).toEqual(
      `0x${devnet.id.toString(16)}`,
    );
  });

  it("connects to a connector", async () => {
    const { result } = renderHook(() => useStarknet());

    expect(result.current.connector).toBeUndefined();

    await act(async () => {
      defaultConnector.switchChain(devnet.id);
      await result.current.connect({ connector: defaultConnector });
    });

    expect(result.current.connector).toBeDefined();
  });

  it("updates the account when it changes", async () => {
    const { result } = renderHook(() => useStarknet());

    expect(result.current.connector).toBeUndefined();

    await act(async () => {
      defaultConnector.switchChain(devnet.id);
      await result.current.connect({ connector: defaultConnector });
    });

    const account = await result.current.connector.account();
    expect(account.address).toEqual(accounts.goerli[0].address);

    await act(async () => {
      (result.current.connector as MockConnector).switchAccount(1);
    });

    const account2 = await result.current.connector.account();
    expect(account2.address).toEqual(accounts.goerli[1].address);
  });

  it("updates the chain and account when the chain changes", async () => {
    const { result } = renderHook(() => useStarknet());

    expect(result.current.connector).toBeUndefined();

    await act(async () => {
      defaultConnector.switchChain(devnet.id);
      await result.current.connect({ connector: defaultConnector });
    });

    const account = await result.current.connector.account();
    expect(account.address).toEqual(accounts.goerli[0].address);
    expect(await result.current.connector.chainId()).toEqual(goerli.id);
    expect(result.current.chain.id).toEqual(goerli.id);

    await act(async () => {
      (result.current.connector as MockConnector).switchChain(mainnet.id);
    });

    const account2 = await result.current.connector.account();
    expect(account2.address).toEqual(accounts.mainnet[0].address);
    expect(await result.current.connector.chainId()).toEqual(mainnet.id);
    expect(result.current.chain.id).toEqual(mainnet.id);
  });
});
