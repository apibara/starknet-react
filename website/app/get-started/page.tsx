import Tabs from '../../components/Tabs'

import HookSection from '../../components/HookSection'
import SectionHeading from '../../components/SectionHeading'
import { Markdown } from '../../components/Markdown'

const CREATE_STARKNET_HELP = `
  \`\`\`bash
  Usage: create-starknet [project-directory] [options]

  Create starknet apps with one command

  Options:
    -V, --version          output the version number
    -t, --template <name>  Explicitly tell the CLI to bootstrap the app using the specified template (choices: "next", "vite")
    --use-npm              Explicitly tell the CLI to bootstrap the app using npm
    --use-yarn             Explicitly tell the CLI to bootstrap the app using yarn
    --use-pnpm             Explicitly tell the CLI to bootstrap the app using pnpm
    -h, --help             display help for command
  \`\`\`
`

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

export default function Home() {
  return (
    <div className="max-w-70 pt-12 mb-12 mx-4 lg:mx-0">
      <div className="text-6xl text-center text-cat-text">Get Started</div>
      <div className="mt-4 text-cat-peach text-xl text-center">
        Start building Starknet applications in less than a minute.
      </div>
      <HookSection>
        <SectionHeading>Quick Setup</SectionHeading>
        <div className="mt-10 text-cat-text md:text-left lg:text-center">
          We recommend creating a new starknet-react app using create-starknet, which sets up a
          starknet app using TypeScript automatically for you. To create a project, run:
        </div>
        <Tabs isManual={false} />
        <div className="mt-4 text-cat-text md:text-left lg:text-center">
          You can also pass command line arguments to set up a new project non-interactively. See
          create-starknet --help:
        </div>
        <div className="text-cat-text mt-4 ">
          <Markdown shiki theme="dracula" filepath="app/get-started/page.tsx">
            {CREATE_STARKNET_HELP}
          </Markdown>
        </div>
      </HookSection>
      <HookSection>
        <SectionHeading>Manual setup</SectionHeading>
        <div className="mt-10 text-cat-text text-3xl ">Installation</div>
        <div className=" text-cat-text mt-3">
          Add `@starknet-react/core` using your favorite package manager.
        </div>
        <Tabs isManual />
        <div className="text-3xl mt-10 text-cat-text">Usage with Next.js</div>
        <div className="mt-4 text-cat-text">
          Start by adding the following import statement to your `_app.tsx` file.
        </div>
        <div className="  text-cat-text mt-4">
          <Markdown shiki theme="dracula" filepath="app/get-started/page.tsx">
            {PROVIDER_IMPORT}
          </Markdown>
        </div>
        <div className="mt-4 text-cat-text">
          Then edit the application component to include the Starknet provider.
        </div>
        <div className="  text-cat-text mt-4">
          <Markdown shiki theme="dracula" filepath="app/get-started/page.tsx">
            {PROVIDER_NEXT}
          </Markdown>
        </div>
      </HookSection>
    </div>
  )
}
