import React from "react";

import { StarknetProvider, StarknetProviderProps } from "./starknet";

export type StarknetConfigProps = StarknetProviderProps;

export function StarknetConfig({ children, ...config }: StarknetConfigProps) {
  return <StarknetProvider {...config}>{children}</StarknetProvider>;
}
