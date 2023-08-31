import { useStarknet } from "~/providers";
import { connectors, deventAccounts } from "../../test/devnet";
import { renderHook, waitFor } from "../../test/react";

describe("StarknetProvider", () => {
  it("accepts a list of connectors", async () => {
    const { result } = renderHook(() => useStarknet(), { connectors });

    expect(result.current.connectors).toHaveLength(3);
  });

  it("connects to the specified connector", async () => {
    const { result } = renderHook(() => useStarknet(), { connectors });

    expect(result.current.account).toBeUndefined();

    result.current.connect(result.current.connectors[1]);

    await waitFor(() => {
      expect(result.current.account).toEqual(deventAccounts[1].address);
    });
  });
});
