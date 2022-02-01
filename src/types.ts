export type Token = { symbol: string }

export type Pair = {
  reserveUSD: string
  token0: Token
  token1: Token
  totalSupply: string
  txCount: string
}

export type PairData = Pair[]