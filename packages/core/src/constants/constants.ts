export type BlockExplorerName = 'voyager'
export type BlockExplorer = { name: string; url: string }

// Could be in starknet.js one day..
export const voyagerBlockExplorers: Record<string, BlockExplorer> = {
  SN_MAIN: {
    name: 'Voyager',
    url: 'https://voyager.online',
  },
  SN_GOERLI: {
    name: 'Voyager',
    url: 'https://goerli.voyager.online',
  },
}
