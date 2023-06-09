'use client'
import parse from 'html-react-parser'

import Image, { StaticImageData } from 'next/image'
import { useClipboard, Button } from '@chakra-ui/react'

import copyIcon from '../../../public/copyIcon.png'
import ts from '../../../public/ts.png'
import js from '../../../public/js.png'
import bash from '../../../public/bash.png'

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

  const { onCopy } = useClipboard(code)

  const icon: Record<string, StaticImageData> = {
    JavaScript: js,
    TypeScript: ts,
    Bash: bash,
  }

  return (
    <div className="bg-cat-crust border-2 rounded-lg border-cat-surface">
      <div className="flex flex-row h-10 border-b-2 border-b-cat-surface rounded-t-lg justify-between pr-4 items-center">
        <div className="flex flex-row gap-1">
          {icon[languageText] && (
            <Image className="pl-2" alt="ts" src={icon[languageText]} width={30} height={20} />
          )}

          <div className="pl-4 text-sm">{filepath}</div>
        </div>
        <div className="flex flex-row gap-8">
          {languageText && <div className="text-cat-text text-sm">{languageText}</div>}
          <Button onClick={onCopy}>
            <Image alt="copy.svg" src={copyIcon} width={20} />
          </Button>
        </div>
      </div>
      <div className="p-4 rounded-b-lg  bg-cat-mantle overflow-x-scroll">{htmlCode}</div>
    </div>
  )
}
