---
sidebar_position: 1
slug: /
---

# StarkNet React

**StarkNet React** is a collection of React hooks for StarkNet. It is inspired by
[wagmi](https://github.com/tmm/wagmi), powered by [starknet.js](https://github.com/0xs34n/starknet.js).

## Getting Started

1. Add `@starknet-react/core`, `get-starknet` and `starknet` to your dependencies.

```
yarn add @starknet-react/core get-starknet starknet
```

Or with npm:

```
npm install @starknet-react/core get-starknet starknet
```

2. Wrap your app with `StarknetProvider`

```typescript
import { StarknetProvider, getInstalledInjectedConnectors } from '@starknet-react/core'

function App() {
  const connectors = getInstalledInjectedConnectors()

  return (
    <StarknetProvider connectors={connectors}>
      <YourApp />
    </StarknetProvider>
  )
}
```

3. Connect the wallet (needs StarkNet Wallet extension installed)

```typescript
import { useConnectors } from '@starknet-react/core'

function YourComponent() {
  const { connect, connectors } = useConnectors()
  return (
    <div>
      {connectors.map((connector) =>
        connector.available() ? (
          <button key={connector.id()} onClick={() => connect(connector)}>
            Connect {connector.name()}
          </button>
        ) : null
      )}
    </div>
  )
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

StarkNet React uses the provider provided by `get-starknet` so that users can select
the current network from a familiar interface. When a StarkNet wallet is not connected,
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
on GitHub](https://github.com/apibara/starknet-react).

## License

This library is licensed under the MIT license.
