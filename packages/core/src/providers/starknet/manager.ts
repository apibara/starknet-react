import { getStarknet } from '@argent/get-starknet'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { defaultProvider, ProviderInterface } from 'starknet'

import { StarknetState } from './model'

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
  const [hasStarknet, setHasStarknet] = useState(false)
  const [state, dispatch] = useReducer(reducer, {
    library: defaultProvider,
  })

  const { account, library, error } = state

  useEffect(() => {
    if (typeof window !== undefined) {
      // calling getStarknet here makes the detection more reliable
      getStarknet()
      if (window.starknet) {
        setHasStarknet(true)
      }
    }
  }, [])

  const connectBrowserWallet = useCallback(async () => {
    try {
      if (typeof window === undefined) return
      if (window.starknet === undefined) return
      const [account] = await window.starknet.enable()
      dispatch({ type: 'set_account', account })
      const starknet = getStarknet()
      if (starknet.signer) {
        dispatch({ type: 'set_provider', provider: starknet.signer })
      }
    } catch (err) {
      console.error(err)
      dispatch({ type: 'set_error', error: 'could not activate StarkNet' })
    }
  }, [])

  return { account, hasStarknet, connectBrowserWallet, library, error }
}
