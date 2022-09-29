import React, { useMemo } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Function, getAllHooks, hookProps, hookValue } from '../../lib/typedoc'
import { Layout } from '../../components/Layout'
import { Box, Heading, Text } from '@chakra-ui/react'
import { Hook } from '../../components/Hook'
import { Section, SectionHeading } from '../../components/Section'

export default function HookPage({ hook }: { hook: Function }) {
  const props = useMemo(() => {
    return hookProps(hook)
  }, [hook])

  const value = useMemo(() => {
    return hookValue(hook)
  }, [hook])

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
          <Text>
            <Hook.Remarks hook={hook} />
          </Text>
        </Section>
        <Section>
          <SectionHeading>Examples</SectionHeading>
          <Hook.Example hook={hook} />
        </Section>
        <Section>
          <SectionHeading>Props</SectionHeading>
          {props.length > 0 ? (
            props.map((prop) => <Hook.Props props={prop} key={prop.name} />)
          ) : (
            <Text>This hook has no props</Text>
          )}
        </Section>
        <Section>
          <SectionHeading>Return Value</SectionHeading>
          {value.length > 0 ? (
            value.map((value) => <Hook.Value value={value} key={value.name} />)
          ) : (
            <Text>This hook has no return value</Text>
          )}
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
