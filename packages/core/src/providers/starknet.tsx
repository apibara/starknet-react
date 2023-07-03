import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { Provider, ProviderInterface, constants } from 'starknet'
import { Connector } from '../connectors'
import { ConnectorNotFoundError } from '../errors'

/** State of the Starknet context. */
export interface StarknetState {
  /**
   * Connected account address.
   */
  account?: string
  /**
   * Connect the given connector.
   */
  connect: (connector: Connector) => void
  /**
   * Disconnect the currently connected connector.
   */
  disconnect: () => void
  /** List of registered connectors.
   */
  connectors: Connector[]
  /** Current provider. */
  library: ProviderInterface
  /** Error. */
  error?: Error
}

const customDefaultProvider = new Provider({
  sequencer: {
    network: constants.NetworkName.SN_MAIN,
  },
})

const STARKNET_INITIAL_STATE: StarknetState = {
  account: undefined,
  connect: () => undefined,
  disconnect: () => undefined,
  library: customDefaultProvider,
  connectors: [],
}

const StarknetContext = createContext<StarknetState>(STARKNET_INITIAL_STATE)

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
  return useContext(StarknetContext)
}

interface StarknetManagerState {
  account?: string
  connectors: Connector[]
  connector?: Connector
  library: ProviderInterface
  error?: Error
}

interface SetAccount {
  type: 'set_account'
  account?: string
}

interface SetProvider {
  type: 'set_provider'
  provider?: ProviderInterface
}

interface SetConnector {
  type: 'set_connector'
  connector?: Connector
}

interface SetError {
  type: 'set_error'
  error: Error
}

type Action = SetAccount | SetProvider | SetConnector | SetError

function reducer(state: StarknetManagerState, action: Action): StarknetManagerState {
  switch (action.type) {
    case 'set_account': {
      return { ...state, account: action.account }
    }
    case 'set_provider': {
      return { ...state, library: action.provider ?? customDefaultProvider }
    }
    case 'set_connector': {
      return { ...state, connector: action.connector }
    }
    case 'set_error': {
      return { ...state, error: action.error }
    }
    default: {
      return state
    }
  }
}

interface UseStarknetManagerProps {
  defaultProvider?: ProviderInterface
  connectors?: Connector[]
  autoConnect?: boolean
}

function useStarknetManager({
  defaultProvider: userDefaultProvider,
  connectors: userConnectors,
  autoConnect,
}: UseStarknetManagerProps): StarknetState {
  const connectors = userConnectors ?? []
  const [state, dispatch] = useReducer(reducer, {
    library: userDefaultProvider ? userDefaultProvider : customDefaultProvider,
    connectors,
  })

  const { account, library, error } = state

  const connect = useCallback(
    (connector: Connector) => {
      connector.connect().then(
        (account) => {
          dispatch({ type: 'set_account', account: account.address })
          dispatch({ type: 'set_provider', provider: account })
          dispatch({ type: 'set_connector', connector })
          if (autoConnect) {
            localStorage.setItem('lastUsedConnector', connector.id)
          }
        },
        (err) => {
          console.error(err)
          dispatch({ type: 'set_error', error: new ConnectorNotFoundError() })
        }
      )
    },
    [autoConnect]
  )

  const disconnect = useCallback(() => {
    dispatch({ type: 'set_account', account: undefined })
    dispatch({
      type: 'set_provider',
      provider: userDefaultProvider ? userDefaultProvider : customDefaultProvider,
    })
    dispatch({ type: 'set_connector', connector: undefined })
    if (autoConnect) {
      localStorage.removeItem('lastUsedConnector')
    }
    if (!state.connector) return
    state.connector.removeEventListener(handleAccountChanged)
    state.connector.disconnect().catch((err) => {
      console.error(err)
      dispatch({ type: 'set_error', error: new ConnectorNotFoundError() })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, state.connector, userDefaultProvider])

  const handleAccountChanged = useCallback(() => {
    disconnect()
    if (state.connector) {
      connect(state.connector)
    }
  }, [state.connector, connect, disconnect])

  useEffect(() => {
    if (state.connector) {
      state.connector?.initEventListener(handleAccountChanged)
    }
  }, [state.connector, handleAccountChanged])

  useEffect(() => {
    async function tryAutoConnect(connectors: Connector[]) {
      const lastConnectedConnectorId = localStorage.getItem('lastUsedConnector')
      if (lastConnectedConnectorId === null) {
        return
      }

      const lastConnectedConnector = connectors.find(
        (connector) => connector.id === lastConnectedConnectorId
      )
      if (lastConnectedConnector === undefined) {
        return
      }

      try {
        if (!(await lastConnectedConnector.ready())) {
          // Not authorized anymore.
          return
        }

        connect(lastConnectedConnector)
      } catch {
        // no-op
      }
    }

    if (autoConnect && !account) {
      tryAutoConnect(connectors)
    }
    // Dependencies intentionally omitted since we only want
    // this executed once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { account, connect, disconnect, connectors, library, error }
}

/** Arguments for `StarknetProvider`. */
export interface StarknetProviderProps {
  /** Application. */
  children?: React.ReactNode
  /** Default provider, used when the user is not connected. */
  defaultProvider?: ProviderInterface
  /** List of connectors to use. */
  connectors?: Connector[]
  /** Connect the first available connector on page load. */
  autoConnect?: boolean
  /** Low-level react-query client to use. */
  queryClient?: QueryClient
}

/** Root Starknet context provider. */
export function StarknetProvider({
  children,
  defaultProvider,
  connectors,
  autoConnect,
  queryClient,
}: StarknetProviderProps): JSX.Element {
  const state = useStarknetManager({ defaultProvider, connectors, autoConnect })
  return (
    <QueryClientProvider client={queryClient ?? new QueryClient()}>
      <StarknetContext.Provider value={state}>{children}</StarknetContext.Provider>
    </QueryClientProvider>
  )
}
