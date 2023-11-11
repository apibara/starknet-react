import { Chain, goerli, mainnet } from "@starknet-react/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  constants,
  AccountInterface,
  ProviderInterface,
  RpcProvider,
} from "starknet";

import { Connector } from "~/connectors";
import { ConnectorData } from "~/connectors/base";
import { ConnectorNotFoundError } from "~/errors";
import { ChainProviderFactory } from "~/providers";
import { AccountProvider } from "./account";

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
  currentAccount?: AccountInterface;
  currentProvider: ProviderInterface;
  error?: Error;
}

interface UseStarknetManagerProps {
  chains: Chain[];
  provider: ChainProviderFactory;
  connectors?: Connector[];
  autoConnect?: boolean;
}

function useStarknetManager({
  chains,
  provider,
  connectors = [],
  autoConnect = false,
}: UseStarknetManagerProps): StarknetState & { account?: AccountInterface } {
  const initialChain = chains[0];
  if (initialChain === undefined) {
    throw new Error("Must provide at least one chain.");
  }

  const { chain: defaultChain, provider: defaultProvider } = providerForChain(
    initialChain,
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
    [setState, chains],
  );

  const handleConnectorChange = useCallback(
    async ({ chainId, account }: ConnectorData) => {
      if (chainId) {
        updateChainAndProvider({ chainId });
      }

      if (account && connectorRef.current) {
        const account = await connectorRef.current.account();
        setState((state) => ({
          ...state,
          currentAccount: account,
        }));
      }
    },
    [updateChainAndProvider, setState, connectorRef],
  );

  const connect = useCallback(
    async ({ connector }: { connector?: Connector }) => {
      if (!connector) {
        throw new Error("Must provide a connector.");
      }

      const needsListenerSetup = connectorRef.current?.id !== connector.id;
      if (needsListenerSetup) {
        connectorRef.current?.off("change", handleConnectorChange);
      }

      try {
        const { chainId } = await connector.connect();
        const account = await connector.account();

        if (account.address !== state.currentAccount?.address) {
          connectorRef.current = connector;
          setState((state) => ({
            ...state,
            currentAccount: account,
          }));
        }

        if (autoConnect) {
          localStorage.setItem("lastUsedConnector", connector.id);
        }

        if (needsListenerSetup) {
          connector.on("change", handleConnectorChange);
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
      setState,
      connectorRef,
      state.currentAccount,
      handleConnectorChange,
      updateChainAndProvider,
    ],
  );

  const disconnect = useCallback(async () => {
    setState((state) => ({
      ...state,
      currentAccount: undefined,
      currentProvider: defaultProvider,
      currentChain: defaultChain,
    }));

    if (autoConnect) {
      localStorage.removeItem("lastUsedConnector");
    }

    if (!connectorRef.current) return;
    connectorRef.current.off("change", handleConnectorChange);

    try {
      await connectorRef.current.disconnect();
    } catch {}
    connectorRef.current = undefined;
  }, [
    autoConnect,
    setState,
    connectorRef,
    handleConnectorChange,
    defaultProvider,
    defaultChain,
  ]);

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
    // Dependencies intentionally omitted since we only want
    // this executed once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    account: state.currentAccount,
    provider: state.currentProvider,
    chain: state.currentChain,
    connector: connectorRef.current,
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
  /** Connect the first available connector on page load. */
  autoConnect?: boolean;
  /** React-query client to use. */
  queryClient?: QueryClient;
  /** Application. */
  children?: React.ReactNode;
}

/** Root Starknet context provider. */
export function StarknetProvider({
  chains,
  provider,
  connectors,
  autoConnect,
  queryClient,
  children,
}: StarknetProviderProps): JSX.Element {
  const { account, ...state } = useStarknetManager({
    chains,
    provider,
    connectors,
    autoConnect,
  });

  return (
    <QueryClientProvider client={queryClient ?? new QueryClient()}>
      <StarknetContext.Provider value={state}>
        <AccountProvider account={account}>{children}</AccountProvider>
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
    case goerli.id:
      return constants.StarknetChainId.SN_GOERLI;
    default:
      return undefined;
  }
}
