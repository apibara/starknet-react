import React from 'react'
import ReactMarkdown from 'react-markdown'
import { PrismLight } from 'react-syntax-highlighter'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/prism/night-owl'

PrismLight.registerLanguage('tsx', tsx)
PrismLight.registerLanguage('typescript', typescript)

const MarkdownComponents: object = {
  // @ts-ignore
  code({ node, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const hasMeta = node?.data?.meta
    return match ? (
      <PrismLight
        language={match[1]}
        PreTag="div"
        style={nightOwl}
        className="codeStyle"
        showLineNumbers={false}
        wrapLines={hasMeta ? true : false}
        useInlineStyles={true}
        {...props}
      >
        {children}
      </PrismLight>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}
export function Markdown({ children }: { children: string }) {
  return <ReactMarkdown components={MarkdownComponents}>{children}</ReactMarkdown>
}
