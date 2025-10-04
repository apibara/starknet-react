import { devnet, mainnet } from "@starknet-react/chains";
import { publicProvider } from "@starknet-react/chains/providers";
import { QueryClient } from "@tanstack/vue-query";
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent } from "vue";

import {
  createStarknetVue,
  useAccount,
  useConnect,
  useDisconnect,
} from "../src";

import { TestConnector, TEST_ADDRESS } from "./test-connector";

function createWrapper() {
  const connector = new TestConnector();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const plugin = createStarknetVue({
    chains: [devnet, mainnet],
    provider: publicProvider(),
    connectors: [connector],
    queryClient,
  });

  const wrapper = mount(
    defineComponent({
      setup() {
        const account = useAccount();
        const connect = useConnect();
        const disconnect = useDisconnect();
        return { account, connect, disconnect };
      },
      template: "<div />",
    }),
    {
      global: {
        plugins: [plugin],
      },
    },
  );

  return { wrapper, connector };
}

describe("useAccount", () => {
  it("returns disconnected state on mount", () => {
    const { wrapper } = createWrapper();
    expect(wrapper.vm.account.status).toBe("disconnected");
    expect(wrapper.vm.account.address).toBeUndefined();
  });

  it("updates after connecting and disconnecting", async () => {
    const { wrapper, connector } = createWrapper();

    await wrapper.vm.connect.connectAsync({ connector });
    await flushPromises();

    expect(wrapper.vm.account.isConnected).toBe(true);
    expect(wrapper.vm.account.address).toBe(TEST_ADDRESS);

    await wrapper.vm.disconnect.disconnectAsync();
    await flushPromises();

    expect(wrapper.vm.account.isDisconnected).toBe(true);
    expect(wrapper.vm.account.address).toBeUndefined();
  });
});
