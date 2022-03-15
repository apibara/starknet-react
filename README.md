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

### Getting Started with Next.js

If you plan to use StarkNet React with Next.js, you can use the provided
template:

```shell
npx create-next-app@latest --example https://github.com/auclantis/starknet-react/tree/main/examples/starknet-react-next
```

After the installation is complete:

- Run `yarn run dev` to start the development server.
- Visit `http://localhost:3000` to view your StarkNet-powered application.

## Projects using StarkNet React

- [Bitmap Box](https://www.bitmapbox.xyz/) - on-chain 2D block-building game.
- [Eykar](https://eykar.org/) - on-chain game of conquest and strategy.
- [Starknet Name Service](https://github.com/Matchbox-DAO/sns_app) - Starknet-native name registry service.

_Using StarkNet React? Add your project to this list by opening a Pull Request._

## License

This library is licensed under the MIT license.
