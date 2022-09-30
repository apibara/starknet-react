import { TypedData } from 'starknet/utils/typedData'
import type { AccountInterface, Signature } from 'starknet'
import { useCallback, useReducer } from 'react'
import { useStarknet } from '../providers'

interface State {
  data?: string[]
  error?: string
  loading: boolean
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
      loading: true,
    }
  } else if (action.type === 'set_signature') {
    return {
      ...state,
      data: action.data,
      loading: false,
    }
  } else if (action.type === 'set_error') {
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

export interface UseSignTypedData {
  data?: string[]
  error?: string
  loading: boolean
  signTypedData: () => Promise<Signature | undefined>
  reset: () => void
}

/**
 * Hook to sign typed data.
 *
 * @remarks
 *
 * This hook signs a JSON object for off-chain use with the current
 * wallet private key.
 *
 * @example
 * This example shows how to sign some data.
 * ```tsx
 * function Component() {
 *   const { data, signTypedData } = useSignTypedData(message)
 *   const message = {
 *     types: {
 *       Person: [
 *         { name: 'name', type: 'felt' }
 *       ],
 *       Mail: [
 *         { name: 'from', type: 'Person' }
 *       ]
 *     },
 *     primaryType: 'Mail',
 *     domain: {
 *       name: 'StarkNet Mail',
 *       version: '1',
 *       chainId: 1,
 *     },
 *     message: {
 *       from: {
 *         name: 'Alice'
 *       }
 *     }
 *   }
 *
 *   return (
 *     <>
 *       <p>
 *         <button onClick={signTypedData}>Sign</button>
 *       </p>
 *       {data && <p>Signed: {JSON.stringify(data)}</p>}
 *     </>
 *   )
 * }
 * ```
 */
export function useSignTypedData(typedData: TypedData): UseSignTypedData {
  const [state, dispatch] = useReducer(starknetSignReducer, {
    loading: false,
  })

  const { account: accountAddress, connectors } = useStarknet()

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [dispatch])

  const { data, error, loading } = state

  const signTypedData = useCallback(async () => {
    dispatch({ type: 'reset' })
    dispatch({ type: 'start_signing' })
    try {
      let accountInterface: AccountInterface | null = null
      const availableConnectors = connectors.filter((conn) => conn.available())
      for (const connector of availableConnectors) {
        const account = await connector.account()
        if (account && account.address === accountAddress) {
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
    loading,
    signTypedData,
    reset,
  }
}
