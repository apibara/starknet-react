"use client";
import React from "react";

import { goerli } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
} from "@starknet-react/core";
import { useMemo } from "react";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const chains = [goerli];

  const providers = [publicProvider()];

  const connectors = useMemo(() => shuffle([argent(), braavos()]), []);

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

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // @ts-ignore: not important
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
