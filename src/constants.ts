export const GRAPHQL_API = 'http://graph3.defikingdoms.com/subgraphs/name/defikingdoms/dex'

export const GET_PAIRS = `
  query getPairs($first: Int!, $orderBy:Pair_orderBy, $orderDirection:OrderDirection) {
    pairs(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      totalSupply
      txCount
      reserveUSD
      volumeUSD
    }
  }
`

export const SORT_BY_OPTIONS = [
  { value: 'reserveUSD', label: 'Reserve USD' },
  { value: 'volumeUSD', label: 'Volume USD' },
  { value: 'totalSupply',  label: 'Total Supply' },
  { value: 'txCount',  label: 'Transaction Count' },
] as any

