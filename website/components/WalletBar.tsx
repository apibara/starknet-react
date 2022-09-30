import { Box, BoxProps, Button, ButtonProps, HStack, Text } from '@chakra-ui/react'
import { useAccount, useConnectors } from '@starknet-react/core'
import { useMemo } from 'react'

function WalletButton(props: ButtonProps) {
  return (
    <Button
      bg="transparent"
      borderColor="cat.peach"
      borderWidth={1}
      color="cat.text"
      _hover={{ bg: 'cat.peach', color: 'cat.base' }}
      {...props}
    />
  )
}

function ConnectWallet() {
  const { connectors, connect } = useConnectors()

  return (
    <HStack w="full" justifyContent="space-between">
      <Text>Connect wallet</Text>
      <HStack gap="4">
        {connectors.map((conn) => (
          <WalletButton key={conn.id()} onClick={() => connect(conn)} disabled={!conn.available()}>
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
