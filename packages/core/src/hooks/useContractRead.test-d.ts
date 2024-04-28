import { tokenAddress } from "./../../test/devnet";
import { test_abi } from "../../test/test-abi";
import { assertType, describe, it } from "vitest";
import { UseContractReadProps, useContractRead } from "./useContractRead";
import { FunctionRet } from "abi-wan-kanabi/dist/kanabi";

type TAbi = typeof test_abi;

const common_props = {
  abi: test_abi,
  address: tokenAddress,
} as const;

describe("Types test for useContractRead.ts", () => {
  it("correct function name for given abi", () => {
    const props = {
      ...common_props,
      functionName: "fn_felt",
      args: 1234,
    } as const;
    assertType<UseContractReadProps<TAbi, "fn_felt">>(props);
  });

  it("wrong function name for given abi", () => {
    const props = {
      ...common_props,
      functionName: "some_random_function",
      args: 1234,
    } as const;

    // @ts-expect-error
    assertType<UseContractReadProps<TAbi, "fn_felt">>(props);
  });

  it("correct arguments of function for given abi", () => {
    const props = {
      ...common_props,
      functionName: "fn_felt",
      args: "some_bignumberish_value",
    } as const;

    assertType<UseContractReadProps<TAbi, "fn_felt">>(props);
  });

  it("wrong arguments of function for given abi", () => {
    const props = {
      ...common_props,
      functionName: "fn_felt",
      args: false,
    } as const;

    // @ts-expect-error
    assertType<UseContractReadProps<TAbi, "fn_felt">>(props);
  });

  it("correct data with correct arguments & function for given abi", () => {
    const props = {
      ...common_props,
      functionName: "fn_felt",
      args: "some_bignumberish_value",
    } as const;

    const { data } = useContractRead(props);
    assertType<FunctionRet<TAbi, "fn_felt">>(data);
  });
});
