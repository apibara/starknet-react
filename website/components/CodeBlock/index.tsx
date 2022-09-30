import { useBoolean } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { PrismLight } from 'react-syntax-highlighter'

import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'

PrismLight.registerLanguage('tsx', tsx)
PrismLight.registerLanguage('typescript', typescript)

const ReactLiveBlock = dynamic(() => import('./live'))

export function CodeBlock({
  language,
  wrapLines,
  children,
}: {
  language: string
  wrapLines: boolean
  children: string | string[]
}) {
  const [isMounted, { on }] = useBoolean()
  useEffect(on, [on])

  if (isMounted && language === 'tsx') {
    return <ReactLiveBlock language={language} code={children} />
  }

  return (
    <PrismLight
      language={language}
      PreTag="div"
      style={catppuccinMochaStyle}
      className="codeStyle"
      showLineNumbers={false}
      wrapLines={wrapLines}
      useInlineStyles={true}
    >
      {children}
    </PrismLight>
  )
}

const colors = {
  base: '#cdd6f4',
  block: '#181825',
  comment: '#bac2de',
  punctuation: '#bac2de',
  property: '#f38ba8',
  selector: '#a6e3a1',
  operator: '#fab387',
  variable: '#f9e2af',
  function: '#f38ba8',
  keyword: '#74c7ec',
  selected: '#cdd6f4',
  inline: '#cdd6f4',
  inlineBackground: '#11111b',
  highlight: '#181825',
  highlightAccent: '#b4befe',
}

const catppuccinMochaStyle: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: colors.base,
    background: 'none',
    fontFamily: "\"Fira Code\", Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    background: colors.block,
    fontFamily: "\"Fira Code\", Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  ':not(pre) > code[class*="language-"]': {
    background: colors.inlineBackground,
    color: colors.inline,
    padding: '.1em',
    borderRadius: '.3em',
    whiteSpace: 'normal',
  },
  '.namespace': {
    opacity: 0.7,
  },
  comment: {
    color: colors.comment,
  },
  prolog: {
    color: colors.comment,
  },
  doctype: {
    color: colors.comment,
  },
  cdata: {
    color: colors.comment,
  },
  punctuation: {
    color: colors.punctuation,
  },
  property: {
    color: colors.property,
  },
  tag: {
    color: colors.property,
  },
  constant: {
    color: colors.property,
  },
  symbol: {
    color: colors.property,
  },
  deleted: {
    color: colors.property,
  },
  number: {
    color: colors.property,
  },
  boolean: {
    color: colors.property,
  },
  selector: {
    color: colors.selector,
  },
  'attr-name': {
    color: colors.selector,
  },
  string: {
    color: colors.selector,
  },
  char: {
    color: colors.selector,
  },
  builtin: {
    color: colors.selector,
  },
  inserted: {
    color: colors.selector,
  },
  operator: {
    color: colors.operator,
  },
  entity: {
    cursor: 'help',
  },
  url: {
    color: colors.operator,
  },
  '.language-css .token.string': {
    color: colors.operator,
  },
  '.style .token.string': {
    color: colors.operator,
  },
  variable: {
    color: colors.variable,
  },
  atrule: {
    color: colors.keyword,
  },
  'attr-value': {
    color: colors.keyword,
  },
  function: {
    color: colors.function,
  },
  keyword: {
    color: colors.keyword,
  },
  regex: {
    color: colors.variable,
  },
  important: {
    color: colors.variable,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
}
