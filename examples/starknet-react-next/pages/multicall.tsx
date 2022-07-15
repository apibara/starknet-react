import { useStarknet } from '@starknet-react/core'
import type { NextPage } from 'next'
import { ConnectWallet } from '~/components/ConnectWallet'
import { UserBalance } from './token'
import { TransactionList } from '~/components/TransactionList'
import { DepositToken } from '~/components/DepositToken'

const MulticallPage: NextPage = () => {
  const { account } = useStarknet()

  if (!account) {
    return (
      <div>
        <p>Connect Wallet</p>
        <ConnectWallet />
      </div>
    )
  }

  return (
    <div>
      <p>Connected: {account}</p>
      <UserBalance />
      <DepositToken />
      <TransactionList />
    </div>
  )
}

export default MulticallPage
