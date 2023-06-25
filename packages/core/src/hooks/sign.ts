import { stark, typedData } from 'starknet'
import type { AccountInterface, Signature } from 'starknet'
import { useCallback, useReducer } from 'react'
import { useAccount } from './account'
import { useConnectors } from './connectors'

interface State {
  data?: string[]
  error?: string
  isLoading: boolean
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
      data: stark.formatSignature(action.data),
      isLoading: false,
    }
  } else if (action.type === 'set_error') {
    return {
      ...state,
      error: action.error,
      isLoading: false,
    }
  } else if (action.type === 'reset') {
    return {
      ...state,
      data: undefined,
      error: undefined,
      isLoading: false,
    }
  }
  return state
}

export interface UseSignTypedDataResult {
  data?: string[]
  error?: string
  isLoading: boolean
  isError: boolean
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
 * This example shows how to sign some data. The message must follow
 * EIP712 (https://www.starknetjs.com/docs/guides/signature).
 *
 * ```tsx
 * function Component() {
 *   const message = {
 *     types: {
 *      StarkNetDomain: [
 *         { name: "name", type: "felt" },
 *         { name: "version", type: "felt" },
 *         { name: "chainId", type: "felt" },
 *       ],
 *       Person: [
 *         { name: 'name', type: 'felt' }
 *       ],
 *       Mail: [
 *         { name: 'from', type: 'Person' }
 *       ]
 *     },
 *     primaryType: 'Mail',
 *     domain: {
 *       name: 'Starknet Mail',
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
 *  const { data, signTypedData } = useSignTypedData(message)
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
export function useSignTypedData(typedData: typedData.TypedData): UseSignTypedDataResult {
  const [state, dispatch] = useReducer(starknetSignReducer, {
    isLoading: false,
  })

  const { address: accountAddress } = useAccount()
  const { connectors } = useConnectors()

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [dispatch])

  const { data, error, isLoading } = state

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
    isLoading,
    isError: error ? true : false,
    signTypedData,
    reset,
  }
}
