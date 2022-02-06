import { createContext, useContext } from 'react'

import { StarknetTransactionManager, TRANSACTION_MANAGER_INITIAL_STATE } from './model'

export const TransactionManagerContext = createContext<StarknetTransactionManager>(
  TRANSACTION_MANAGER_INITIAL_STATE
)

export function useStarknetTransactionManager(): StarknetTransactionManager {
  return useContext(TransactionManagerContext)
}
