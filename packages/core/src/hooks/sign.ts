import { TypedData } from 'starknet/utils/typedData'
import type { AccountInterface, Signature } from 'starknet'
import { useCallback, useReducer } from 'react'
import { useStarknet } from '..'

interface State {
  data?: string[]
  error?: string
  isLoading: boolean
  isSuccess: boolean
}

interface StartSigning {
  type: 'start_signing'
}

interface SetSignature {
  type: 'set_signature'
  data: Signature
}

interface SetSigningError {
  type: 'set_error'
  error: string
}

interface SetSuccess {
  type: 'set_success'
  isSuccess: boolean
}

interface Reset {
  type: 'reset'
}

type Action = StartSigning | SetSignature | SetSigningError | SetSuccess | Reset

function starknetSignReducer(state: State, action: Action): State {
  if (action.type === 'start_signing') {
    return {
      ...state,
      isLoading: true,
    }
  } else if (action.type === 'set_signature') {
    return {
      ...state,
      data: action.data,
      isLoading: false,
      isSuccess: true,
    }
  } else if (action.type === 'set_error') {
    return {
      ...state,
      error: action.error,
      isLoading: false,
      isSuccess: false,
    }
  } else if (action.type === 'reset') {
    return {
      ...state,
      data: undefined,
      error: undefined,
      isLoading: false,
      isSuccess: false,
    }
  }
  return state
}

export interface UseSignTypedData {
  data?: string[]
  error?: string
  isError: boolean
  isIdle: boolean
  isLoading: boolean
  isSuccess: boolean
  signTypedData: () => Promise<Signature | undefined>
  reset: () => void
}

export function useSignTypedData(typedData: TypedData): UseSignTypedData {
  const [state, dispatch] = useReducer(starknetSignReducer, {
    isLoading: false,
    isSuccess: false,
  })

  const { account: accountAddress, connectors } = useStarknet()

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [dispatch])

  const { data, error, isLoading, isSuccess } = state

  const signTypedData = useCallback(async () => {
    dispatch({ type: 'reset' })
    dispatch({ type: 'start_signing' })
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
      const response = await accountInterface.signMessage(typedData)
      dispatch({ type: 'set_signature', data: response })
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      dispatch({ type: 'set_error', error: errorMessage })
      console.error(err)
    }
  }, [accountAddress, connectors, typedData])

  return {
    data,
    error,
    isError: !!error,
    isIdle: !isLoading,
    isLoading,
    isSuccess,
    signTypedData,
    reset,
  }
}
