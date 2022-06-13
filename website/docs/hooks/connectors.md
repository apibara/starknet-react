---
sidebar_position: 2
---

# useConnectors

Hook to access the connectors registered with StarkNet React.

```typescript
import { useConnectors } from '@starknet-react/core'

const { connect, disconnect, connectors, available } = useConnectors()
```

## Return Values

```typescript
{
  connect: (Connector) => Promise<void>
  disconnect: (Connector) => Promise<void>
  connectors: Connector[]
  available: Connector[]
}
```
