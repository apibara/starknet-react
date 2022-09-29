import { Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React from 'react'
import { Layout } from '../components/Layout'
import { Markdown } from '../components/Markdown'
import { Section, SectionHeading } from '../components/Section'

const PROVIDER_CONFIG = `
\`\`\`tsx
import { StarknetConfig } from '@starknet-react/core'

function MyApp({ Component, pageProps }) {
  return (
    <StarknetConfig>
      <Component {...pageProps} />
    </StarknetConfig>
  )
}
\`\`\`
`

export default function GetStartedPage() {
  return (
    <Layout>
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
          <SectionHeading>Add provider</SectionHeading>
          <Text>Add the StarkNet root provider to your application.</Text>
          <Markdown>{PROVIDER_CONFIG}</Markdown>
        </Section>
      </Box>
    </Layout>
  )
}
