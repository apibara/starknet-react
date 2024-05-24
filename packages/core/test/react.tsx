import { devnet, mainnet } from "@starknet-react/chains";
import { QueryClient } from "@tanstack/react-query";
import {
  RenderHookOptions,
  RenderOptions,
  RenderResult,
  render,
  renderHook,
} from "@testing-library/react";
import React from "react";

import { StarknetConfig as OgStarknetConfig } from "../src/context";
import { jsonRpcProvider } from "../src/providers";

import { defaultConnector } from "./devnet";

function rpc() {
  return {
    nodeUrl: devnet.rpcUrls.public.http[0],
  };
}

function StarknetConfig({ children }: { children: React.ReactNode }) {
  const chains = [devnet, mainnet];
  const provider = jsonRpcProvider({ rpc });
  const connectors = [defaultConnector];

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <OgStarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
      queryClient={queryClient}
    >
      {children}
    </OgStarknetConfig>
  );
}

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult {
  return render(ui, { wrapper: StarknetConfig, ...options });
}

function customRenderHook<RenderResult, Props>(
  render: (initialProps: Props) => RenderResult,
  options: Omit<RenderHookOptions<Props>, "wrapper"> = {}
) {
  const { hydrate, ...rest } = options;
  return renderHook(render, {
    wrapper: StarknetConfig,
    hydrate: hydrate as false | undefined,
    ...rest,
  });
}

export * from "@testing-library/react";
export { customRender as render, customRenderHook as renderHook };
