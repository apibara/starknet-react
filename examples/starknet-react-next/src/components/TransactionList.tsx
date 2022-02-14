import { Transaction, useStarknetTransactionManager } from '@starknet-react/core'
import React from 'react'

function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <span>
      {transaction.transactionHash} - {transaction.status}
    </span>
  )
}

export function TransactionList() {
  const { transactions } = useStarknetTransactionManager()
  return (
    <ul>
      {transactions.map((transaction, index) => (
        <li key={index}>
          <TransactionItem transaction={transaction} />
        </li>
      ))}
    </ul>
  )
}
