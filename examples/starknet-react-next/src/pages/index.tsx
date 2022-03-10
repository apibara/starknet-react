import { useStarknetCall } from '@starknet-react/core'
import type { NextPage } from 'next'
import { ConnectWallet } from '~/components/ConnectWallet'
import { IncrementCounter } from '~/components/IncrementCounter'
import { TransactionList } from '~/components/TransactionList'
import { useCounterContract } from '~/hooks/counter'

const Home: NextPage = () => {
  const { contract: counter } = useCounterContract()

  const { data: counterValue } = useStarknetCall({ contract: counter, method: 'counter', args: {} })

  return (
    <div>
      <h2>Wallet</h2>
      <ConnectWallet />
      <h2>Counter Contract</h2>
      <p>Address: {counter?.connectedTo}</p>
      <p>Value: {counterValue?.count}</p>
      <p>
        Count:{' '}
        {typeof counterValue?.count === 'string' && hexadecimalToDecimal(counterValue?.count)}
      </p>
      <IncrementCounter />
      <h2>Recent Transactions</h2>
      <TransactionList />
    </div>
  )
}

function hexadecimalToDecimal(hexString: string): number {
  return parseInt(hexString, 16)
}

export default Home
