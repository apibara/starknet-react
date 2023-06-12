'use client'
import React, { useMemo, useState } from 'react'
import { Box, Button, chakra, color, useClipboard, Text } from '@chakra-ui/react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import { scope } from './scope'
import { useLiveEditorStyle } from './styles'
import { WalletBar } from '../WalletBar'
import { InjectedConnector, StarknetConfig } from '@starknet-react/core'
import { SiReact } from 'react-icons/si'
import { IoMdCheckmark } from 'react-icons/io'
import { MdOutlineContentCopy } from 'react-icons/md'

const LiveCodePreview = chakra(LivePreview, {
  baseStyle: {
    overflow: 'auto',
  },
})

function EditableNotice() {
  return (
    <Box
      pos="absolute"
      top="40px"
      left="35%"
      w="full"
      textAlign="center"
      fontSize="small"
      color="#9399b2"
      marginTop="5px"
    >
      This example is editable
    </Box>
  )
}

export default function ReactLiveBlock({
  code,
  theme,
  filepath,
}: {
  language: string
  code: string
  theme?: any
  children?: React.ReactNode
  filepath?: string
}) {
  const [editorCode, setEditorCode] = useState(code)
  const onChange = (newCode: string) => setEditorCode(newCode.trim())
  const liveEditorStyle = useLiveEditorStyle()
  const connectors = useMemo(
    () =>
      shuffle([
        new InjectedConnector({ options: { id: 'argentX' } }),
        new InjectedConnector({ options: { id: 'braavos' } }),
      ]),
    []
  )
  const { hasCopied, onCopy } = useClipboard(code)

  return (
    <StarknetConfig connectors={connectors} autoConnect>
      <LiveProvider code={editorCode} scope={scope}>
        <Box
          mt="15"
          mb="30"
          p="20"
          borderColor="#fab387"
          borderWidth={1}
          borderRadius="10px"
          overflow="auto"
        >
          <WalletBar w="full" borderBottom="1px solid" borderColor="#9399b2" mb="20" pb="5" />
          <LiveCodePreview
            zIndex="1"
            __css={{
              button: {
                background: 'transparent',
                rounded: 'sm',
                borderColor: '#cdd6f4',
                borderWidth: 1,
                m: '3',
                p: '2',
              },
              span: { color: '#cdd6f4' },
              p: { color: '#cdd6f4', m: '3' },
            }}
          />
        </Box>
        <Box pos="relative" zIndex="0">
          <Box
            marginTop="10px"
            borderRadius="10px"
            borderWidth="2px"
            bg="#11111b"
            borderColor="#45475a"
            my="8"
          >
            <Box
              display="flex"
              flexDirection="row"
              height="40px"
              borderBottomWidth="2px"
              borderColor="#45475a"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="15px"
            >
              <Box alignItems="center" display="flex" flexDirection="row" gap="10px">
                <SiReact className="ml-2" />
                {filepath && <p className="text-sm">{filepath}</p>}
              </Box>
              <Box display="flex" flexDirection="row" gap="10">
                <Button onClick={onCopy}>
                  {hasCopied ? (
                    <IoMdCheckmark className="mr-4" />
                  ) : (
                    <MdOutlineContentCopy className="mr-4" />
                  )}
                </Button>
              </Box>
            </Box>

            <LiveEditor onChange={onChange} theme={theme} style={liveEditorStyle} />
          </Box>
          <EditableNotice />
        </Box>
        <LiveError
          style={{
            fontSize: '14',
            padding: '8px',
            borderRadius: '5px',
            color: '#1e1e2e',
            backgroundColor: '#eba0ac',
            overflowX: 'auto',
            marginTop: '20px',
          }}
        />
      </LiveProvider>
    </StarknetConfig>
  )
}

const shuffle = <T extends any[]>(arr: T): T => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
