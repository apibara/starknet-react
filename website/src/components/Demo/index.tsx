import React, { useMemo } from 'react'
import { styled } from '@stitches/react'
import { Abi } from 'starknet'
import { toBN } from 'starknet/utils/number'
import {
  StarknetProvider,
  useContract,
  useStarknetBlock,
  useStarknetCall,
  useStarknetInvoke,
  useStarknetTransactionManager,
  Transaction,
  useStarknet,
  useConnectors,
  getInstalledInjectedConnectors,
} from '@starknet-react/core'

import CounterAbi from '../../abi/counter.json'

export const COUNTER_ADDRESS = '0x036486801b8f42e950824cba55b2df8cccb0af2497992f807a7e1d9abd2c6ba1'

const SectionRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

const Section = styled('div', {
  paddingBottom: '2rem',
})

const SectionTitle = styled('h3', {})
const ActionRoot = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '4rem',
  marginBottom: '2rem',
})

const Button = styled('button', {
  background: 'transparent',
  border: '1px solid var(--ifm-color-primary)',
  padding: '1rem',
  borderRadius: '10px',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.2)',
  },
})

function useCounterContract() {
  return useContract({ abi: CounterAbi as Abi, address: COUNTER_ADDRESS })
}

function DemoAccount() {
  const { account } = useStarknet()
  const { connect, disconnect, connectors } = useConnectors()

  return (
    <Section>
      <SectionTitle>Account</SectionTitle>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <Button onClick={disconnect}>Disconnect</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem' }}>
          {connectors.map((connector) =>
            connector.available() ? (
              <ActionRoot key={connector.id()}>
                <Button key={connector.id()} onClick={() => connect(connector)}>
                  Connect {connector.name()}
                </Button>
              </ActionRoot>
            ) : null
          )}
        </div>
      )}
    </Section>
  )
}

function DemoBlock() {
  const { data: block, error } = useStarknetBlock()

  const timestamp = useMemo(() => {
    if (!block?.timestamp) {
      return ''
    }

    // block.timestamp is supposed to be a number, but it's
    // a bigint. Convert back to number.
    const timestamp = Number(block.timestamp)
    return new Date(timestamp * 1000).toLocaleString()
  }, [block?.timestamp])

  return (
    <Section>
      <SectionTitle>Block Data</SectionTitle>
      {block ? (
        <div>
          <p>Block Hash: {block.block_hash}</p>
          <p>Block Timestamp: {timestamp}</p>
        </div>
      ) : error ? (
        <p>'Error loading block data'</p>
      ) : (
        <p>'Loading'</p>
      )}
    </Section>
  )
}

function DemoContractCall() {
  const { contract } = useCounterContract()
  const { data: counter, error } = useStarknetCall({
    contract,
    method: 'counter',
    args: [],
  })

  return (
    <Section>
      <SectionTitle>Contract Call</SectionTitle>
      {counter ? (
        <div>
          <p>Counter Value: {toBN(counter[0]).toString()}</p>
        </div>
      ) : error ? (
        <p>'Error loading counter'</p>
      ) : (
        <p>'Loading'</p>
      )}
    </Section>
  )
}

function DemoContractInvoke() {
  const { contract } = useCounterContract()
  // Use type parameter to enforce type and number of arguments
  const { data, loading, error, reset, invoke } = useStarknetInvoke<[string]>({
    contract,
    method: 'incrementCounter',
  })

  return (
    <Section>
      <SectionTitle>Invoke Contract Method</SectionTitle>
      <div>
        {data && (
          <div>
            <p>Transaction Hash: {data}</p>
          </div>
        )}
      </div>
      <div>
        <p>Submitting: {loading ? 'Submitting' : 'Not Submitting'}</p>
        <p>Error: {error || 'No error'}</p>
      </div>
      <ActionRoot>
        <Button onClick={() => invoke({ args: ['0x1'] })}>Invoke Method</Button>
        <Button onClick={() => reset()}>Reset State</Button>
      </ActionRoot>
    </Section>
  )
}

function TransactionItem({
  transaction,
  onClick,
}: {
  transaction: Transaction
  onClick: () => void
}) {
  return (
    <div>
      {transaction.status}: {transaction.transactionHash} <button onClick={onClick}>remove</button>
    </div>
  )
}

function DemoTransactionManager() {
  const { transactions, removeTransaction } = useStarknetTransactionManager()
  return (
    <Section>
      <SectionTitle>Transaction Manager</SectionTitle>
      <div>
        {transactions.length === 0
          ? 'No transactions'
          : transactions.map((tx, index) => (
              <TransactionItem
                key={index}
                transaction={tx}
                onClick={() => removeTransaction(tx.transactionHash)}
              />
            ))}
      </div>
    </Section>
  )
}

function DemoInner() {
  return (
    <SectionRoot>
      <DemoAccount />
      <DemoBlock />
      <DemoContractCall />
      <DemoContractInvoke />
      <DemoTransactionManager />
    </SectionRoot>
  )
}

export function Demo(): JSX.Element {
  const connectors = getInstalledInjectedConnectors()

  return (
    <StarknetProvider autoConnect connectors={connectors}>
      <DemoInner />
    </StarknetProvider>
  )
}
