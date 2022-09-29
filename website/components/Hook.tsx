import { useMemo } from 'react'
import { Function, TextLike } from '../lib/typedoc'
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

export const Hook = {
  Summary,
  Remarks,
  Example,
}
