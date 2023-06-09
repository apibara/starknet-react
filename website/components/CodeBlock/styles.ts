'use client'
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

export function useLiveEditorStyle(): React.CSSProperties {
  const [mono] = useToken('fonts', [`'Iosevka', monospace`])
  return {
    fontSize: '14',
    fontFamily: mono,
  }
}

export function useCodeTheme(): any {
  const [text, background, comment] = useToken('colors', ['cat.text', 'cat.mantle', 'cat.overlay'])
  return {
    plain: {
      color: text,
      backgroundColor: background,
    },
    styles: [
      {
        types: ['variable'],
        style: {
          color: 'rgb(242, 205, 205)',
        },
      },
      {
        types: ['function'],
        style: {
          color: 'rgb(137, 180, 250)',
        },
      },
      {
        types: ['builtin'],
        style: {
          color: 'rgb(205, 214, 244)',
        },
      },
      {
        types: ['number', 'constant', 'changed', 'namespace', 'class-name'],
        style: {
          color: 'rgb(250, 179, 135)',
        },
      },
      {
        types: ['keyword', 'selector'],
        style: {
          color: 'rgb(243, 139, 168)',
        },
      },
      {
        types: ['punctuation'],
        style: {
          color: 'rgb(127, 132, 156)',
        },
      },
      {
        types: ['operator', 'symbol'],
        style: {
          color: 'rgb(137, 220, 235)',
        },
      },
      {
        types: ['inserted'],
        style: {
          color: 'rgb(166, 227, 161)',
        },
      },
      {
        types: ['deleted'],
        style: {
          color: 'rgb(148, 226, 213)',
        },
      },
      {
        types: ['string'],
        style: {
          color: 'rgb(166, 227, 161)',
        },
      },
      {
        types: ['char'],
        style: {
          color: 'rgb(249, 226, 175)',
        },
      },
      {
        types: ['tag'],
        style: {
          color: 'rgb(203, 166, 247)',
        },
      },
      {
        types: ['attr-name'],
        style: {
          color: 'rgb(137, 180, 250)',
        },
      },
      {
        types: ['comment'],
        style: {
          color: comment,
        },
      },
    ],
  }
}
