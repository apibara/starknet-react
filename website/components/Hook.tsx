import { useMemo } from 'react'
import { Box, chakra, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { Function, TextLike, PropsType, ValueType } from '../lib/typedoc'
import { PrismLight } from 'react-syntax-highlighter'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/prism/night-owl'
import ReactMarkdown from 'react-markdown'

PrismLight.registerLanguage('tsx', tsx)
PrismLight.registerLanguage('typescript', typescript)

const MarkdownComponents: object = {
  // @ts-ignore
  code({ node, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const hasMeta = node?.data?.meta
    return match ? (
      <PrismLight
        language={match[1]}
        PreTag="div"
        style={nightOwl}
        className="codeStyle"
        showLineNumbers={false}
        wrapLines={hasMeta ? true : false}
        useInlineStyles={true}
        {...props}
      >
        {children}
      </PrismLight>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}
function Content({ content }: { content: TextLike[] }) {
  const textContent = useMemo(() => {
    return content.map((c) => c.text).join('')
  }, [content])

  return <ReactMarkdown components={MarkdownComponents}>{textContent}</ReactMarkdown>
}

function Summary({ hook }: { hook: Function }) {
  const summary = useMemo(() => {
    return hook.signatures[0]?.comment?.summary ?? []
  }, [hook])

  return <Content content={summary} />
}

function Remarks({ hook }: { hook: Function }) {
  const remarks = useMemo(() => {
    const tags = hook.signatures[0]?.comment.blockTags
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
    const tags = hook.signatures[0]?.comment.blockTags
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

function TypeTable({ props }: { props: ValueType }) {
  return (
    <Box mb="4">
      <Text fontWeight="bold" fontSize="lg" mb="2">
        {props.name}
      </Text>
      <Text mb="2">
        <Content content={props.comment.summary} />
      </Text>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.properties.map((prop) => (
            <Tr key={prop.name}>
              <Td>{prop.name}</Td>
              <Td>
                <chakra.span color="cat.peach" fontFamily="mono">
                  {prop.type.name}
                </chakra.span>
              </Td>
              <Td>{prop.comment && <Content content={prop.comment.summary} />}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

function Value({ value }: { value?: ValueType }) {
  if (!value) {
    return <Text>This hook has no return value.</Text>
  }
  return <TypeTable props={value} />
}

function Props({ props }: { props?: PropsType }) {
  if (!props) {
    return <Text>This hook has no props.</Text>
  }

  return <TypeTable props={props} />
}

export const Hook = {
  Summary,
  Remarks,
  Example,
  Props,
  Value,
}
