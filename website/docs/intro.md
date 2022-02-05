---
sidebar_position: 1
slug: /
---

# StarkNet React

**StarkNet React** is a collection of providers and hooks for StarkNet.

## Getting Started

1. Add `@starknet-react/core` to your dependencies.

```
yarn add @starknet-react/core
```

2. Wrap your app with the providers

```typescript
import { StarknetProvider, StarknetBlockProvider } from '@starknet-react/core'

function App() {
  return (
    <StarknetProvider>
      <StarknetBlockProvider>
        <YourApp />
      </StarknetBlockProvider>
    </StarknetProvider>
  )
}
```

3. Access the hooks from your components.

```typescript
import { useStarknet } from '@starknet-react/core'

function YourComponent() {
  const { account } = useStarknet()

  return <div>gm {account}</div>
}
```

## Support and Feedback

If you need help or you want to provide feedback, [create an issue or start a discussion
on GitHub](https://github.com/auclantis/starknet-react).

## License

This library is licensed under the MIT license.
