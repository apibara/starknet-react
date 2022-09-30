import { useToken } from '@chakra-ui/react'
import React from 'react'

export function useLiveErrorStyle(): React.CSSProperties {
  const [background, color] = useToken('colors', ['cat.maroon', 'cat.base'])
  const [borderRadius] = useToken('radii', ['md'])

  return {
    fontSize: '14',
    padding: '8px',
    borderRadius,
    color,
    background,
    overflowX: 'auto',
  }
}
