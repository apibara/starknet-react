import { HStack, Link, List, ListItem, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

function NavigationItem({ href, title }: { href: string; title: string }) {
  const { asPath } = useRouter()
  const isActive = href === '/' ? asPath === '/' : asPath.startsWith(href)
  return (
    <ListItem borderBottom={isActive ? '1px solid' : '0px solid'} borderColor="cat.peach" py="2">
      <NextLink href={href} passHref>
        <Link transition="color ease-in 200ms" _hover={{ textDecor: 'none', color: 'cat.peach' }}>
          {title}
        </Link>
      </NextLink>
    </ListItem>
  )
}

export function Header() {
  return (
    <HStack py="4" px="8" bg="cat.crust" w="full" justifyContent="space-between">
      <HStack alignItems="center">
        <NextLink href="/" passHref>
          <a>
            <Text as="h2" fontWeight="bold" fontSize="xl">
              StarkNet React
            </Text>
          </a>
        </NextLink>
      </HStack>
      <HStack>
        <List display="flex" flexDir="row" gap="4">
          <NavigationItem href="/" title="Home" />
          <NavigationItem href="/get-started" title="Get Started" />
          <NavigationItem href="/hooks" title="Hooks" />
        </List>
      </HStack>
    </HStack>
  )
}
