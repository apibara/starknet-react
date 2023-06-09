import HookSection from '../../components/HookSection'
import { Markdown } from '../../components/Markdown'
import SectionHeading from '../../components/SectionHeading'
import Image from 'next/image'

import approuter from '../../public/approuter.png'
import clientserver from '../../public/clientservercomparison.png'

const CLIENT_COMPONENT = `
\`\`\`js
// NOTE: *before* Server Components

import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function NoteWithMarkdown({text}) {
  const html = sanitizeHtml(marked(text));
  return (/* render */);
}

\`\`\`
`
const SERVER_COMPONENT = `
\`\`\`js
// Server Component === zero bundle size

import marked from 'marked'; // zero bundle size
import sanitizeHtml from 'sanitize-html'; // zero bundle size

function NoteWithMarkdown({text}) {
  // same as before
}

\`\`\`
`

const DATABASE_ACCESS = `
\`\`\`js
import db from 'db';

async function Note({id}) {
  const note = await db.notes.get(id);
  return <NoteWithMarkdown note={note} />;
}
\`\`\`
`

const CLIENT_COMPONENT_CHILDREN = `
\`\`\`ts
'use client';
 
import { useState } from 'react';
 
export default function ExampleClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);
 
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
 
      {children}
    </>
  );
}
\`\`\`
`

const PAGE_PATTERN = `
\`\`\`js
// This pattern works:
// You can pass a Server Component as a child or prop of a
// Client Component.
import ExampleClientComponent from './example-client-component';
import ExampleServerComponent from './example-server-component';
 
// Pages in Next.js are Server Components by default
export default function Page() {
  return (
    <ExampleClientComponent>
      <ExampleServerComponent />
    </ExampleClientComponent>
  );
}
\`\`\`
`

const ROOT_LAYOUT = `
\`\`\`ts
export const metadata = {
  title: 'Next.js Tutorial',
  description: 'A Next.js tutorial using the App Router',
};
 
async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={'en'}>
      <body>{children}</body>
    </html>
  );
}
 
export default RootLayout;
\`\`\`
`

const RSC = () => {
  return (
    <div className="max-w-70 pt-12 mb-12 ">
      <div className="text-5xl text-center text-cat-text">React server components</div>
      <div className="mt-4 text-cat-peach text-xl text-center">
        Render React components on the server
      </div>
      <HookSection>
        <SectionHeading>Intro</SectionHeading>
        <div className="mt-10 text-cat-text text-center md:text-left lg:text-center ">
          React Server components are introduced with React version 18 and are adopted in Next.js 13
          App folder. With React server components we can now render components both on the server
          and on the client.
        </div>
        <SectionHeading>Motivation</SectionHeading>
        <div className="text-xl text-cat-peach text-center">Zero-Bundle-Size components</div>
        <div className="text-cat-text mt-5 text-center md:text-left lg:text-center ">
          Developers constantly have to make choices about using third-party packages. Using a
          package to render some markdown or format a date is convenient for us as developers, but
          it increases code size and hurts performance for our users.
        </div>
        <div className="text-cat-text mt-5">
          <Markdown filepath="app/rsc/page.tsx" theme="dracula" shiki>
            {CLIENT_COMPONENT}
          </Markdown>
          <div className="mt-5 text-center md:text-left lg:text-center ">
            NOTE: With Next.13 App directory all components are by default server components so if
            we want our component to be rendered on the client we have to use <b>use client</b>
            directive on top on the file before any import
          </div>
        </div>
        <div className="text-cat-text mt-5">
          <div className="text-cat-text mt-5 text-center md:text-left lg:text-center ">
            Server Components allow developers to render static content on the server or during the
            build, taking full advantage of React’s component-oriented model and freely using
            third-party packages while incurring zero impact on bundle size.
          </div>
          <Markdown filepath="app/rsc/page.tsx" theme="dracula" shiki>
            {SERVER_COMPONENT}
          </Markdown>
        </div>
        <div className="text-xl text-cat-peach text-center mt-5">Full Access to the Backend</div>
        <div className="text-cat-text mt-5 mb-5">
          <Markdown filepath="app/rsc/page.tsx" theme="dracula" shiki>
            {DATABASE_ACCESS}
          </Markdown>
        </div>
        <SectionHeading>Usage</SectionHeading>
        <div className="text-xl text-cat-peach text-center">Writing code</div>
        <div className="text-cat-text mt-5 mb-5">
          <p>- Server components cannot use browser-only APIs</p>
          <br />
          <p>- Server components cannot use React hooks</p>
          <br />
          <p className="mb-5"> - Server components cannot use Context</p>
          <div className="text-center md:text-left lg:text-center">
            React Server Components are useful for rendering the skeleton of a page, while leaving
            the interactive bits to the so-called <b>client components</b>.
          </div>
        </div>
        <Image alt="client-server.png" src={clientserver} width={700} height={350} />
        <div className="text-cat-text mt-5 text-center md:text-left lg:text-center ">
          Server components <b>can import client components.</b>
        </div>
        <div className="text-cat-peach text-center mt-5  ">
          Passing Server components to Client components as Props
        </div>
        <div className="text-cat-text mt-5 text-center md:text-left lg:text-center">
          Instead, when designing Client Components you can use React props to mark <b>holes</b> for
          Server Components. The Server Component will be rendered on the server, and when the
          Client Component is rendered on the client, the <b>hole</b> will be filled in with the
          rendered result of the Server Component.
        </div>
        <div className="text-cat-text mt-5 text-center md:text-left lg:text-center ">
          A common pattern is to use the React children prop to create the <b>hole</b>.
        </div>
        <div className="text-cat-text mt-5">
          <Markdown filepath="app/rsc/page.tsx" theme="dracula" shiki>
            {CLIENT_COMPONENT_CHILDREN}
          </Markdown>
        </div>
        <div className="text-cat-text mt-5 mb-5">
          <Markdown filepath="app/rsc/page.tsx" theme="dracula" shiki>
            {PAGE_PATTERN}
          </Markdown>
        </div>
        <SectionHeading>Folders and Files</SectionHeading>
        <div className="text-xl text-cat-peach text-center mt-5">App Router</div>
        <div className="text-cat-text mt-5 mb-5 text-center md:text-left lg:text-center ">
          Folders are used to define routes. A route is a single path of nested folders, following
          the hierarchy from the root folder down to a final leaf folder that includes a page.js
          file.
        </div>
        <Image src={approuter} alt="approuter.png" width={700} height={350} />
        <br />
        <SectionHeading>Layouts</SectionHeading>
        <div className="text-cat-text mt-5 text-center md:text-left lg:text-center ">
          Layouts are one of the biggest new functionality made possible by the new App Router.
        </div>
        <div className="text-cat-text mt-5 text-center md:text-left lg:text-center ">
          Next.js <b>needs one root layout component</b>
        </div>
        <div className="text-cat-text mt-5 text-center md:text-left lg:text-center ">
          Layouts are defined using the convention layout.tsx in the app directory: Next.js will
          automatically wrap all pages within the folder where the layout is defined.
        </div>
        <div className="text-cat-text mt-5 ">
          <Markdown filepath="app/rsc/page.tsx" theme="dracula" shiki>
            {ROOT_LAYOUT}
          </Markdown>
        </div>
      </HookSection>
    </div>
  )
}

export default RSC
