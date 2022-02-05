---
sidebar_position: 3
---

# useContract

Hook to build a `Contract` instance from its ABI and address.

```typescript
import { useContract } from '@starknet-react/core'

const { contract } = useContract({ abi, address })
```

## Parameters

```typescript
{
  abi?: Abi[]
  address?: string
}
```

Where `Abi` is from starknet.js.

## Return Values

```typescript
{
  contract?: Contract
}
```

A contract is returned only if both `abi` and `address` are defined.
