import { useCallback, useReducer } from 'react'
import { defaultProvider, ProviderInterface } from 'starknet'

import { StarknetState } from './model'
import { Connector } from '../../connectors'

interface StarknetManagerState {
  account?: string
  library: ProviderInterface
  error?: string
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
  error: string
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

export function useStarknetManager(): StarknetState {
  const [state, dispatch] = useReducer(reducer, {
    library: defaultProvider,
  })

  const { account, library, error } = state

  const connect = useCallback(async (connector: Connector) => {
    try {
      if (typeof window === undefined) return
      if (window.starknet === undefined) return
      const [account] = await window.starknet.enable()
      dispatch({ type: 'set_account', account })
      if (connector.ready) {
        connector.connect().then((signer) => dispatch({ type: 'set_provider', provider: signer }))
      }
    } catch (err) {
      console.error(err)
      dispatch({ type: 'set_error', error: 'could not activate StarkNet' })
    }
  }, [])

  return { account, connect, library, error }
}
