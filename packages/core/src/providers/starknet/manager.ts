import { getStarknet } from '@argent/get-starknet'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { defaultProvider, ProviderInterface } from 'starknet'

import { StarknetState } from './model'

interface StarknetManagerState {
  account?: string
  library: ProviderInterface
}

interface SetAccount {
  type: 'set_account'
  account: string
}

interface SetProvider {
  type: 'set_provider'
  provider: ProviderInterface
}

type Action = SetAccount | SetProvider

function reducer(state: StarknetManagerState, action: Action): StarknetManagerState {
  switch (action.type) {
    case 'set_account': {
      return { ...state, account: action.account }
    }
    case 'set_provider': {
      return { ...state, library: action.provider }
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

  const { account, library } = state

  useEffect(() => {
    if (typeof window !== undefined) {
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
      // TODO: display error message to user
    }
  }, [])

  return { account, hasStarknet, connectBrowserWallet, library }
}
