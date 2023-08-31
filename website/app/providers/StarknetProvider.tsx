"use client";

import { StarknetConfig } from "@starknet-react/core";
import { ReactNode } from "react";

interface StarknetProviderProps {
  children: ReactNode;
}

const StarknetProvider = ({ children }: StarknetProviderProps) => {
  return <StarknetConfig>{children}</StarknetConfig>;
};

export default StarknetProvider;
