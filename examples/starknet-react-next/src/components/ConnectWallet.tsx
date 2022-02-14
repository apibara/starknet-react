import { useStarknet } from '@starknet-react/core'

export function ConnectWallet() {
  const { account, connectBrowserWallet } = useStarknet()

  if (account) {
    return <p>Account: {account}</p>
  }

  return <button onClick={connectBrowserWallet}>Connect</button>
}
