import { useCallback, useEffect, useReducer } from 'react'
import { ContractInterface, BlockNumber } from 'starknet'
import { useStarknetBlock } from '../providers/block'

interface State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Array<any>
  loading: boolean
  error?: string
  lastUpdatedAt: string
}

interface SetCallResponse {
  type: 'set_call_response'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Array<any>
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

interface UseStarknetCallOptions {
  watch?: boolean
  blockNumber?: BlockNumber
}

interface UseStarknetCallArgs<T extends unknown[]> {
  contract?: ContractInterface
  method?: string
  args?: T
  options?: UseStarknetCallOptions
}

export interface UseStarknetCall {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Array<any>
  loading: boolean
  error?: string
  refresh: () => void
}

export function useStarknetCall<T extends unknown[]>({
  contract,
  method,
  args,
  options,
}: UseStarknetCallArgs<T>): UseStarknetCall {
  const [state, dispatch] = useReducer(starknetCallReducer, {
    loading: true,
    lastUpdatedAt: '',
  })

  const { data: block } = useStarknetBlock()

  // default to true
  const watch = options?.watch !== undefined ? options.watch : true
  const blockNumber = options?.blockNumber || 'pending'

  const callContract = useCallback(async () => {
    if (contract && method && args) {
      return await contract.call(method, args, { blockIdentifier: blockNumber })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, method, JSON.stringify(args)])

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
    if (block?.block_hash) {
      if (block?.block_hash == state.lastUpdatedAt) return
      // if not watching never refresh, but fetch at least once
      if (!watch && state.lastUpdatedAt !== '') return

      refresh()
      dispatch({ type: 'set_last_updated_at', blockHash: block.block_hash })
    }
  }, [block?.block_hash, state.lastUpdatedAt, refresh, watch])

  // always refresh on contract, method, or args change
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract?.address, method, JSON.stringify(args)])

  return { data: state.data, loading: state.loading, error: state.error, refresh }
}
