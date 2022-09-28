import { useMemo } from 'react'
import { Box, chakra, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { Function, TextLike, PropsType, ValueType } from '../lib/typedoc'

function Content({ content }: { content: TextLike[] }) {
  return (
    <>
      {content.map((c, i) => {
        if (c.kind === 'text') {
          return <chakra.span key={i}>{c.text}</chakra.span>
        }
        return (
          <chakra.span fontFamily="mono" key={i}>
            {c.text}
          </chakra.span>
        )
      })}
    </>
  )
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
