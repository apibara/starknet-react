import React, { Context, createContext, useCallback, useContext, useReducer } from 'react'
import { OrderedMap, OrderedSet } from 'immutable'

/** A transaction managed by the transaction manager.
 *
 * @typeParam M - the metadata type.
 */
export interface ManagedTransaction<M extends object> {
  /** The transaction hash. */
  hash: string
  /** Metadata associated with the transaction. */
  metadata?: M
}

/** Transaction manager state. */
export interface TransactionManagerState<M extends object> {
  /** The transactions being managed. */
  transactions: ManagedTransaction<M>[]
  /** Hashes of the transactions being managed. */
  hashes: string[]
  /** Add a transaction to the managed transactions. */
  addTransaction: ({ hash, metadata }: { hash: string; metadata?: M }) => void
  /** Remove a transaction from the managed transactions. */
  removeTransaction: ({ hash }: { hash: string }) => void
}

/** Transaction manager context. */
export const TransactionManagerContext = createContext<TransactionManagerState<object>>({
  transactions: [],
  hashes: [],
  addTransaction: ({ hash: _hash, metadata: _metadata }) => undefined,
  removeTransaction: ({ hash: _hash }) => undefined,
})

/**
 * Hook to manage transaction across different components.
 *
 * @remarks
 *
 * This hook only manages the hashes of the transactions, use the
 * `useTransactions` hook to fetch the state of the transactions.
 *
 * @example
 * This example shows how to fetch the state of tracked transactions
 * and how to add new transactions to the manager.
 *
 * Notice that the transaction manager only accepts the same transaction once.
 * ```tsx
 * function Component() {
 *   const { hashes, addTransaction } = useTransactionManager()
 *   const transactions = useTransactions({ hashes })
 *
 *   return (
 *     <>
 *       <button onClick={() => addTransaction({ hash: txHash, metadata: { test: true } })}>
 *         Add transaction
 *       </button>
 *       <ul>
 *         {transactions.map(({ data }, i) => (
 *           <li key={i}>{data && data.transaction_hash}</li>
 *         ))}
 *       </ul>
 *     </>
 *   )
 * }
 * ```
 */
export function useTransactionManager<M extends object>(): TransactionManagerState<M> {
  const context = useContext<TransactionManagerState<M>>(
    TransactionManagerContext as unknown as Context<TransactionManagerState<M>>
  )
  if (!context) {
    throw new Error('useTransactionManager must be used inside TransactionManagerProvider')
  }
  return context
}

export interface TransactionManagerProviderProps {
  children: React.ReactNode
}

/** Context provider for `useTransactionManager`. */
export function TransactionManagerProvider<M extends object>({
  children,
}: TransactionManagerProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    hashes: OrderedSet<string>(),
    transactions: OrderedMap<string, ManagedTransaction<M>>(),
  })

  const addTransaction = useCallback(
    ({ hash, metadata }: { hash: string; metadata?: M }) => {
      dispatch({ type: 'add_transaction', hash, metadata })
    },
    [dispatch]
  )

  const removeTransaction = useCallback(
    ({ hash }: { hash: string }) => {
      dispatch({ type: 'remove_transaction', hash })
    },
    [dispatch]
  )

  const Provider = TransactionManagerContext.Provider as unknown as React.Provider<
    TransactionManagerState<M>
  >

  const transactions = (state as unknown as InternalState<M>).transactions

  return (
    <Provider
      value={{
        transactions: transactions.valueSeq().toArray(),
        hashes: transactions.keySeq().toArray(),
        addTransaction,
        removeTransaction,
      }}
    >
      {children}
    </Provider>
  )
}

interface InternalState<M extends object> {
  hashes: OrderedSet<string>
  transactions: OrderedMap<string, ManagedTransaction<M>>
}

interface AddTransaction<M extends object> {
  type: 'add_transaction'
  hash: string
  metadata?: M
}

interface RemoveTransaction {
  type: 'remove_transaction'
  hash: string
}

type InternalAction<M extends object> = AddTransaction<M> | RemoveTransaction

function reducer<M extends object>(
  state: InternalState<M>,
  action: InternalAction<M>
): InternalState<M> {
  switch (action.type) {
    case 'add_transaction': {
      const hashes = state.hashes.add(action.hash)
      const transactions = state.transactions.set(action.hash, {
        hash: action.hash,
        metadata: action.metadata,
      })
      return { ...state, hashes, transactions }
    }
    case 'remove_transaction': {
      const hashes = state.hashes.remove(action.hash)
      const transactions = state.transactions.delete(action.hash)
      return { ...state, hashes, transactions }
    }
    default: {
      return state
    }
  }
}
