import { useStarknet, useStarknetExecute } from '@starknet-react/core'
import { useState, useCallback, useMemo } from 'react'
import { toBN } from 'starknet/dist/utils/number'

export function DepositToken() {
  const { account } = useStarknet()
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState<string | undefined>()

  const tokenAddress = '0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10'
  const bankAddress = '0x0185a8709eedfd3da1a0d4a0739e649ddbe9433a4ca32f63de8824e52f078cda'

  const updateAmount = useCallback(
    (newAmount: string) => {
      // soft-validate amount
      setAmount(newAmount)
      try {
        toBN(newAmount)
        setAmountError(undefined)
      } catch (err) {
        console.error(err)
        setAmountError('Please input a valid number')
      }
    },
    [setAmount]
  )

  const calls = [
    {
      contractAddress: tokenAddress,
      entrypoint: 'approve',
      calldata: [toBN(bankAddress).toString(), amount, '0'],
    },
    {
      contractAddress: '0x0185a8709eedfd3da1a0d4a0739e649ddbe9433a4ca32f63de8824e52f078cda',
      entrypoint: 'deposit',
      calldata: [toBN(tokenAddress).toString(), amount, '0'],
    },
  ]

  const { loading, error, reset, execute } = useStarknetExecute({
    calls,
    metadata: {
      method: 'Approve and deposit',
      message: 'Approve and deposit tokens',
    },
  })

  const onDeposit = useCallback(() => {
    reset()
    if (account && !amountError) {
      execute()
    }
  }, [account, amount, amountError, execute, reset])

  const depositButtonDisabled = useMemo(() => {
    if (loading) return true
    return !account || !!amountError
  }, [loading, account, amountError])

  console.log(amount)

  return (
    <div>
      <h2>Deposit Tokens</h2>
      <p>
        <span>Amount: </span>
        <input type="number" onChange={(evt) => updateAmount(evt.target.value)} />
      </p>
      <button disabled={depositButtonDisabled} onClick={onDeposit}>
        {loading ? 'Waiting for wallet' : 'Deposit'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  )
}
