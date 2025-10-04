import { devnet, mainnet } from "@starknet-react/chains";
import { publicProvider } from "@starknet-react/chains/providers";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import type { MockConnectorOptions } from "@starknet-react/core/src/connectors/mock";
import { MockConnector } from "starknet-vue";
import type { Component } from "vue";
import { createApp } from "vue";

export function createMockConnector(
  overrides?: Partial<MockConnectorOptions>,
) {
  return new MockConnector({
    accounts: {
      mainnet: [
        {
          address:
            "0x078662e7352d062084b0010068b99288486c2d8b914f6e2a55ce945f8792c8b1",
          cairoVersion: "1",
          deploySelf: async () => {
            throw new Error("deploySelf not implemented");
          },
          signer: {
            getPubKey: async () => "0x01",
            signMessage: async () => ["0x0"],
            signTransaction: async () => ["0x0"],
            signDeployAccountTransaction: async () => ["0x0"],
            signDeclareTransaction: async () => ["0x0"],
          } as any,
        } as any,
      ],
      [devnet.id.toString()]: [],
      [mainnet.id.toString()]: [],
    },
    options: {
      id: "mock",
      name: "Mock",
      ...overrides,
    },
  });
}

export function mountWithStarknet(component: Component, {
  connector,
  queryClient,
}: {
  connector: MockConnector;
  queryClient?: QueryClient;
}) {
  const app = createApp(component);

  const starknet = (await import("starknet-vue")).createStarknetVue({
    chains: [devnet, mainnet],
    provider: publicProvider(),
    connectors: [connector],
    queryClient: queryClient ?? new QueryClient(),
  });

  app.use(starknet);
  app.use(VueQueryPlugin);

  return app;
}
