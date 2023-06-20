import { z } from 'zod'

export const uint256Schema = z.object({
  low: z.bigint(),
  high: z.bigint(),
})

export const decimalsSchema = z.object({
  decimals: z.bigint(),
})

export const symbolSchema = z.object({
  symbol: z.bigint(),
})

export const balanceSchema = z.object({
  balance: uint256Schema,
})
