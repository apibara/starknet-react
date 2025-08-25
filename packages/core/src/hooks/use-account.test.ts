import { describe, expect, it } from "vitest";
import { defaultConnector } from "../../test/devnet";
import { act, renderHook } from "../../test/react";

import { useAccount } from "./use-account";
import { useConnect } from "./use-connect";
import { useDisconnect } from "./use-disconnect";

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
          "account": undefined,
          "address": undefined,
          "chainId": undefined,
          "connector": undefined,
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
          "account": undefined,
          "address": undefined,
          "chainId": undefined,
          "connector": undefined,
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
            "address": "0x078662e7352d062084b0010068b99288486c2d8b914f6e2a55ce945f8792c8b1",
            "cairoVersion": undefined,
            "channel": RpcChannel2 {
              "baseFetch": [Function],
              "batchClient": undefined,
              "blockIdentifier": "latest",
              "chainId": undefined,
              "channelSpecVersion": "0.9.0",
              "headers": {
                "Content-Type": "application/json",
              },
              "id": "RPC090",
              "nodeUrl": "http://localhost:5050/rpc",
              "requestId": 0,
              "retries": 200,
              "specVersion": undefined,
              "transactionRetryIntervalFallback": undefined,
              "waitMode": false,
            },
            "defaultTipType": "recommendedTip",
            "deploySelf": [Function],
            "deployer": Deployer {
              "address": "0x02ceed65a4bd731034c01113685c831b01c15d7d432f71afb1cf1634b53a2125",
              "entryPoint": "deploy_contract",
            },
            "getStateUpdate": [Function],
            "paymaster": _PaymasterRpc {
              "baseFetch": [Function],
              "headers": {
                "Content-Type": "application/json",
              },
              "nodeUrl": "https://sepolia.paymaster.avnu.fi",
              "requestId": 0,
            },
            "responseParser": RPCResponseParser {
              "resourceBoundsOverhead": undefined,
            },
            "signer": Signer {
              "pk": "0xe1406455b7d66b1690803be066cbe5e",
            },
            "transactionVersion": "0x3",
          },
          "address": "0x078662e7352d062084b0010068b99288486c2d8b914f6e2a55ce945f8792c8b1",
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
