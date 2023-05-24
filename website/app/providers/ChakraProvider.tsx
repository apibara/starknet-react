'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import { ReactNode } from 'react'

const theme = extendTheme({
  fonts: {
    body: `'DejaVu Sans', sans-serif`,
    mono: `'Iosevka', monospace`,
  },
  colors: {
    // catppuccin colors
    cat: {
      rosewater: '#f5e0dc',
      flamingo: '#f2cdcd',
      pink: '#f5c2e7',
      mauve: '#cba6f7',
      red: '#f38ba8',
      maroon: '#eba0ac',
      peach: '#fab387',
      yellow: '#f9e2af',
      green: '#a6e3a1',
      teal: '#94e2d5',
      sky: '#89dceb',
      sapphire: '#74c7ec',
      blue: '#89b4fa',
      lavender: '#b4befe',
      text: '#cdd6f4',
      subtext: '#bac2de',
      overlay: '#9399b2',
      surface: '#45475a',
      base: '#1e1e2e',
      mantle: '#181825',
      crust: '#11111b',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'cat.base',
        color: 'cat.text',
      },
    },
  },
})

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider resetCSS theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}

export default Providers
