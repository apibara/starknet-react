import { useCallback, useEffect, useReducer, useState } from 'react'
import { defaultProvider, ProviderInterface } from 'starknet'

import { StarknetState } from './model'
import { Connector } from '../../connectors'
import { ConnectorNotFoundError } from '../../errors'

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
      return { ...state, library: action.provider ?? defaultProvider }
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

export function useStarknetManager({
  defaultProvider: userDefaultProvider,
  connectors: userConnectors,
  autoConnect,
}: UseStarknetManagerProps): StarknetState {
  const connectors = userConnectors ?? []
  const [state, dispatch] = useReducer(reducer, {
    library: userDefaultProvider ? userDefaultProvider : defaultProvider,
    connectors,
  })

  const { account, library, error } = state

  const handleAccountChanged = () => {
    state.connector.connect().then((account) => {
      dispatch({ type: 'set_account', account: account.address })
    })
  }

  if (state.connector) {
    state.connector._wallet.on('accountsChanged', handleAccountChanged)
  }

  const connect = useCallback((connector: Connector) => {
    connector.connect().then(
      (account) => {
        dispatch({ type: 'set_account', account: account.address })
        dispatch({ type: 'set_provider', provider: account })
        dispatch({ type: 'set_connector', connector })
      },
      (err) => {
        console.error(err)
        dispatch({ type: 'set_error', error: new ConnectorNotFoundError() })
      }
    )
  }, [])

  const disconnect = useCallback(() => {
    if (!state.connector) return
    state.connector.disconnect().then(
      () => {
        dispatch({ type: 'set_account', account: undefined })
        dispatch({ type: 'set_provider', provider: undefined })
        dispatch({ type: 'set_connector', connector: undefined })
      },
      (err) => {
        console.error(err)
        dispatch({ type: 'set_error', error: new ConnectorNotFoundError() })
      }
    )
  }, [state.connector])

  useEffect(() => {
    async function tryAutoConnect(connectors: Connector[]) {
      // Autoconnect priority is defined by the order of the connectors.
      for (let i = 0; i < connectors.length; i++) {
        try {
          const connector = connectors[i]
          if (!(await connector.ready())) {
            // Not already authorized, try next.
            continue
          }

          const account = await connector.connect()
          dispatch({ type: 'set_account', account: account.address })
          dispatch({ type: 'set_provider', provider: account })
          dispatch({ type: 'set_connector', connector })

          // Success, stop trying.
          return
        } catch {
          // no-op, we continue trying the next connectors.
        }
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
