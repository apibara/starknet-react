import { describe, expect, it } from "vitest";
import { defaultConnector } from "../../test/devnet";
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
            "address": "0x79d719ac68e56635121bf9317fae4f281e23b7ad95b6900ccafd2b9668b410f",
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
              "pk": "0xa2866149d7a34fba053b2c8682d98d55",
            },
          },
          "address": "0x79d719ac68e56635121bf9317fae4f281e23b7ad95b6900ccafd2b9668b410f",
          "chainId": 1536727068981429685321n,
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
