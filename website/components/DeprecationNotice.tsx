'use client'
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'

import { Markdown } from './Markdown'

interface DeprecationNoticeProps {
  deprecation: string
}

export const DeprecationNotice = ({ deprecation }: DeprecationNoticeProps) => {
  return (
    <Alert
      mt="10px"
      maxW="30rem"
      mx="auto"
      status="warning"
      variant="subtle"
      flexDir="column"
      background="#fab387"
      rounded="10px"
      boxShadow="xl"
      color="#1e1e2e"
      padding="10px"
    >
      <AlertIcon color="#f97316" height={30} width={30} />
      <AlertTitle mt={4} mb={1} fontWeight="bold" fontSize="lg">
        Deprecation Notice
      </AlertTitle>
      <AlertDescription>
        <Markdown>{deprecation}</Markdown>
      </AlertDescription>
    </Alert>
  )
}
