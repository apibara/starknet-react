import { Box, Grid, Heading, VStack } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import NextLink from 'next/link'
import { Layout } from '../../components/Layout'
import { getAllHooks, isHookDeprecated } from '../../lib/typedoc'
import { Hook } from '../../components/Hook'

function HookBox({
  name,
  description,
  href,
  isDeprecated,
}: {
  name: string
  description: React.ReactNode
  href: string
  isDeprecated: boolean
}) {
  return (
    <NextLink href={href} passHref>
      <Box
        as="a"
        border="1px solid"
        borderColor="cat.surface"
        boxShadow="sm"
        transition="ease-in-out 200ms"
        _hover={{ borderColor: 'cat.peach', boxShadow: 'lg', transform: 'translate(-4px, -4px)' }}
      >
        <Heading
          textDecor={isDeprecated ? 'line-through' : 'none'}
          color={isDeprecated ? 'cat.text' : 'cat.base'}
          as="h3"
          fontSize="lg"
          bg={isDeprecated ? 'cat.surface' : 'cat.peach'}
          px="4"
          py="3"
          fontFamily="mono"
        >
          {name}
        </Heading>
        <Box p="4">{description}</Box>
      </Box>
    </NextLink>
  )
}

export default function ApiPage() {
  const hooks = useMemo(() => {
    return getAllHooks()
  }, [])

  return (
    <Layout>
      <Box pt="12" display="flex" alignItems="center" justifyContent="center">
        <VStack>
          <Heading fontSize="6xl" as="h1">
            Hooks Reference
          </Heading>
          <Heading as="h2" color="cat.peach" fontSize="xl">
            Hooks reference and examples
          </Heading>
        </VStack>
      </Box>
      <Grid templateColumns="repeat(3, 1fr)" maxW="70rem" mx="auto" mt="20" mb="40" gap="6">
        {hooks.map((hook) => (
          <HookBox
            key={hook.name}
            name={hook.name}
            description={<Hook.Summary hook={hook} />}
            href={`/hooks/${hook.name}`}
            isDeprecated={isHookDeprecated(hook)}
          />
        ))}
      </Grid>
    </Layout>
  )
}
