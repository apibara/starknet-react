import { useCallback, useReducer } from 'react'
import { AddTransactionResponse, Args, Contract } from 'starknet'
import { useStarknetTransactionManager } from '..'

interface State {
  data?: string
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
      data: action.data.transaction_hash,
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

interface UseStarknetInvokeArgs {
  contract?: Contract
  method?: string
}

export interface UseStarknetInvoke {
  data?: string
  loading: boolean
  error?: string
  reset: () => void
  invoke: ({ args: Args }) => Promise<AddTransactionResponse | undefined>
}

export function useStarknetInvoke({ contract, method }: UseStarknetInvokeArgs): UseStarknetInvoke {
  const { addTransaction } = useStarknetTransactionManager()
  const [state, dispatch] = useReducer(starknetInvokeReducer, {
    loading: false,
  })

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [dispatch])

  const invoke = useCallback(
    async ({ args }: { args: Args }) => {
      if (contract && method && args) {
        try {
          dispatch({ type: 'start_invoke' })
          const response = await contract.invoke(method, args)
          dispatch({ type: 'set_invoke_response', data: response })
          // start tracking the transaction
          addTransaction({ status: response.code, transactionHash: response.transaction_hash })
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
    [contract, method, addTransaction]
  )

  return { data: state.data, loading: state.loading, error: state.error, reset, invoke }
}
