import { useBlock } from '@starknet-react/core'
import WalletBar from './components/WalletBar'

function App() {
  const { data, isLoading, isError } = useBlock({
    refetchInterval: 3000,
    blockIdentifier: 'latest',
  })

  return (
    <main>
      <p>
        Get started by editing&nbsp;
        <code>pages/index.tsx</code>
      </p>
      <div>
        {isLoading
          ? 'Loading...'
          : isError
          ? 'Error while fetching the latest block hash'
          : `Latest block hash: ${data?.block_hash}`}
      </div>
      <WalletBar />
    </main>
  )
}

export default App
