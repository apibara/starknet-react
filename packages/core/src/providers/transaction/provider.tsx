import React, { useCallback, useEffect, useReducer } from 'react'
import { List } from 'immutable'
import { useStarknet } from '../starknet'
import { TransactionManagerContext } from './context'
import { Transaction, TransactionSubmitted } from './model'
import { transactionManagerReducer } from './reducer'

function shouldRefreshTransaction(transaction: Transaction, now: number): boolean {
  // try to get transaction data as soon as possible
  if (transaction.status === 'TRANSACTION_RECEIVED') {
    return true
  }

  // wont' be updated anymore
  if (transaction.status === 'ACCEPTED_ON_L1' || transaction.status === 'REJECTED') {
    return false
  }

  // every couple of minutes is enough. Blocks finalized infrequently.
  if (transaction.status === 'ACCEPTED_ON_L2') {
    return now - transaction.lastUpdatedAt > 120000
  }

  return now - transaction.lastUpdatedAt > 15000
}

interface StarknetTransactionManagerProviderProps {
  children: React.ReactNode
  interval?: number
}

export function StarknetTransactionManagerProvider({
  children,
  interval,
}: StarknetTransactionManagerProviderProps): JSX.Element {
  const { library } = useStarknet()

  const [state, dispatch] = useReducer(transactionManagerReducer, {
    transactions: List<Transaction>(),
  })

  const refresh = useCallback(
    async (transactionHash: string) => {
      try {
        const transactionResponse = await library.getTransaction(transactionHash)
        const lastUpdatedAt = Date.now()
        dispatch({ type: 'update_transaction', transactionResponse, lastUpdatedAt })
      } catch (err) {
        // TODO(fra): somehow should track the error
        console.error(err)
      }
    },
    [library, dispatch]
  )

  const refreshAllTransactions = useCallback(() => {
    const now = Date.now()
    for (const transaction of state.transactions) {
      if (shouldRefreshTransaction(transaction, now)) {
        refresh(transaction.transactionHash)
      }
    }
  }, [state.transactions, refresh])

  const addTransaction = useCallback(
    (transaction: TransactionSubmitted) => {
      dispatch({ type: 'add_transaction', transaction })
    },
    [dispatch]
  )

  const removeTransaction = useCallback(
    (transactionHash: string) => {
      dispatch({ type: 'remove_transaction', transactionHash })
    },
    [dispatch]
  )

  const refreshTransaction = useCallback(
    (transactionHash: string) => {
      refresh(transactionHash)
    },
    [refresh]
  )

  // periodically refresh all transactions.
  // do this more often than once per block since there are
  // different stages of "accepted" transactions.
  useEffect(() => {
    refreshAllTransactions()
    const intervalId = setInterval(() => {
      refreshAllTransactions()
    }, interval ?? 5000)
    return () => clearInterval(intervalId)
  }, [interval, refreshAllTransactions])

  return (
    <TransactionManagerContext.Provider
      value={{
        transactions: state.transactions.toArray(),
        addTransaction,
        removeTransaction,
        refreshTransaction,
      }}
    >
      {children}
    </TransactionManagerContext.Provider>
  )
}
