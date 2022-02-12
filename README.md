# StarkNet React

<p align="center">
  <a href="https://www.npmjs.com/package/@starknet-react/core">
    <img alt="@starknet-react/core" src="https://img.shields.io/npm/v/@starknet-react/core">
  </a>
  <a href="https://github.com/auclantis/starknet-react/actions/workflows/release.yml">
    <img alt="Release Status" src="https://img.shields.io/github/workflow/status/auclantis/starknet-react/Release">
  </a>
  <a href="https://www.github.com/auclantis/starknet-react">
    <img alt="MIT LICENSE" src="https://img.shields.io/github/license/auclantis/starknet-react">
  </a>
</p>

**StarkNet React** is a collection of React hooks for StarkNet. It is inspired by
[wagmi](https://github.com/tmm/wagmi), powered by [starknet.js](https://github.com/0xs34n/starknet.js).

## Documentation

Documentation, including a small demo, [is available online](https://auclantis.github.io/starknet-react/).

## Getting Started

1. Add `@starknet-react/core` to your dependencies.

```shell
yarn add @starknet-react/core
```

You also need to add `@argent/get-starknet` and `starknet` to your dependencies.

```shell
yarn add @argent/get-starknet starknet
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

3. Access the hooks from your components.

```typescript
import { useStarknet } from '@starknet-react/core'

function YourComponent() {
  const { account } = useStarknet()

  return <div>gm {account}</div>
}
```

## License

This library is licensed under the MIT license.
