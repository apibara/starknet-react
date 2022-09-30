import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'
import { useMemo } from 'react'
import { deprecationTag, Function, TextLike } from '../lib/typedoc'
import { Markdown } from './Markdown'

function Content({ content }: { content: TextLike[] }) {
  const textContent = useMemo(() => {
    return content.map((c) => c.text).join('')
  }, [content])

  return <Markdown>{textContent}</Markdown>
}

function Summary({ hook }: { hook: Function }) {
  const summary = useMemo(() => {
    return hook.signatures[0]?.comment?.summary ?? []
  }, [hook])

  return <Content content={summary} />
}

function Remarks({ hook }: { hook: Function }) {
  const remarks = useMemo(() => {
    const tags = hook.signatures[0]?.comment?.blockTags
    if (!tags) return undefined
    return tags.find((t) => t.tag === '@remarks')
  }, [hook])

  if (!remarks) {
    return <></>
  }

  return <Content content={remarks.content} />
}

function Example({ hook }: { hook: Function }) {
  const examples = useMemo(() => {
    const tags = hook.signatures[0]?.comment?.blockTags
    if (!tags) return []
    return tags.filter((t) => t.tag === '@example')
  }, [hook])

  return (
    <>
      {examples.map((example, i) => (
        <Content content={example.content} key={i} />
      ))}
    </>
  )
}

function Deprecation({ hook }: { hook: Function }) {
  // convert to string, before that replace @link with link to page
  const deprecation = useMemo(() => {
    const tag = deprecationTag(hook)
    if (!tag) return undefined
    return tag.content
      .map((t) => {
        if (t.kind === 'inline-tag') {
          return `[${t.text}](/hooks/${t.text})`
        }
        return t.text
      })
      .join('')
  }, [hook])

  if (!deprecation) return <></>

  return (
    <Alert
      mt={8}
      maxW="30rem"
      mx="auto"
      status="warning"
      variant="subtle"
      flexDir="column"
      background="cat.peach"
      rounded="md"
      boxShadow="xl"
      color="cat.base"
    >
      <AlertIcon boxSize={10} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Deprecation Notice
      </AlertTitle>
      <AlertDescription>
        <Markdown>{deprecation}</Markdown>
      </AlertDescription>
    </Alert>
  )
}

export const Hook = {
  Summary,
  Remarks,
  Example,
  Deprecation,
}
