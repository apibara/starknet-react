---
sidebar_position: 1
---

# useStarknet

Hook to access the current instance of the underlying StarkNet library.

```typescript
import { useStarknet } from '@starknet-react/core'

const { account, connect, library, error } = useStarknet()
```

## Return Values

```typescript
{
  account?: string
  connect: (Connector) => Promise<void>
  library: ProviderInterface
  error?: string
}
```
