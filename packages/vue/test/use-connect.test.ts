import { devnet } from "@starknet-react/chains";
import { publicProvider } from "@starknet-react/chains/providers";
import { QueryClient } from "@tanstack/vue-query";
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent } from "vue";

import { createStarknetVue, useAccount, useConnect } from "../src";

import { TestConnector } from "./test-connector";

function setup(connectors = [new TestConnector()]) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const plugin = createStarknetVue({
    chains: [devnet],
    provider: publicProvider(),
    connectors,
    queryClient,
  });

  const wrapper = mount(
    defineComponent({
      setup() {
        const connect = useConnect();
        const account = useAccount();
        return { connect, account };
      },
      template: "<div />",
    }),
    {
      global: { plugins: [plugin] },
    },
  );

  return { wrapper, connectors };
}

describe("useConnect", () => {
  it("exposes available connectors", () => {
    const mockConnector = new TestConnector();
    const { wrapper } = setup([mockConnector]);
    expect(wrapper.vm.connect.connectors).toHaveLength(1);
    expect(wrapper.vm.connect.connectors[0].id).toBe("test");
  });

  it("connects with provided connector", async () => {
    const mockConnector = new TestConnector();
    const { wrapper } = setup([mockConnector]);

    await wrapper.vm.connect.connectAsync({ connector: mockConnector });
    await flushPromises();

    expect(wrapper.vm.account.isConnected).toBe(true);
    expect(wrapper.vm.account.address).toBeDefined();
  });
});
