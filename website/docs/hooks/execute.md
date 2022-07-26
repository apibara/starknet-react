---
sidebar_position: 5
---

# useStarknetExecute

Hook to create a function that executes an account with a list of calls and tracks the transaction status.

```typescript
import { useStarknetExecute } from '@starknet-react/core'

const { data, loading, error, reset, execute } = useStarknetExecute()
```

## Parameters

```typescript
{
  calls?: Call | Call[]
  metadata?: any
}
```

Where `Call`

```typescript
{
  contractAddress: string
  entrypoint: string
  calldata: unknown[]
}
```

## Return Values

```typescript
  data?: string
  loading: boolean
  error?: string
  reset: () => void
  execute: ({ calls, metadata }:UseStarknetExecuteArgs) => Promise<AddTransactionResponse | undefined>
```

Where `data` is the transaction hash and `AddTransactionResponse` is from starknet.js.
