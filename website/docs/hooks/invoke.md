---
sidebar_position: 5
---

# useStarknetInvoke

Hook to create a function that invokes a contract method and track the transaction status.

```typescript
import { useStarknetInvoke } from '@starknet-react/core'

const { data, loading, error, reset, invoke } = useStarknetInvoke({ contract, method })
```

## Parameters

```typescript
{
  contract?: Contract
  method?: string
}
```

## Return Values

```typescript
  data?: string
  loading: boolean
  error?: string
  reset: () => void
  invoke: ({ args: Args }) => Promise<AddTransactionResponse | undefined>
```

Where `data` is the transaction hash and `AddTransactionResponse` is from starknet.js.
