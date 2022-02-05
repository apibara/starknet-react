import { useCallback, useEffect, useReducer } from 'react'
import { Args, Contract } from 'starknet'
import { useStarknetBlock } from '../providers/block'

interface State {
  data?: Args
  loading: boolean
  error?: string
  lastUpdatedAt: string
}

interface SetCallResponse {
  type: 'set_call_response'
  data: Args
}

interface SetCallError {
  type: 'set_call_error'
  error: string
}

interface SetLastUpdatedAt {
  type: 'set_last_updated_at'
  blockHash: string
}

type Action = SetCallResponse | SetCallError | SetLastUpdatedAt

function starknetCallReducer(state: State, action: Action): State {
  if (action.type === 'set_call_response') {
    return {
      ...state,
      data: action.data,
      error: undefined,
      loading: false,
    }
  } else if (action.type === 'set_call_error') {
    return {
      ...state,
      error: action.error,
      loading: false,
    }
  } else if (action.type === 'set_last_updated_at') {
    return {
      ...state,
      loading: false,
      lastUpdatedAt: action.blockHash,
    }
  }
  return state
}

interface UseStarknetCallArgs {
  contract?: Contract
  method?: string
  args?: Args
}

export interface UseStarknetCall {
  data?: Args
  loading: boolean
  error?: string
  refresh: () => void
}

export function useStarknetCall({ contract, method, args }: UseStarknetCallArgs): UseStarknetCall {
  const [state, dispatch] = useReducer(starknetCallReducer, {
    loading: true,
    lastUpdatedAt: '',
  })

  const { data: block } = useStarknetBlock()

  const callContract = useCallback(async () => {
    if (contract && method && args) {
      return await contract.call(method, args)
    }
  }, [contract, method, args])

  const refresh = useCallback(() => {
    callContract()
      .then((response) => {
        if (response) {
          dispatch({ type: 'set_call_response', data: response })
        }
      })
      .catch((err) => {
        if (err.message) {
          dispatch({ type: 'set_call_error', error: err.message })
        } else {
          dispatch({ type: 'set_call_error', error: 'call failed' })
        }
      })
  }, [callContract])

  useEffect(() => {
    if (block?.block_hash && block?.block_hash !== state.lastUpdatedAt) {
      refresh()
      dispatch({ type: 'set_last_updated_at', blockHash: block.block_hash })
    }
  }, [block?.block_hash, state.lastUpdatedAt, refresh])

  return { data: state.data, loading: state.loading, error: state.error, refresh }
}
