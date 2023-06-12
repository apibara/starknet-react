'use client'
import parse from 'html-react-parser'

import { useClipboard, Button } from '@chakra-ui/react'
import { MdOutlineContentCopy } from 'react-icons/md'
import { IoMdCheckmark } from 'react-icons/io'
import { SiJavascript, SiTypescript, SiGnubash } from 'react-icons/si'

interface ShikiCodeBlockClientProps {
  html: string
  languageText: string
  code: string
  filepath?: string
}

export const ShikiCodeBlockClient = ({
  html,
  languageText,
  code,
  filepath,
}: ShikiCodeBlockClientProps) => {
  const htmlCode = parse(html)

  const { hasCopied, onCopy } = useClipboard(code)

  const Icon: Record<string, React.ReactNode> = {
    JavaScript: <SiJavascript />,
    TypeScript: <SiTypescript />,
    Bash: <SiGnubash />,
  }

  return (
    <div className="bg-cat-crust border-2 rounded-lg border-cat-surface">
      <div className="flex flex-row h-10 border-b-2 border-b-cat-surface rounded-t-lg justify-between pr-4 items-center">
        <div className="flex flex-row gap-1 ml-2 items-center">
          {Icon[languageText] && Icon[languageText]}
          <div className="pl-4 text-sm">{filepath}</div>
        </div>
        <div className="flex flex-row gap-8">
          {languageText && <div className="text-cat-text text-sm">{languageText}</div>}
          <Button onClick={onCopy}>
            {hasCopied ? <IoMdCheckmark /> : <MdOutlineContentCopy />}
          </Button>
        </div>
      </div>
      <div className="p-4 rounded-b-lg  bg-cat-mantle overflow-x-scroll">{htmlCode}</div>
    </div>
  )
}
