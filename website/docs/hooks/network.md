---
sidebar_position: 2
---

# useNetwork

Hook to access the current network.

```typescript
import { useNetwork } from '@starknet-react/core'

const { chain } = useNetwork()
```

## Return Values

```typescript
{
  chain?: Chain
}
```

Where [`Chain`](/types/Chain) is from starknet-react.
