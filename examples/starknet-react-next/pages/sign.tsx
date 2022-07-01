import type { NextPage } from 'next'
import { TypedData } from 'starknet/utils/typedData'
import { useSignTypedData, useStarknet } from '@starknet-react/core'
import { ConnectWallet } from '~/components/ConnectWallet'
import { useState } from 'react'

const Sign: NextPage = () => {
  const [message, setMessage] = useState('Hello, Bob!')

  const typedData: TypedData = {
    types: {
      StarkNetDomain: [
        { name: 'name', type: 'felt' },
        { name: 'version', type: 'felt' },
        { name: 'chainId', type: 'felt' },
      ],
      Person: [
        { name: 'name', type: 'felt' },
        { name: 'wallet', type: 'felt' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'felt' },
      ],
    },
    primaryType: 'Mail',
    domain: {
      name: 'StarkNet Mail',
      version: '1',
      chainId: 1,
    },
    message: {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: message,
    },
  }

  const { account } = useStarknet()
  const { data, error, signTypedData, reset } = useSignTypedData(typedData)

  return (
    <div>
      <ConnectWallet />
      <div>
        <p>{error && `error: ${error}`}</p>
        <p>{data && `data: ${data}`}</p>
      </div>
      {account && (
        <>
          <input type="text" value={message} onChange={(evt) => setMessage(evt.target.value)} />
          <input type="button" value="Sign Message" onClick={signTypedData} />
          <input type="button" value="Reset" onClick={reset} />
        </>
      )}
    </div>
  )
}

export default Sign
