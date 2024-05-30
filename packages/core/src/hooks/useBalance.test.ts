import { describe, expect, it } from "vitest";
import { accounts } from "../../test/devnet";
import { renderHook, waitFor } from "../../test/react";

import { useBalance } from "./useBalance";

describe("useBalance", () => {
  describe("when address is undefined", () => {
    it.skip("returns no balance", async () => {
      const { result } = renderHook(() => useBalance({}));

      await waitFor(() => {
        expect(result.current.status).toEqual("error");
      });

      expect(result.current).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": [Error: address is required],
          "fetchStatus": "idle",
          "isError": true,
          "isFetching": false,
          "isLoading": false,
          "isPending": false,
          "isSuccess": false,
          "refetch": [Function],
          "status": "error",
        }
      `);
    });
  });

  describe("when address is defined", () => {
    it.skip("returns the balance", async () => {
      const { result } = renderHook(() =>
        useBalance({
          address: accounts.sepolia[0].address,
        })
      );

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });
    });
  });
});
