import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "../../test/react";

import { useBlock } from "./useBlock";

describe("useBlock", () => {
  it("returns the latest block", async () => {
    const { result } = renderHook(() => useBlock());

    await waitFor(() => {
      expect(result.current.status).toEqual("success");
    });

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

  it("returns an error if the block doesn't exist", async () => {
    const { result } = renderHook(() => useBlock({ blockIdentifier: 999999 }));

    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
    });

    const { data } = result.current;
    expect(data).toBeUndefined();
    expect(result.current).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": [LibraryError: 24: Block not found],
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
