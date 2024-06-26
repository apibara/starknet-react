import { describe, expect, it } from "vitest";
import { accounts } from "../../test/devnet";
import { renderHook, waitFor } from "../../test/react";

import { useBalance } from "./useBalance";

describe("useBalance", () => {
  describe("when address is undefined", () => {
    it("returns no balance", async () => {
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
    // Some issue with the RPC provider.
    it.skip("returns the balance", async () => {
      const { result } = renderHook(() =>
        useBalance({ address: accounts.goerli[0].address })
      );

      await waitFor(() => {
        expect(result.current.status).toEqual("success");
      });

      expect(result.current).toMatchInlineSnapshot(`
      `);
    });
  });
});
