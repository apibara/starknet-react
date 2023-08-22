import { Markdown } from './Markdown'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { FaExclamationCircle } from 'react-icons/fa'

interface DeprecationNoticeProps {
  deprecation: string
}

export const DeprecationNotice = ({ deprecation }: DeprecationNoticeProps) => {
  return (
    <Card className="max-w-[480px] mx-auto flex-col bg-cat-peach mt-[10px] rounded-xl p-[10px] flex text-center">
      <CardHeader className="p-0">
        <CardTitle className="flex justify-center mb-[5px] ">
          <FaExclamationCircle size={30} className="text-cat-orangeWarning " />
        </CardTitle>
        <CardDescription className="text-md font-bold text-cat-base">
          Deprecation Notice
        </CardDescription>
      </CardHeader>
      <CardContent className="text-md  text-cat-base">
        <Markdown>{deprecation}</Markdown>
      </CardContent>
    </Card>
  )
}
