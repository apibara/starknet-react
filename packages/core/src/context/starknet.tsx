import { Chain } from "@starknet-react/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { AccountInterface, ProviderInterface, RpcProvider } from "starknet";

import { Connector } from "~/connectors";
import { ConnectorNotFoundError } from "~/errors";
import { ChainProviderFactory } from "~/providers";
import { AccountProvider } from "./account";

/** State of the Starknet context. */
export interface StarknetState {
  /** Connected connector. */
  connector?: Connector;
  /** Connect the given connector. */
  connect: ({ connector }: { connector: Connector }) => Promise<void>;
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
  currentConnector?: Connector;
  currentAccount?: AccountInterface;
  currentProvider: ProviderInterface;
  error?: Error;
}

interface SetAccount {
  type: "set_account";
  connector?: Connector;
  account?: AccountInterface;
}

interface SetProvider {
  type: "set_provider";
  provider: ProviderInterface;
  chain: Chain;
}

interface SetError {
  type: "set_error";
  error: Error;
}

type Action = SetAccount | SetProvider | SetError;

function reducer(
  state: StarknetManagerState,
  action: Action,
): StarknetManagerState {
  switch (action.type) {
    case "set_account": {
      return {
        ...state,
        currentConnector: action.connector,
        currentAccount: action.account,
      };
    }
    case "set_provider": {
      return {
        ...state,
        currentChain: action.chain,
        currentProvider: action.provider,
      };
    }
    case "set_error": {
      return { ...state, error: action.error };
    }
    default: {
      return state;
    }
  }
}

interface UseStarknetManagerProps {
  chains: Chain[];
  providers: ChainProviderFactory[];
  connectors?: Connector[];
  autoConnect?: boolean;
}

function useStarknetManager({
  chains,
  providers,
  connectors = [],
  autoConnect = false,
}: UseStarknetManagerProps): StarknetState & { account?: AccountInterface } {
  const initialChain = chains[0];
  if (initialChain === undefined) {
    throw new Error("Must provide at least one chain.");
  }

  const { chain: defaultChain, provider: defaultProvider } = providerForChain(
    initialChain,
    providers,
  );

  const [state, dispatch] = useReducer(reducer, {
    currentChain: defaultChain,
    currentProvider: defaultProvider,
    connectors,
  });

  const connect = useCallback(
    async ({ connector }: { connector: Connector }) => {
      try {
        const account = await connector.connect();
        dispatch({ type: "set_account", connector, account });
        if (autoConnect) {
          localStorage.setItem("lastUsedConnector", connector.id);
        }
      } catch (err) {
        dispatch({ type: "set_error", error: new ConnectorNotFoundError() });
        throw err;
      }
    },
    [autoConnect],
  );

  const disconnect = useCallback(async () => {
    dispatch({ type: "set_account", connector: undefined });
    dispatch({
      type: "set_provider",
      provider: defaultProvider,
      chain: defaultChain,
    });
    if (autoConnect) {
      localStorage.removeItem("lastUsedConnector");
    }
    if (!state.currentConnector) return;
    state.currentConnector.off("change", handleConnectorChange);
    try {
      await state.currentConnector.disconnect();
    } catch (err) {
      console.error(err);
      dispatch({ type: "set_error", error: new ConnectorNotFoundError() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, state.currentConnector, defaultProvider, defaultChain]);

  const handleConnectorChange = useCallback(async () => {
    await disconnect();
    if (state.currentConnector) {
      await connect({ connector: state.currentConnector });
    }
  }, [connect, disconnect, state.currentConnector]);

  useEffect(() => {
    if (state.currentConnector) {
      state.currentConnector.on("change", handleConnectorChange);
    }
  }, [state.currentConnector, handleConnectorChange]);

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

    if (autoConnect && !state.currentConnector) {
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
    connector: state.currentConnector,
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
  /** Providers supported by the app. */
  providers: ChainProviderFactory[];
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
  providers,
  connectors,
  autoConnect,
  queryClient,
  children,
}: StarknetProviderProps): JSX.Element {
  const { account, ...state } = useStarknetManager({
    chains,
    providers,
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
  providers: ChainProviderFactory[],
): { chain: Chain; provider: ProviderInterface } {
  for (const factory of providers) {
    const provider = factory(chain);
    if (provider) {
      const { chain, rpcUrls } = provider;
      const nodeUrl = rpcUrls.http[0];
      if (!nodeUrl) {
        continue;
      }
      const rpc = new RpcProvider({ nodeUrl });
      return { chain, provider: rpc };
    }
  }

  throw new Error(`No provider found for chain ${chain.name}`);
}
