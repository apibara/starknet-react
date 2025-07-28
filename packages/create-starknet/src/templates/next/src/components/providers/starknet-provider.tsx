"use client";

import type { ReactNode } from "react";

import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  braavos,
  publicProvider,
  ready,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: ReactNode }) {
  const chains = [sepolia, mainnet];

  const provider = publicProvider();

  const { connectors } = useInjectedConnectors({
    recommended: [ready(), braavos()],
    includeRecommended: "always",
    order: "alphabetical",
  });

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
