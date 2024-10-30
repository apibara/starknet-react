import {
  type Address,
  type Chain,
  mainnet,
  sepolia,
} from "@starknet-react/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  constants,
  type AccountInterface,
  type ProviderInterface,
} from "starknet";

import type { Connector } from "../connectors";
import type { ConnectorData } from "../connectors/base";
import { ConnectorNotFoundError } from "../errors";
import type { ExplorerFactory } from "../explorers/";
import type { ChainProviderFactory } from "../providers";

import { AccountProvider } from "./account";

const defaultQueryClient = new QueryClient();

/** State of the Starknet context. */
export interface StarknetState {
  /** Connected connector. */
  connector?: Connector;
  /** Connect the given connector. */
  connect: ({ connector }: { connector?: Connector }) => Promise<void>;
  /** Disconnect the currently connected connector. */
  disconnect: () => Promise<void>;
  /** List of registered connectors. */
  connectors: Connector[];
  /** Current explorer factory. */
  explorer?: ExplorerFactory;
  /** Chains supported by the app. */
  chains: Chain[];
  /** Current chain. */
  chain: Chain;
  /** Current provider. */
  provider: ProviderInterface;
  /** Error. */
  error?: Error;
}

const StarknetContext = createContext<StarknetState | undefined>(undefined);

/**
 * Returns the current Starknet context state.
 *
 * @remarks
 *
 * This hook should be used sparingly and will be deprecated.
 *
 * Use the following hooks:
 *
 *  - `account`: `useAccount`
 *  - `connect`, `disconnect`, `connectors`: `useConnectors`
 *
 * @example
 * This example shows how to access the Starknet provider.
 * ```tsx
 * function Component() {
 *   const { library } = useStarknet()
 *
 *   if (!library.provider) return <span>Account URL: {library.baseUrl}</span>
 *   return <span>Provider URL: {library.provider.baseUrl}</span>
 * }
 * ```
 */
export function useStarknet(): StarknetState {
  const state = useContext(StarknetContext);
  if (!state) {
    throw new Error(
      "useStarknet must be used within a StarknetProvider or StarknetConfig",
    );
  }
  return state;
}

interface StarknetManagerState {
  currentChain: Chain;
  connectors: Connector[];
  currentAddress?: Address;
  currentProvider: ProviderInterface;
  error?: Error;
}

interface UseStarknetManagerProps {
  chains: Chain[];
  provider: ChainProviderFactory;
  explorer?: ExplorerFactory;
  connectors?: Connector[];
  autoConnect?: boolean;
  defaultChainId?: bigint;
}

