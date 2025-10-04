# starknet-vue demo

Une mini application Vue + Vite pour tester `starknet-vue`.

## Usage

```bash
pnpm install
pnpm --filter starknet-vue-demo dev
```

> L'app utilise un `MockConnector`, donc le bouton "Connect" fonctionne même sans wallet injecté. Adaptable facilement pour les connecteurs réels via `useInjectedConnectors`.
