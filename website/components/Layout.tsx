import { Box } from '@chakra-ui/react'
import React from 'react'
import { Header } from './Header'

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <Box>
      <Header />
      <Box>{children}</Box>
    </Box>
  )
}
