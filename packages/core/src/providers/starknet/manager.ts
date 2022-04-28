import { useCallback, useEffect, useReducer } from 'react'
import { defaultProvider, ProviderInterface } from 'starknet'

import { StarknetState } from './model'
import { Connector } from '../../connectors'
import { ConnectorNotFoundError } from '../../errors'

interface StarknetManagerState {
  account?: string
  connectors: Connector[]
  library: ProviderInterface
  error?: Error
}

interface SetAccount {
  type: 'set_account'
  account: string
}

interface SetProvider {
  type: 'set_provider'
  provider: ProviderInterface
}

interface SetError {
  type: 'set_error'
  error: Error
}

type Action = SetAccount | SetProvider | SetError

function reducer(state: StarknetManagerState, action: Action): StarknetManagerState {
  switch (action.type) {
    case 'set_account': {
      return { ...state, account: action.account }
    }
    case 'set_provider': {
      return { ...state, library: action.provider }
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
  connectors,
  autoConnect,
}: UseStarknetManagerProps): StarknetState {
  const [state, dispatch] = useReducer(reducer, {
    library: userDefaultProvider ? userDefaultProvider : defaultProvider,
    connectors,
  })

  const { account, library, error } = state

  const connect = useCallback((connector: Connector) => {
    connector.connect().then(
      (account) => {
        dispatch({ type: 'set_account', account: account.address })
        dispatch({ type: 'set_provider', provider: account })
      },
      (err) => {
        console.error(err)
        dispatch({ type: 'set_error', error: new ConnectorNotFoundError() })
      }
    )
  }, [])

  const disconnect = useCallback((connector: Connector) => {
    connector.disconnect().then(
      () => {
        dispatch({ type: 'set_account', account: undefined })
        dispatch({ type: 'set_provider', provider: undefined })
      },
      (err) => {
        console.error(err)
        dispatch({ type: 'set_error', error: new ConnectorNotFoundError() })
      }
    )
  }, [])

  useEffect(() => {
    async function tryAutoConnect(connectors: Connector[]) {
      // Autoconnect priority is defined by the order of the connectors.
      for (let i = 0; i < connectors.length; i++) {
        try {
          if (!(await connectors[i].ready())) {
            // Not already authorized, try next.
            continue
          }

          const account = await connectors[i].connect()
          dispatch({ type: 'set_account', account: account.address })
          dispatch({ type: 'set_provider', provider: account })

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
