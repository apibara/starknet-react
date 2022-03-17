---
sidebar_position: 1
slug: /
---

# StarkNet React

**StarkNet React** is a collection of React hooks for StarkNet. It is inspired by
[wagmi](https://github.com/tmm/wagmi), powered by [starknet.js](https://github.com/0xs34n/starknet.js).

## Getting Started

1. Add `@starknet-react/core`, `@argent/get-starknet` and `starknet` to your dependencies.

```
yarn add @starknet-react/core @argent/get-starknet starknet
```

Or with npm:

```
npm install @starknet-react/core @argent/get-starknet starknet
```

2. Wrap your app with `StarknetProvider`

```typescript
import { StarknetProvider } from '@starknet-react/core'

function App() {
  return (
    <StarknetProvider>
      <YourApp />
    </StarknetProvider>
  )
}
```

3. Connect the wallet (needs Argent X StarkNet Wallet extension installed)

```typescript
import { useStarknet, InjectedConnector } from '@starknet-react/core'

function YourComponent() {
  const { connect } = useStarknet()

  if (!InjectedConnector.ready()) {
    ;<span>Injected connector not found</span>
  }

  return <button onClick={connect(new InjectedConnector())}>Connect Wallet</button>
}
```

4. Retrieve the account address

```typescript
import { useStarknet } from '@starknet-react/core'

function YourComponent() {
  const { account } = useStarknet()

  return <div>gm {account}</div>
}
```

## Customizing the default provider

StarkNet React uses the provider provided by Argent X so that users can select
the current network from a familiar interface. When Argent X is not connected,
StarkNet React uses a _default provider_. By default, the default provider is
the same as the default provider provided by starknet.js. Developers can customize
the default provider as follows:

```typescript
import { StarknetProvider } from '@starknet-react/core'
import { Provider } from 'starknet'

function App() {
  return (
    <StarknetProvider defaultProvider={new Provider({ baseUrl: 'http://localhost:500' })}>
      <YourApp />
    </StarknetProvider>
  )
}
```

## Support and Feedback

If you need help or you want to provide feedback, [create an issue or start a discussion
on GitHub](https://github.com/auclantis/starknet-react).

## License

This library is licensed under the MIT license.
