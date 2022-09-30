import React, { useMemo, useState } from 'react'
import { Box, chakra } from '@chakra-ui/react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import { scope } from './scope'
import { useLiveEditorStyle, useLiveErrorStyle } from './styles'
import { WalletBar } from '../WalletBar'
import { InjectedConnector, StarknetConfig } from '@starknet-react/core'
import { PrismTheme } from 'prism-react-renderer'

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
  theme,
}: {
  language: string
  code: string
  theme?: PrismTheme
}) {
  const [editorCode, setEditorCode] = useState(code)
  const onChange = (newCode: string) => setEditorCode(newCode.trim())
  const liveErrorStyle = useLiveErrorStyle()
  const liveEditorStyle = useLiveEditorStyle()
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
          <LiveCodePreview
            zIndex="1"
            __css={{
              button: {
                background: 'transparent',
                rounded: 'sm',
                borderColor: 'cat.text',
                borderWidth: 1,
                m: '3',
                p: '2',
              },
              span: { color: 'cat.text' },
              p: { color: 'cat.text', m: '3' },
            }}
          />
        </Box>
        <Box pos="relative" zIndex="0">
          <Box p="5" pt="7" rounded="md" my="8" bg="cat.mantle">
            <LiveEditor onChange={onChange} theme={theme} style={liveEditorStyle} />
          </Box>
          <EditableNotice />
        </Box>
        <LiveError style={liveErrorStyle} />
      </LiveProvider>
    </StarknetConfig>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffle = <T extends any[]>(arr: T): T => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
