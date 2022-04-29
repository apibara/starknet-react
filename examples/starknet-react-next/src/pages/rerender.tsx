import { useStarknetBlock } from '@starknet-react/core'
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'

const Home: NextPage = () => {
  const renderCount = useRef(0)
  renderCount.current += 1

  const [blockCount, setBlockCount] = useState(0)

  const { data } = useStarknetBlock()

  useEffect(() => {
    setBlockCount((count) => count + 1)
  }, [data?.block_hash])

  return (
    <div>
      <h2>Rerender Repro</h2>
      <p>Render: {renderCount.current}</p>
      <p>Blocks: {blockCount}</p>
    </div>
  )
}

export default Home
