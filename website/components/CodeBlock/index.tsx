'use client'
import { useBoolean } from '@chakra-ui/react'
import React, { useEffect, useMemo } from 'react'
import { useCodeTheme } from './styles'
import ReactLiveBlock from './live'
import { trimCode } from '../../lib/helpers/trimCode'

export function CodeBlock({
  language,
  children,
  filepath,
}: {
  language: string
  wrapLines: boolean
  children: string | string[]
  filepath?: string
}) {
  const [isMounted, { on }] = useBoolean()
  useEffect(on, [on])
  const theme = useCodeTheme()
  const code = useMemo(() => trimCode(children), [children])
  if (isMounted && language === 'tsx') {
    return <ReactLiveBlock filepath={filepath} language={language} code={code} theme={theme} />
  }

  return null
}
