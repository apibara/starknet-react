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

import { MockConnectorOptions } from "../src";
import { defaultConnector } from "./devnet";

function rpc() {
  return {
    nodeUrl: devnet.rpcUrls.public.http[0],
  };
}

function StarknetConfig({
  children,
  connectorOptions,
}: {
  children: React.ReactNode;
  connectorOptions?: Partial<MockConnectorOptions>;
}) {
  const chains = [devnet, mainnet];
  const provider = jsonRpcProvider({ rpc });
  const connectors = [defaultConnector];

  defaultConnector._options = {
    ...defaultConnector._options,
    ...connectorOptions,
  };

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
  options: Omit<RenderOptions, "wrapper"> & {
    connectorOptions?: Partial<MockConnectorOptions>;
  } = {},
): RenderResult {
  const { connectorOptions, ...renderOptions } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <StarknetConfig connectorOptions={connectorOptions}>
        {children}
      </StarknetConfig>
    ),
    ...renderOptions,
  });
}

function customRenderHook<RenderResult, Props>(
  render: (initialProps: Props) => RenderResult,
  options: Omit<RenderHookOptions<Props>, "wrapper"> & {
    connectorOptions?: Partial<MockConnectorOptions>;
  } = {},
) {
  const { connectorOptions, hydrate, ...renderOptions } = options;
  return renderHook(render, {
    wrapper: ({ children }) => (
      <StarknetConfig connectorOptions={connectorOptions}>
        {children}
      </StarknetConfig>
    ),
    hydrate: hydrate as false | undefined,
    ...renderOptions,
  });
}

export * from "@testing-library/react";
export { customRender as render, customRenderHook as renderHook };
