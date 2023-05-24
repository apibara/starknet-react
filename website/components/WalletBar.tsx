'use client'
import { Box, BoxProps, Button, ButtonProps, HStack, Text } from '@chakra-ui/react'
import { useAccount, useConnectors } from '@starknet-react/core'
import { useMemo } from 'react'

function WalletButton(props: ButtonProps) {
  return (
    <>
      <Button
        bg="transparent"
        borderColor="#fab387"
        borderWidth={1}
        borderRadius="5px"
        paddingLeft="10px"
        paddingTop="5px"
        paddingBottom="5px"
        paddingRight="10px"
        color="#cdd6f4"
        _hover={{ bg: '#fab387', color: '#1e1e2e' }}
        {...props}
      />
    </>
  )
}

function ConnectWallet() {
  const { connectors, connect } = useConnectors()

  return (
    <HStack marginBottom="10px" padding="3" w="full" justifyContent="space-between">
      <Text>Connect wallet</Text>
      <HStack gap="4">
        {connectors.map((conn) => (
          <WalletButton
            key={conn.id()}
            onClick={() => connect(conn)}
            isDisabled={!conn.available()}
          >
            {conn.id()}
          </WalletButton>
        ))}
      </HStack>
    </HStack>
  )
}

function WalletConnected() {
  const { address } = useAccount()
  const { disconnect } = useConnectors()

  const short = useMemo(() => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])

  return (
    <HStack w="full" justifyContent="space-between">
      <Text>Connected: {short}</Text>
      <WalletButton onClick={disconnect}>Disconnect</WalletButton>
    </HStack>
  )
}

export type WalletBarProps = BoxProps

export function WalletBar({ ...props }: WalletBarProps) {
  const { address } = useAccount()

  return <Box {...props}>{address ? <WalletConnected /> : <ConnectWallet />}</Box>
}
