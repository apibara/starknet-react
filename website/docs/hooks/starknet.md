---
sidebar_position: 1
---

# useStarknet

Hook to access the current instance of the underlying StarkNet library.

```typescript
import { useStarknet } from '@starknet-react/core'

const { account, hasStarknet, connectBrowserWallet, library, error } = useStarknet()
```

## Return Values

```typescript
{
  account?: string
  hasStarknet: boolean
  connectBrowserWallet: () => void
  library: ProviderInterface
  error?: string
}
```
