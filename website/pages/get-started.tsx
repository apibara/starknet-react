import { Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import { Layout } from '../components/Layout'
import { Markdown } from '../components/Markdown'
import { Section, SectionHeading } from '../components/Section'

const PROVIDER_IMPORT = `
\`\`\`ts
import { StarknetConfig, InjectedConnector } from '@starknet-react/core'
\`\`\`
`
const PROVIDER_NEXT = `
\`\`\`ts
function MyApp({ Component, pageProps }) {
  const connectors = [
    new InjectedConnector({ options: { id: 'braavos' }}),
    new InjectedConnector({ options: { id: 'argentX' }}),
  ]
  return (
    <StarknetConfig connectors={connectors}>
      <Component {...pageProps} />
    </StarknetConfig>
  )
}
\`\`\`
`

export default function GetStartedPage() {
  return (
    <Layout>
      <Head>
        <title>Get Started - StarkNet React</title>
      </Head>
      <Box maxW="70rem" mx="auto" pt="12" mb="20">
        <Heading fontSize="6xl" as="h1" textAlign="center">
          Get Started
        </Heading>
        <Heading mt="4" as="h2" color="cat.peach" fontSize="xl" textAlign="center">
          Start building StarkNet applications in less than a minute.
        </Heading>
        <Section>
          <SectionHeading>Installation</SectionHeading>
          <Text>Add `@starknet-react/core` using your favorite package manager.</Text>
          <Tabs colorScheme="whiteAlpha" variant="soft-rounded" mt="4">
            <TabList>
              <Tab>pnpm</Tab>
              <Tab>yarn</Tab>
              <Tab>npm</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Markdown>`pnpm add @starknet-react/core`</Markdown>
              </TabPanel>
              <TabPanel>
                <Markdown>`yarn add @starknet-react/core`</Markdown>
              </TabPanel>
              <TabPanel>
                <Markdown>`npm add @starknet-react/core`</Markdown>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Section>
        <Section>
          <SectionHeading>Usage with Next.js</SectionHeading>
          <Text>Start by adding the following import statement to your `_app.tsx` file.</Text>
          <Markdown>{PROVIDER_IMPORT}</Markdown>
          <Text>Then edit the application component to include the StarkNet provider.</Text>
          <Markdown>{PROVIDER_NEXT}</Markdown>
        </Section>
      </Box>
    </Layout>
  )
}
