"use client";
import React from "react";

import { goerli, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const chains = [goerli, mainnet];
  const providers = [publicProvider()];
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [
      argent(),
      braavos(),
    ],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random"
  });

  return (
    <StarknetConfig
      chains={chains}
      providers={providers}
      connectors={connectors}
    >
      {children}
    </StarknetConfig>
  );
}
