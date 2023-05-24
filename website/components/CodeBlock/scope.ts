'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'
import * as StarkNetReactCore from '@starknet-react/core'
import compiledErc20 from './abi/compiledErc20.json'
import { shortString } from 'starknet'

const ethAddress = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
const txHash = '0x550088c7427d9734c801e7dd3a5e166d515276849034071ee87905510dbe3c6'
const txHash2 = '0x6dc047c47e23e079768b9ecfee2397f2b6c116f0b471ec3ae2118640f32c3f7'
const encodeShortString = shortString.encodeShortString

export const scope = {
  ...StarkNetReactCore,
  encodeShortString,
  useEffect,
  useState,
  useMemo,
  useCallback,
  compiledErc20,
  ethAddress,
  txHash,
  txHash2,
}
