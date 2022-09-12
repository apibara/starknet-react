import { useCallback, useReducer } from 'react'
import { ContractFactory, RawCalldata, number, Contract } from 'starknet'

interface State {
  data?: string
  loading: boolean
  error?: string
}

interface StartDeploy {
  type: 'start_deploy'
}

interface SetDeployResponse {
  type: 'set_deploy_response'
  data: Contract
}

interface SetDeployError {
  type: 'set_deploy_error'
  error: string
}

interface Reset {
  type: 'reset'
}

type Action = StartDeploy | SetDeployResponse | SetDeployError | Reset

export interface UseStarknetDeployArgs {
  contractFactory?: ContractFactory
}

interface UseStarknetDeploy {
  data?: string
  loading: boolean
  error?: string
  reset: () => void
  deploy: ({ constructorCalldata, addressSalt }: DeployArgs) => Promise<Contract | undefined>
}

export interface DeployArgs {
  constructorCalldata?: RawCalldata
  addressSalt?: number.BigNumberish
}

export function useStarknetDeploy({ contractFactory }: UseStarknetDeployArgs): UseStarknetDeploy {
  const [state, dispatch] = useReducer(starknetDeployReducer, {
    loading: true,
  })

  const reset = useCallback(() => {
    // Cancel deployment
    dispatch({ type: 'reset' })
  }, [dispatch])

  const deploy = useCallback(
    async ({ constructorCalldata, addressSalt }: DeployArgs) => {
      if (contractFactory) {
        try {
          dispatch({ type: 'start_deploy' })
          const contract = await contractFactory.deploy(constructorCalldata, addressSalt)
          dispatch({ type: 'set_deploy_response', data: contract })
          return contract
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          dispatch({ type: 'set_deploy_error', error: message })
        }
      }
      return undefined
    },
    [contractFactory]
  )

  return { data: state.data, loading: state.loading, error: state.error, reset, deploy }
}

function starknetDeployReducer(state: State, action: Action): State {
  if (action.type === 'start_deploy') {
    return {
      ...state,
      loading: true,
    }
  } else if (action.type === 'set_deploy_response') {
    return {
      ...state,
      data: action.data.deployTransactionHash,
      error: undefined,
      loading: false,
    }
  } else if (action.type === 'set_deploy_error') {
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
