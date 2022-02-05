---
sidebar_position: 2
---

# useStarknetBlock

Hook to access the current StarkNet block.

```typescript
import { useStarknetBlock } from '@starknet-react/core'

const { data, loading, error } = useStarknetBlock()
```

## Return Values

```typescript
{
  data?: GetBlockResponse
  loading?: boolean
  error?: string
}
```

Where `GetBlockResponse` is from starknet.js.
