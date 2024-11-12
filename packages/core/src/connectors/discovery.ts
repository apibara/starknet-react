import type { StarknetWindowObject } from "get-starknet-core";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Connector } from "./base";
import { injected, legacyInjected } from "./helpers";

export type UseInjectedConnectorsProps = {
  /** List of recommended connectors to display. */
  recommended?: Connector[];
  /** Whether to include recommended connectors in the list. */
  includeRecommended?: "always" | "onlyIfNoConnectors";
  /** How to order connectors. */
  order?: "random" | "alphabetical";
  /** Shim the following legacy connectors if they are detected. */
  shimLegacyConnectors?: string[];
};

export type UseInjectedConnectorsResult = {
  /** Connectors list. */
  connectors: Connector[];
};

export function useInjectedConnectors({
  recommended,
  includeRecommended = "always",
  order = "alphabetical",
  shimLegacyConnectors = [],
}: UseInjectedConnectorsProps): UseInjectedConnectorsResult {
  const [injectedConnectors, setInjectedConnectors] = useState<Connector[]>([]);

  const refreshConnectors = useCallback(() => {
    const wallets = scanObjectForWallets(window);
    const connectors = wallets.map((wallet) => {
      if (shimLegacyConnectors.includes(wallet.id)) {
        return legacyInjected({ id: wallet.id });
      }
      return injected({ id: wallet.id });
    });
    setInjectedConnectors(connectors);
  }, [shimLegacyConnectors.includes]);

  useEffect(() => {
    refreshConnectors();
  }, [refreshConnectors]);

  const connectors = useMemo(() => {
    return mergeConnectors(injectedConnectors, recommended ?? [], {
      includeRecommended,
      order,
    });
  }, [injectedConnectors, recommended, includeRecommended, order]);

  return { connectors };
}

function mergeConnectors(
  injected: Connector[],
  recommended: Connector[],
  {
    includeRecommended,
    order,
  }: Required<Pick<UseInjectedConnectorsProps, "includeRecommended" | "order">>,
): Connector[] {
  const injectedIds = new Set(injected.map((connector) => connector.id));
  const allConnectors = [...injected];
  const shouldAddRecommended =
    includeRecommended === "always" ||
    (includeRecommended === "onlyIfNoConnectors" && injected.length === 0);
  if (shouldAddRecommended) {
    allConnectors.push(
      ...recommended.filter((connector) => !injectedIds.has(connector.id)),
    );
  }

  if (order === "random") {
    return shuffle(allConnectors);
  }
  return allConnectors.sort((a, b) => a.id.localeCompare(b.id));
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // @ts-ignore: not important
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function scanObjectForWallets(
  // biome-ignore lint: window could contain anything
  obj: Record<string, any>,
): StarknetWindowObject[] {
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

// biome-ignore lint: window could contain anything
function isWalletObject(wallet: any): wallet is StarknetWindowObject {
  try {
    return (
      wallet &&
      [
        // wallet's must have methods/members, see IStarknetWindowObject
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
  } catch (err) {}
  return false;
}
