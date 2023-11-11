# Starknet React

<p align="center">
  <a href="https://www.npmjs.com/package/@starknet-react/core">
    <img alt="@starknet-react/core" src="https://img.shields.io/npm/v/@starknet-react/core">
  </a>
  <a href="https://github.com/apibara/starknet-react/actions/workflows/release.yml">
    <img alt="Release Status" src="https://img.shields.io/github/actions/workflow/status/apibara/starknet-react/build.yml">
  </a>
  <a href="https://www.github.com/apibara/starknet-react">
    <img alt="MIT LICENSE" src="https://img.shields.io/github/license/apibara/starknet-react">
  </a>
</p>

**Starknet React** is a collection of React hooks for Starknet. It is inspired by
[wagmi](https://github.com/tmm/wagmi), powered by [starknet.js](https://github.com/0xs34n/starknet.js).

## Documentation

Documentation, including demos, [is available online](https://starknet-react.com/).

## Getting Started

1. Add `@starknet-react/chains` and `@starknet-react/core` to your dependencies.

```shell
pnpm add @starknet-react/chains @starknet-react/core
```

You also need to add `get-starknet-core` and `starknet` to your dependencies.

```shell
pnpm add get-starknet-core starknet
```

2. Wrap your app with `StarknetConfig`

```typescript
import { goerli } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
} from "@starknet-react/core";

function App() {
  const chains = [goerli];
  const provider = publicProvider();
  const connectors = [braavos(), argent()];

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors}>
      <YourApp />
    </StarknetConfig>
  )
}
```

3. Access the hooks from your components.

```typescript
import { useAccount } from '@starknet-react/core'

function YourComponent() {
  const { address } = useAccount()

  return <div>gm {address}</div>
}
```

## License

This library is licensed under the MIT license.

