import { useCallback, useReducer } from 'react'
import { AddTransactionResponse, Args, Contract } from 'starknet'

interface State {
  data?: AddTransactionResponse
  loading: boolean
  error?: string
}

interface StartInvoke {
  type: 'start_invoke'
}

interface SetInvokeResponse {
  type: 'set_invoke_response'
  data: AddTransactionResponse
}

interface SetInvokeError {
  type: 'set_invoke_error'
  error: string
}

interface Reset {
  type: 'reset'
}

type Action = StartInvoke | SetInvokeResponse | SetInvokeError | Reset

function starknetInvokeReducer(state: State, action: Action): State {
  if (action.type === 'start_invoke') {
    return {
      ...state,
      loading: true,
    }
  } else if (action.type === 'set_invoke_response') {
    return {
      ...state,
      data: action.data,
      error: undefined,
      loading: false,
    }
  } else if (action.type === 'set_invoke_error') {
    return {
      ...state,
      error: action.error,
      loading: false,
    }
  } else if (action.type === 'reset') {
    return {
      ...state,
      data: undefined,
      error: undefined,
      loading: false,
    }
  }
  return state
}

export interface UseStarknetInvoke {
  data?: Args
  loading: boolean
  error?: string
  reset: () => void
  invoke: (args: Args) => Promise<AddTransactionResponse | undefined>
}

export function useStarknetInvoke(
  contract: Contract | undefined,
  method: string | undefined
): UseStarknetInvoke {
  const [state, dispatch] = useReducer(starknetInvokeReducer, {
    loading: false,
  })

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [dispatch])

  const invoke = useCallback(
    async (args: Args) => {
      if (contract && method && args) {
        try {
          const response = await contract.invoke(method, args)
          dispatch({ type: 'set_invoke_response', data: response })
        } catch (err) {
          if (err.message) {
            dispatch({ type: 'set_invoke_error', error: err.message })
          } else {
            dispatch({ type: 'set_invoke_error', error: 'invoke failed' })
          }
        }
      }
      return undefined
    },
    [contract, method]
  )

  return { data: state.data, loading: state.loading, error: state.error, reset, invoke }
}
