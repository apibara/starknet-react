import { Status, TransactionStatus, Transaction as StarknetTransaction } from 'starknet'

export interface TransactionSubmitted {
  status: TransactionStatus
  transactionHash: string
  address?: string
  metadata?: any
}

export interface TransactionReceived {
  status: Status
  transaction: StarknetTransaction
  transactionHash: string
  lastUpdatedAt: number
  metadata?: any
}

export type Transaction = TransactionSubmitted | TransactionReceived

export interface StarknetTransactionManager {
  transactions: Transaction[]
  addTransaction: (transaction: TransactionSubmitted) => void
  removeTransaction: (transactionHash: string) => void
  refreshTransaction: (transactionHash: string) => void
}

export const TRANSACTION_MANAGER_INITIAL_STATE: StarknetTransactionManager = {
  transactions: [],
  addTransaction: (_transaction) => undefined,
  removeTransaction: (_transactionHash) => undefined,
  refreshTransaction: (_transactionHash) => undefined,
}
