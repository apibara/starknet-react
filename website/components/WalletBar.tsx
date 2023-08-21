import { useAccount, useConnectors } from '@starknet-react/core'

import { Button } from '../@/components/ui/button'

interface WalletButtonProps {
  isDisabled?: boolean
  key?: any
  onClick: () => void
  children: any
}

function WalletButton(props: WalletButtonProps) {
  return (
    <Button
      {...props}
      className="bg-transparent border-cat-peach border-2 hover:bg-cat-peach hover:text-cat-base"
    />
  )
}

function ConnectWallet() {
  const { connectors, connect } = useConnectors()

  return (
    <div className="flex w-full justify-between">
      <div>Connect wallet</div>
      <div className="gap-4 flex">
        {connectors.map((conn) => (
          <WalletButton key={conn.id} onClick={() => connect(conn)} isDisabled={!conn.available()}>
            {conn.id}
          </WalletButton>
        ))}
      </div>
    </div>
  )
}

function WalletConnected() {
  const { address } = useAccount()
  const { disconnect } = useConnectors()

  if (!address) return <div>{''}</div>
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <div className="justify-between flex">
      <div>Connected: {short}</div>
      <WalletButton onClick={disconnect}>Disconnect</WalletButton>
    </div>
  )
}

export function WalletBar() {
  const { address } = useAccount()

  return (
    <div className="w-full border-b-[1px] border-cat-overlay mb-[20px] pb-[10px]">
      {address ? <WalletConnected /> : <ConnectWallet />}
    </div>
  )
}