function useStarknetManager({
  chains,
  provider,
  explorer,
  connectors = [],
  autoConnect = false,
  defaultChainId,
}: UseStarknetManagerProps): StarknetState & {
  account?: AccountInterface;
  address?: Address;
} {
  const defaultChain = defaultChainId
    ? (chains.find((c) => c.id === defaultChainId) ?? chains[0])
    : chains[0];
  if (defaultChain === undefined) {
    throw new Error("Must provide at least one chain.");
  }

  const { chain: _, provider: defaultProvider } = providerForChain(
    defaultChain,
    provider,
  );

  // The currently connected connector needs to be accessible from the
  // event handler.
  const connectorRef = useRef<Connector | undefined>();
  const [state, setState] = useState<StarknetManagerState>({
    currentChain: defaultChain,
    currentProvider: defaultProvider,
    connectors,
  });

  const updateChainAndProvider = useCallback(
    ({ chainId }: { chainId?: bigint }) => {
      if (!chainId) return;
      for (const chain of chains) {
        if (chain.id === chainId) {
          const { chain: newChain, provider: newProvider } = providerForChain(
            chain,
            provider,
          );
          setState((state) => ({
            ...state,
            currentChain: newChain,
            currentProvider: newProvider,
          }));
          return;
        }
      }
    },
    [chains, provider],
  );

  const handleConnectorChange = useCallback(
    async ({ chainId, account: address }: ConnectorData) => {
      if (chainId) {
        updateChainAndProvider({ chainId });
      }

      if (address && connectorRef.current) {
        setState((state) => ({
          ...state,
          currentAddress: address as Address,
        }));
      }
    },
    [updateChainAndProvider],
  );

  useEffect(() => {
    if (!connectorRef.current) {
      // Only update currentChain if no wallet is connected
      setState((state) => ({
        ...state,
        currentChain: defaultChain,
        currentProvider: providerForChain(defaultChain, provider).provider,
      }));
    }
  }, [defaultChain, provider]);
  const connect = useCallback(
    async ({ connector }: { connector?: Connector }) => {
      if (!connector) {
        throw new Error("Must provide a connector.");
      }

      const needsListenerSetup = connectorRef.current?.id !== connector.id;
      if (needsListenerSetup) {
        connectorRef.current?.off("change", handleConnectorChange);
        connectorRef.current?.off("disconnect", disconnect);
      }

      try {
        const { chainId, account: address } = await connector.connect({
          chainIdHint: defaultChain.id,
        });

        if (address !== state.currentAddress) {
          connectorRef.current = connector;

          setState((state) => ({
            ...state,
            currentAddress: address as Address,
          }));
        }

        if (autoConnect) {
          localStorage.setItem("lastUsedConnector", connector.id);
        }

        if (needsListenerSetup) {
          connector.on("change", handleConnectorChange);
          connector.on("disconnect", disconnect);
        }

        updateChainAndProvider({ chainId });
      } catch (err) {
        setState((state) => ({
          ...state,
          error: new ConnectorNotFoundError(),
        }));
        throw err;
      }
    },
    [
      autoConnect,
      state.currentAddress,
      defaultChain.id,
      handleConnectorChange,
      updateChainAndProvider,
    ],
  );

  const disconnect = useCallback(async () => {
    setState((state) => ({
      ...state,
      currentAddress: undefined,
      currentProvider: defaultProvider,
      currentChain: defaultChain,
    }));

    if (autoConnect) {
      localStorage.removeItem("lastUsedConnector");
    }

    if (!connectorRef.current) return;
    connectorRef.current.off("change", handleConnectorChange);
    connectorRef.current.off("disconnect", disconnect);

    try {
      await connectorRef.current.disconnect();
    } catch {}
    connectorRef.current = undefined;
  }, [autoConnect, handleConnectorChange, defaultProvider, defaultChain]);

  // Dependencies intentionally omitted since we only want
  // this executed once.
  // biome-ignore lint/correctness/useExhaustiveDependencies: want to execute only once
  useEffect(() => {
    async function tryAutoConnect(connectors: Connector[]) {
      const lastConnectedConnectorId =
        localStorage.getItem("lastUsedConnector");
      if (lastConnectedConnectorId === null) {
        return;
      }

      const lastConnectedConnector = connectors.find(
        (connector) => connector.id === lastConnectedConnectorId,
      );
      if (lastConnectedConnector === undefined) {
        return;
      }

      try {
        if (!(await lastConnectedConnector.ready())) {
          // Not authorized anymore.
          return;
        }

        connect({ connector: lastConnectedConnector });
      } catch {
        // no-op
      }
    }

    if (autoConnect && !connectorRef.current) {
      tryAutoConnect(connectors);
    }
  }, []);

  return {
    address: state.currentAddress,
    provider: state.currentProvider,
    chain: state.currentChain,
    connector: connectorRef.current,
    explorer,
    connect,
    disconnect,
    connectors,
    chains,
  };
}

/** Arguments for `StarknetProvider`. */
export interface StarknetProviderProps {
  /** Chains supported by the app. */
  chains: Chain[];
  /** Provider to use. */
  provider: ChainProviderFactory;
  /** List of connectors to use. */
  connectors?: Connector[];
  /** Explorer to use. */
  explorer?: ExplorerFactory;
  /** Connect the first available connector on page load. */
  autoConnect?: boolean;
  /** React-query client to use. */
  queryClient?: QueryClient;
  /** Application. */
  children?: React.ReactNode;
  /** Default chain to use when wallet is not connected */
  defaultChainId?: bigint;
}

/** Root Starknet context provider. */
export function StarknetProvider({
  chains,
  provider,
  connectors,
  explorer,
  autoConnect,
  queryClient,
  defaultChainId,
  children,
}: StarknetProviderProps): JSX.Element {
  const { account, address, ...state } = useStarknetManager({
    chains,
    provider,
    explorer,
    connectors,
    autoConnect,
    defaultChainId,
  });

  return (
    <QueryClientProvider client={queryClient ?? defaultQueryClient}>
      <StarknetContext.Provider value={state}>
        <AccountProvider address={address} account={account}>
          {children}
        </AccountProvider>
      </StarknetContext.Provider>
    </QueryClientProvider>
  );
}

function providerForChain(
  chain: Chain,
  factory: ChainProviderFactory,
): { chain: Chain; provider: ProviderInterface } {
  const provider = factory(chain);
  if (provider) {
    return { chain, provider };
  }

  throw new Error(`No provider found for chain ${chain.name}`);
}

export function starknetChainId(
  chainId: bigint,
): constants.StarknetChainId | undefined {
  switch (chainId) {
    case mainnet.id:
      return constants.StarknetChainId.SN_MAIN;
    case sepolia.id:
      return constants.StarknetChainId.SN_SEPOLIA;
    default:
      return undefined;
  }
}
