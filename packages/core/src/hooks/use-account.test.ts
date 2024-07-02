import { describe, expect, it } from "vitest";
import { defaultConnector } from "../../test/devnet";
import { act, renderHook } from "../../test/react";

import { useAccount } from "./use-account";
import { useConnect } from "./use-connect";
import { useDisconnect } from "./useDisconnect";

function useAccountWithConnect() {
  return {
    account: useAccount(),
    connect: useConnect(),
    disconnect: useDisconnect(),
  };
}

describe("useAccount", () => {
  describe("returns no account", () => {
    it("on mount", async () => {
      const { result } = renderHook(() => useAccountWithConnect());

      expect(result.current.account).toMatchInlineSnapshot(`
        {
          "isConnected": false,
          "isConnecting": false,
          "isDisconnected": true,
          "isReconnecting": false,
          "status": "disconnected",
        }
      `);
    });

    it("after the user disconnects their wallet", async () => {
      const { result } = renderHook(() => useAccountWithConnect());

      await act(async () => {
        await result.current.connect.connectAsync({
          connector: defaultConnector,
        });
      });

      expect(result.current.account.isConnected).toBeTruthy();

      await act(async () => {
        await result.current.disconnect.disconnectAsync();
      });

      expect(result.current.account).toMatchInlineSnapshot(`
        {
          "isConnected": false,
          "isConnecting": false,
          "isDisconnected": true,
          "isReconnecting": false,
          "status": "disconnected",
        }
      `);
    });
  });

  describe("returns the account", () => {
    it("after the user connects their wallet", async () => {
      const { result } = renderHook(() => useAccountWithConnect());

      await act(async () => {
        result.current.connect.connect({ connector: defaultConnector });
      });

      // skip serializing mock connector
      expect({
        ...result.current.account,
        connector: undefined,
      }).toMatchInlineSnapshot(`
        {
          "account": Account {
            "address": "0x78662e7352d062084b0010068b99288486c2d8b914f6e2a55ce945f8792c8b1",
            "cairoVersion": undefined,
            "channel": RpcChannel2 {
              "blockIdentifier": "pending",
              "chainId": undefined,
              "headers": {
                "Content-Type": "application/json",
              },
              "nodeUrl": "http://localhost:5050/rpc",
              "requestId": 0,
              "retries": 200,
              "specVersion": undefined,
              "transactionRetryIntervalFallback": undefined,
              "waitMode": false,
            },
            "deploySelf": [Function],
            "getStateUpdate": [Function],
            "responseParser": RPCResponseParser {
              "margin": undefined,
            },
            "signer": Signer {
              "pk": "0xe1406455b7d66b1690803be066cbe5e",
            },
            "transactionVersion": "0x2",
          },
          "address": "0x78662e7352d062084b0010068b99288486c2d8b914f6e2a55ce945f8792c8b1",
          "chainId": 393402133025997798000961n,
          "connector": undefined,
          "isConnected": true,
          "isConnecting": false,
          "isDisconnected": false,
          "isReconnecting": false,
          "status": "connected",
        }
      `);
    });
  });
});
