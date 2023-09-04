import { describe, expect, it } from "vitest";
import { connector } from "../../test/devnet";
import { act, renderHook } from "../../test/react";

import { useAccount } from "./useAccount";
import { useConnect } from "./useConnect";
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
        result.current.connect.connect({ connector });
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
        result.current.connect.connect({ connector });
      });

      expect(result.current.account).toMatchInlineSnapshot(`
        {
          "account": Account {
            "address": "0x6b0a93aafd6a3d06ecd80eb4d7d6708cef12f94607b8d7feb25f8aa33d0da63",
            "cairoVersion": "0",
            "deploySelf": [Function],
            "provider": RpcProvider {
              "blockIdentifier": "pending",
              "chainId": "0x534e5f474f45524c49",
              "headers": {
                "Content-Type": "application/json",
              },
              "nodeUrl": "http://localhost:5050/rpc",
              "responseParser": RPCResponseParser {},
              "retries": 200,
            },
            "signer": Signer {
              "pk": "0x395d7c753f20cd410168df2b36f13613",
            },
          },
          "address": "0x6b0a93aafd6a3d06ecd80eb4d7d6708cef12f94607b8d7feb25f8aa33d0da63",
          "connector": [Function],
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
