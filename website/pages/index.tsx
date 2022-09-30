import { Box, Button, Center, Heading, HStack, VStack } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { Layout } from '../components/Layout'
import Head from 'next/head'

export default function IndexPage() {
  return (
    <Layout>
      <Head>
        <title>StarkNet React - a collection of React hooks for StarkNet</title>
      </Head>
      <Center h="full">
        <VStack>
          <Box textAlign="center">
            <Heading as="h1" fontSize="7xl">
              StarkNet React
            </Heading>
            <Heading as="h2" fontSize="4xl" color="cat.peach" mt="4">
              A collection of React hooks for StarkNet.
            </Heading>
          </Box>
          <HStack pt="8" gap="20">
            <NextLink href="/get-started" passHref>
              <Button size="lg" as="a" variant="outline" colorScheme="whiteAlpha">
                Get Started
              </Button>
            </NextLink>
            <NextLink href="/hooks" passHref>
              <Button size="lg" as="a" variant="outline" colorScheme="whiteAlpha">
                View Hooks
              </Button>
            </NextLink>
          </HStack>
        </VStack>
      </Center>
    </Layout>
  )
}
