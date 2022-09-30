import React, { useMemo, useState } from 'react'
import { Box, chakra } from '@chakra-ui/react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import { scope } from './scope'
import { useLiveErrorStyle } from './styles'
import { WalletBar } from '../WalletBar'
import { InjectedConnector, StarknetConfig } from '@starknet-react/core'

const LiveCodePreview = chakra(LivePreview, {
  baseStyle: {
    overflow: 'auto',
  },
})

function EditableNotice() {
  return (
    <Box
      pos="absolute"
      top=".25rem"
      w="full"
      textAlign="center"
      fontSize="small"
      color="cat.overlay"
    >
      This example is editable
    </Box>
  )
}

export default function ReactLiveBlock({
  code,
}: {
  language: string
  code: string | string[]
  theme?: { [key: string]: React.CSSProperties }
}) {
  const trimmedCode = trimCode(code)
  const [editorCode, setEditorCode] = useState(trimmedCode)
  const onChange = (newCode: string) => setEditorCode(newCode.trim())
  const liveErrorStyle = useLiveErrorStyle()
  const connectors = useMemo(
    () =>
      shuffle([
        new InjectedConnector({ options: { id: 'argentX' } }),
        new InjectedConnector({ options: { id: 'braavos' } }),
      ]),
    []
  )

  return (
    <StarknetConfig connectors={connectors}>
      <LiveProvider code={editorCode} scope={scope}>
        <Box mt="5" p="4" borderColor="cat.peach" borderWidth={1} rounded="md" overflow="auto">
          <WalletBar w="full" borderBottom="1px solid" borderColor="cat.overlay" mb="4" pb="4" />
          <LiveCodePreview zIndex="1" />
        </Box>
        <Box pos="relative" zIndex="0">
          <Box p="5" pt="7" rounded="md" my="8" bg="cat.crust">
            <LiveEditor onChange={onChange} />
          </Box>
          <EditableNotice />
        </Box>
        <LiveError style={liveErrorStyle} />
      </LiveProvider>
    </StarknetConfig>
  )
}

function trimCode(code: string | string[]): string {
  const s = Array.isArray(code) ? code.join('\n') : code
  return s.trim()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffle = <T extends any[]>(arr: T): T => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
