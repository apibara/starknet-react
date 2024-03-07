import { describe, expectTypeOf, it } from "vitest";
import { ProviderInterface } from "starknet";

import { useProvider } from "./useProvider";

describe("useProvider", () => {
  describe("with default", () => {
    it("returns a ProviderInterface", () => {
      const result = useProvider();
      expectTypeOf(result.provider).toEqualTypeOf<ProviderInterface>();
    });
  });

  describe("with chainId", () => {
    it("returns a nullable provider", () => {
      const result = useProvider({ chainId: 123n });
      expectTypeOf(result.provider).toEqualTypeOf<
        ProviderInterface | undefined
      >();
    });
  });
});
