---
sidebar_position: 7
---

# useSignTypedData

Hook to sign a EIP-712 typed message

```typescript
import { useSignTypedData } from '@starknet-react/core'
import { TypedData } from 'starknet/utils/typedData'

const { data, error, isError, isIdle, isSuccess, signTypedData, reset } =
  useSignTypedData(typedData: TypedData)
```

`TypedData` comes from starknet.js

## Return Values

```typescript
{
  data?: string[]
  error?: string
  isError: boolean
  isIdle: boolean
  isLoading: boolean
  isSuccess: boolean
  signTypedData: () => Promise<Signature | undefined>
  reset: () => void
}
```

`Signature` comes from starknet.js
