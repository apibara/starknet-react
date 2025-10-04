import type { StarknetWindowObject } from "get-starknet-core";
import { computed, onMounted, ref } from "vue";

import type { Connector } from "./base";
import { injected, legacyInjected } from "./helpers";

export type UseInjectedConnectorsProps = {
  recommended?: Connector[];
  includeRecommended?: "always" | "onlyIfNoConnectors";
  order?: "random" | "alphabetical";
  shimLegacyConnectors?: string[];
};

export type UseInjectedConnectorsResult = {
  connectors: Connector[];
};

export function useInjectedConnectors({
  recommended,
  includeRecommended = "always",
  order = "alphabetical",
  shimLegacyConnectors = [],
}: UseInjectedConnectorsProps = {}): UseInjectedConnectorsResult {
  const injectedConnectors = ref<Connector[]>([]);

  const refreshConnectors = () => {
    const wallets = scanObjectForWallets(
      globalThis as unknown as Record<string, any>,
    );
    const connectors = wallets.map((wallet) => {
      if (shimLegacyConnectors.includes(wallet.id)) {
        return legacyInjected({ id: wallet.id });
      }
      return injected({ id: wallet.id });
    });
    injectedConnectors.value = connectors;
  };

  onMounted(() => {
    refreshConnectors();
  });

  const connectors = computed(() =>
    mergeConnectors(injectedConnectors.value, recommended ?? [], {
      includeRecommended,
      order,
    }),
  );

  return {
    get connectors() {
      return connectors.value;
    },
  };
}

function mergeConnectors(
  injected: Connector[],
  recommended: Connector[],
  {
    includeRecommended,
    order,
  }: Required<Pick<UseInjectedConnectorsProps, "includeRecommended" | "order">>,
): Connector[] {
  const recommendedIds = new Set(recommended.map((connector) => connector.id));
  const shouldAddRecommended =
    includeRecommended === "always" ||
    (includeRecommended === "onlyIfNoConnectors" && injected.length === 0);
  const allConnectors: Connector[] = [];
  if (shouldAddRecommended) {
    allConnectors.push(...recommended);
  }
  allConnectors.push(
    ...injected.filter((connector) => !recommendedIds.has(connector.id)),
  );

  if (order === "random") {
    return shuffle(allConnectors);
  }

  return allConnectors.sort((a, b) => a.id.localeCompare(b.id));
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function scanObjectForWallets(obj: Record<string, any>): StarknetWindowObject[] {
  return Object.values(
    Object.getOwnPropertyNames(obj).reduce<
      Record<string, StarknetWindowObject>
    >((wallets, key) => {
      if (key.startsWith("starknet")) {
        const wallet = obj[key];
        if (isWalletObject(wallet) && !wallets[wallet.id]) {
          wallets[wallet.id] = wallet;
        }
      }
      return wallets;
    }, {}),
  );
}

function isWalletObject(wallet: any): wallet is StarknetWindowObject {
  try {
    return (
      wallet &&
      [
        "request",
        "isConnected",
        "provider",
        "enable",
        "isPreauthorized",
        "on",
        "off",
        "version",
        "id",
        "name",
        "icon",
      ].every((key) => key in wallet)
    );
  } catch (_err) {
    return false;
  }
}
