---
'@starknet-react/core': major
---

Upgrade to starknet.js v5.

Breaking changes:

- The `id`, `name`, and `icon` methods in the `Connector` base class are now
  properties.
- All Starknet.js types are now from v5. Follow [Starknet.js migration
  guide](https://www.starknetjs.com/docs/guides/migrate) to update your
  application.

This release also removes several deprecated functions:

- `useStarknetBlock`, use `useBlock`.
- `useStarknetInvoke`, use `useContractWrite` with a single call.
- `useStarknet`. To access the currently connected account, using
  `useAccount`. For the current `ProviderInterface`, use the new `useProvider`
  hook. For `connect`, `disconnect`, and `connectors` use `useConnectors`.
