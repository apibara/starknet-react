import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Function, getAllHooks } from '../../lib/typedoc'
import { Layout } from '../../components/Layout'
import { Box, Heading } from '@chakra-ui/react'
import { Hook } from '../../components/Hook'
import { Section, SectionHeading } from '../../components/Section'

export default function HookPage({ hook }: { hook: Function }) {
  return (
    <Layout>
      <Box maxW="70rem" mx="auto" pt="12" mb="20">
        <Heading fontSize="6xl" as="h1" textAlign="center">
          {hook.name}
        </Heading>
        <Heading mt="4" as="h2" color="cat.peach" fontSize="xl" textAlign="center">
          <Hook.Summary hook={hook} />
        </Heading>
        <Section>
          <Hook.Remarks hook={hook} />
        </Section>
        <Section>
          <SectionHeading>Examples</SectionHeading>
          <Hook.Example hook={hook} />
        </Section>
      </Box>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const hooks = getAllHooks()
  return {
    paths: hooks.map((h) => ({
      params: {
        name: h.name,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = ({ params }) => {
  const hook = getAllHooks().find((h) => h.name == params?.name)
  if (!hook) {
    return {
      notFound: true,
    }
  }

  return {
    props: { hook },
  }
}
