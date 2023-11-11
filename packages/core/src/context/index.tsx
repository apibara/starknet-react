import React from "react";

import { StarknetProvider, StarknetProviderProps } from "./starknet";

export { starknetChainId } from "./starknet";
export { AccountProvider as OverrideAccount } from "./account";

export type StarknetConfigProps = StarknetProviderProps;

export function StarknetConfig({ children, ...config }: StarknetConfigProps) {
  return <StarknetProvider {...config}>{children}</StarknetProvider>;
}
