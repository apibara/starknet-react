import { devnet } from "@starknet-react/chains";
import { QueryClient } from "@tanstack/react-query";
import {
  RenderHookOptions,
  RenderOptions,
  render,
  renderHook,
} from "@testing-library/react";
import React from "react";

import { StarknetConfig as OgStarknetConfig } from "../src/context";
import { publicProvider } from "../src/providers";

import { connector, unavailableConnector } from "./devnet";

function StarknetConfig({ children }: { children: React.ReactNode }) {
  const chains = [devnet];
  const providers = [publicProvider()];
  const connectors = [connector, unavailableConnector];
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });

  return (
    <OgStarknetConfig
      chains={chains}
      providers={providers}
      connectors={connectors}
      queryClient={queryClient}
    >
      {children}
    </OgStarknetConfig>
  );
}

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: StarknetConfig, ...options });
}

function customRenderHook<Result, Props>(
  render: (initialProps: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, "wrapper">,
) {
  return renderHook(render, { wrapper: StarknetConfig, ...options });
}

export * from "@testing-library/react";
export { customRender as render, customRenderHook as renderHook };
