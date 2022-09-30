import { useBoolean, Box } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo } from 'react'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import { useCodeTheme } from './styles'

const ReactLiveBlock = dynamic(() => import('./live'))

export function CodeBlock({
  language,
  children,
}: {
  language: Language
  wrapLines: boolean
  children: string | string[]
}) {
  const [isMounted, { on }] = useBoolean()
  useEffect(on, [on])
  const theme = useCodeTheme()
  const code = useMemo(() => trimCode(children), [children])

  if (isMounted && language === 'tsx') {
    return <ReactLiveBlock language={language} code={code} theme={theme} />
  }

  return (
    <Box p="5" rounded="md" my="2" bg="cat.mantle">
      <Highlight {...defaultProps} code={code} language={language} theme={theme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Box>
  )
}

function trimCode(code: string | string[]): string {
  const s = Array.isArray(code) ? code.join('\n') : code
  return s.trim()
}
