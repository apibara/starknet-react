import { Box, Heading } from '@chakra-ui/react'

export function Section({ children }: { children: React.ReactNode }) {
  return (
    <Box maxW="40rem" mx="auto" mt="12">
      {children}
    </Box>
  )
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Heading as="h3" mb="4">
      {children}
    </Heading>
  )
}
