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
  type PaymasterRpc,
  type ProviderInterface,
} from "starknet";

import type { Connector } from "../connectors";
import type { ConnectorData } from "../connectors/base";
import { ConnectorNotFoundError } from "../errors";
import type { ExplorerFactory } from "../explorers/";
import type { ChainProviderFactory } from "../providers";

import { avnuPaymasterProvider } from "../providers/paymaster";
import type { ChainPaymasterFactory } from "../providers/paymaster/factory";
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
  /** Current paymaster provider */
  paymasterProvider?: PaymasterRpc;
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
  currentPaymasterProvider?: PaymasterRpc;
  error?: Error;
}

interface UseStarknetManagerProps {
  chains: Chain[];
  provider: ChainProviderFactory;
  paymasterProvider: ChainPaymasterFactory;
  explorer?: ExplorerFactory;
  connectors?: Connector[];
  autoConnect?: boolean;
  defaultChainId?: bigint;
}

function useStarknetManager({
  chains,
  provider,
  paymasterProvider,
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

  // check for duplicated ids in the chains list
  const seen = new Set<bigint>();

  for (const chain of chains) {
    if (seen.has(chain.id)) {
      throw new Error(`Duplicated chain id found: ${chain.id}`);
    }
    seen.add(chain.id);
  }

  const { chain: _, provider: defaultProvider } = providerForChain(
    defaultChain,
    provider,
  );

  const { paymasterProvider: defaultPaymasterProvider } =
    paymasterProviderForChain(defaultChain, paymasterProvider);

  // The currently connected connector needs to be accessible from the
  // event handler.
  const connectorRef = useRef<Connector | undefined>();
  const [state, setState] = useState<StarknetManagerState>({
    currentChain: defaultChain,
    currentProvider: defaultProvider,
    currentPaymasterProvider: defaultPaymasterProvider,
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
          const { paymasterProvider: newPaymasterProvider } =
            paymasterProviderForChain(chain, paymasterProvider);
          setState((state) => ({
            ...state,
            currentChain: newChain,
            currentProvider: newProvider,
            currentPaymasterProvider: newPaymasterProvider,
          }));
          return;
        }
      }
    },
    [chains, provider, paymasterProvider],
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

  // Dependencies intentionally omitted since we only want
  // this executed when defaultChain is updated.
  // biome-ignore lint/correctness/useExhaustiveDependencies: want to execute only when defaultChain is updated
  useEffect(() => {
    if (!connectorRef.current) {
      // Only update currentChain if no wallet is connected
      setState((state) => ({
        ...state,
        currentChain: defaultChain,
        currentProvider: providerForChain(defaultChain, provider).provider,
        currentPaymasterProvider: paymasterProviderForChain(
          defaultChain,
          paymasterProvider,
        ).paymasterProvider,
      }));
    }
  }, [defaultChain]);
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
      currentPaymasterProvider: defaultPaymasterProvider,
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
  }, [
    autoConnect,
    handleConnectorChange,
    defaultProvider,
    defaultPaymasterProvider,
    defaultChain,
  ]);

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
    paymasterProvider: state.currentPaymasterProvider,
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
  /** Paymaster provider to use. */
  paymasterProvider?: ChainPaymasterFactory;
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
  paymasterProvider,
  connectors,
  explorer,
  autoConnect,
  queryClient,
  defaultChainId,
  children,
}: StarknetProviderProps): JSX.Element {
  const _paymasterProvider = paymasterProvider ?? avnuPaymasterProvider({});
  const { account, address, ...state } = useStarknetManager({
    chains,
    provider,
    paymasterProvider: _paymasterProvider,
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

function paymasterProviderForChain(
  chain: Chain,
  factory: ChainPaymasterFactory,
): { chain: Chain; paymasterProvider: PaymasterRpc } {
  const paymasterProvider = factory(chain);
  if (paymasterProvider) {
    return { chain, paymasterProvider };
  }

  throw new Error(`No paymaster provider found for chain ${chain.name}`);
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
