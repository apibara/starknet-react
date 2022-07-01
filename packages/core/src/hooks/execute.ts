import { useCallback, useReducer } from 'react'
import type { AccountInterface } from 'starknet'
import { AddTransactionResponse, Overrides } from 'starknet'
import { useStarknet, useStarknetTransactionManager } from '..'

interface State {
    data?: string
    loading: boolean
    error?: string
}

interface StartExecute {
    type: 'start_execute'
  }
  
  interface SetExecuteResponse {
    type: 'set_execute_response'
    data: AddTransactionResponse
  }
  
  interface SetExecuteError {
    type: 'set_execute_error'
    error: string
  }

interface Reset {
    type: 'reset'
}

type Action = StartExecute | SetExecuteResponse | SetExecuteError | Reset

function starknetExecuteReducer(state: State, action: Action): State {
  if (action.type === 'start_execute') {
    return {
      ...state,
      loading: true,
    }
  } else if (action.type === 'set_execute_response') {
    return {
      ...state,
      data: action.data.transaction_hash,
      error: undefined,
      loading: false,
    }
  } else if (action.type === 'set_execute_error') {
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

interface Call {
    contractAddress: string;
    entrypoint: string;
    calldata: unknown[];
}

interface UseStarknetExecuteArgs {
    calls?: Call | Call[];
    metadata?: any
}

export interface ExecuteArgs<T extends unknown[]> {
    args: T
    overrides?: Overrides
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any
  }

export interface UseStarknetExecute<T extends unknown[]> {
    data?: string
    loading: boolean
    error?: string
    reset: () => void
    execute: () => Promise<AddTransactionResponse | undefined>
  }

export function useStarknetExecute<T extends unknown[]>({
    calls,
    metadata
}: UseStarknetExecuteArgs): UseStarknetExecute<T> {
    const { addTransaction } = useStarknetTransactionManager()
    const [ state, dispatch] = useReducer(starknetExecuteReducer, {
        loading: false
    })

    const { account: accountAddress, connectors } = useStarknet()

    const reset = useCallback(() => {
        dispatch({ type: 'reset' })
    }, [dispatch])

    const execute = useCallback(
        async () => {
          if (calls) {
            try {
              let accountInterface: AccountInterface | null = null
              for (const connector of connectors) {
                const account = await connector.account()
                if (account.address === accountAddress) {
                  accountInterface = account
                  break
                }
              }
              if (!accountInterface) {
                throw new Error(`No connector for address ${accountAddress}`)
              }
              dispatch({ type: 'start_execute' })
              const response = await accountInterface.execute(calls)
              dispatch({ type: 'set_execute_response', data: response })
              // start tracking the transaction
              addTransaction({
                status: response.code,
                transactionHash: response.transaction_hash,
                metadata,
              })
            } catch (err) {
              const message = err instanceof Error ? err.message : String(err)
              dispatch({ type: 'set_execute_error', error: message })
            }
          }
          return undefined
        },
        [accountAddress, connectors, addTransaction]
    )

    return { data: state.data, loading: state.loading, error: state.error, reset, execute }
}

