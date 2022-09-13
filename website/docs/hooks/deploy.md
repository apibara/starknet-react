---
sidebar_position: 4
---

# useStarknetDeploy

Hook to create a function that deploys a contract

```typescript
import { useStarknetDeploy } from '@starknet-react/core'

const { data, loading, error, reset, deploy } = useStarknetDeploy({
  contractFactory: contractFactory,
})
```

## Parameters

```typescript
{
  contractFactory?: ContractFactory
}
```

## Return Values

```typescript
  data?: string
  loading: boolean
  error?: string
  reset: () => void
  deploy: ({ constructorCalldata, addressSalt }: DeployArgs) => Promise<Contract | undefined>
```

Where `data` is the deployment transaction hash and `Contract` is from starknet.js.
