'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { CodeBlock } from './CodeBlock'
import { Language } from 'prism-react-renderer'

const MarkdownComponents: object = {
  // @ts-ignore
  code({ node, className, inline: _inline, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const hasMeta = node?.data?.meta
    return match ? (
      <CodeBlock language={match[1] as Language} wrapLines={hasMeta ? true : false}>
        {children}
      </CodeBlock>
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
