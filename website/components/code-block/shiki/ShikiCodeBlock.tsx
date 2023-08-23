import { Lang, Theme } from 'shiki'
import { highlight } from '../../../lib/shiki'
import { ShikiCodeBlockClient } from './ShikiCodeBlockClient'

interface ShikiCodeBlockProps {
  code: string
  theme?: Theme
  language: Lang
  filepath?: string
}

type PartialLang = {
  [L in Lang]?: string
}
const languageText: PartialLang = {
  ts: 'TypeScript',
  js: 'JavaScript',
  bash: 'Bash',
}

export const ShikiCodeBlock = async ({ filepath, code, theme, language }: ShikiCodeBlockProps) => {
  const html = await highlight(code, theme, language)

  return (
    <ShikiCodeBlockClient
      filepath={filepath}
      languageText={languageText[language] as string}
      html={html}
      code={code}
    />
  )
}
