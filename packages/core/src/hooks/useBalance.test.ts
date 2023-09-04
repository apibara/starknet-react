import { describe, expect, it } from "vitest";
import { account } from "../../test/devnet";
import { renderHook, waitFor } from "../../test/react";

import { useBalance } from "./useBalance";

describe("useBalance", () => {
  describe("when address is undefined", () => {
    it("returns no balance", async () => {
      const { result } = renderHook(() => useBalance({}));

      expect(result.current).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": null,
          "isError": false,
          "isIdle": false,
          "isLoading": true,
          "isSuccess": false,
          "refetch": [Function],
          "status": "loading",
        }
      `);
    });
  });

  describe("when address is defined", () => {
    // Some issue with the RPC provider.
    it.skip("returns the balance", async () => {
      const { result } = renderHook(() =>
        useBalance({ address: account.address }),
      );

      await waitFor(() => {
        expect(result.current.status).not.toEqual("loading");
      });

      expect(result.current).toMatchInlineSnapshot(`
      `);
    });
  });
});
