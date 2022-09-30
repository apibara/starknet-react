import { Box } from '@chakra-ui/react'
import React from 'react'
import { Header } from './Header'

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <Box h="100vh" display="flex" flexDir="column">
      <Header />
      <Box flexGrow="1" bg="cat.base">
        {children}
      </Box>
    </Box>
  )
}
