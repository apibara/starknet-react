import { Transaction, useStarknetTransactionManager } from '@starknet-react/core'
import React from 'react'

function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <span>
      <a href={`https://goerli.voyager.online/tx/${transaction.transactionHash}`}>
        {transaction.metadata.method}: {transaction.metadata.message} - {transaction.status}
      </a>
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
