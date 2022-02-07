---
sidebar_position: 6
---

# useStarknetTransactionManager

Hook to manage the transactions sent to StarkNet. Transactions sent through
the `useStarknetInvoke` hook are automatically added to the list of tracked
transaction. Tracked transactions are periodically refreshed to update their
submission status.

## Return Values

```typescript
{
  transactions: Transaction[]
  addTransaction: (transaction: TransactionSubmitted) => void
  removeTransaction: (transactionHash: string) => void
  refreshTransaction: (transactionHash: string) => void
}
```
