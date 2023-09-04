import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "../../test/react";

import { useBlockNumber } from "./useBlockNumber";

describe("useBlockNumber", () => {
  it("returns the current block number", async () => {
    const { result } = renderHook(() => useBlockNumber());

    await waitFor(() => {
      expect(result.current.status).not.toEqual("loading");
    });

    const { data, ...rest } = result.current;
    expect(data).toBeDefined();
    expect(rest).toMatchInlineSnapshot(`
      {
        "error": null,
        "isError": false,
        "isIdle": false,
        "isLoading": false,
        "isSuccess": true,
        "refetch": [Function],
        "status": "success",
      }
    `);
  });
});
