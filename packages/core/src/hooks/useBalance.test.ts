import { describe, expect, it } from "vitest";
import { accounts } from "../../test/devnet";
import { act, renderHook, waitFor } from "../../test/react";

import { useBalance } from "./useBalance";
import { sepolia } from "@starknet-react/chains";

describe("useBalance", () => {
  describe("when address is undefined", () => {
    it.skip("returns no balance", async () => {
      const { result } = renderHook(() => useBalance({}));

      await waitFor(() => {
        expect(result.current.status).toEqual("pending");
      });

      expect(result.current).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetching": false,
          "isLoading": false,
          "isPending": true,
          "isSuccess": false,
          "refetch": [Function],
          "status": "pending",
        }
      `);
    });
  });

  describe("when address is defined", () => {
    it("returns the balance", async () => {
      const { result } = renderHook(() =>
        useBalance({
          address: accounts.sepolia[0].address,
        })
      );

      await waitFor(() => {
        const { data, ...rest } = result.current;
        expect(data).toBeDefined();
        expect(rest).toMatchInlineSnapshot(`
          {
            "error": null,
            "fetchStatus": "idle",
            "isError": false,
            "isFetching": false,
            "isLoading": false,
            "isPending": false,
            "isSuccess": true,
            "refetch": [Function],
            "status": "success",
          }
        `);
      });
    });
  });
});
