---
sidebar_position: 1
---

# Chain

Type representing a chain.

```typescript
type Chain = {
  /** Chain ID */
  id: string
  /** Human-readable name */
  name: string
  /** Block explorer */
  blockExplorer?: BlockExplorer
  /** Flag for test networks */
  testnet?: boolean
}
```

## Exemple Values

Default provider.

```typescript
chain: {
    id: "0x534e5f474f45524c49",
    name: "SN_GOERLI",
    blockExplorer: {
        name: "Voyager",
        url: "https://goerli.voyager.online"
    },
    testnet: true
}
```
