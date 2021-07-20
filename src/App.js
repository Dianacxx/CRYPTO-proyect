import React, { useEffect } from 'react'
import './App.css'
import { ApolloClient } from '@apollo/client'
import { InMemoryCache } from '@apollo/client'
import { HttpLink } from '@apollo/client'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})

const DAI_QUERY = gql`
  query tokens ($tokenAddress: Bytes!) {
    tokens(where: { id: $tokenAddress} ) {
      derivedETH
      totalValueLocked
    }
  }
`

const ETH_PRICE_QUERY = gql`
  query bundles {
    bundles(where: { id: "1" }) {
      ethPriceUSD
    }
  }
`



function App() {
  const { loading: ethLoading, data: ethPriceData } = useQuery(ETH_PRICE_QUERY)
  const { loading: daiLoading, data: daiData } = useQuery(DAI_QUERY, {
    variables: {
      tokenAddress: '"0x6b175474e89094c44da98b954eedeac495271d0f"'
    }
  })

  const daiPriceInEth = daiData && daiData.tokens[0].derivedETH
  const daiTotalLiquidity = daiData && daiData.tokens[0].totalValueLocked
  const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPriceUSD

  return (
    <div>
    <div className ="token-price">
      Dai price:{' '}
      {ethLoading || daiLoading
        ? 'Loading token data...'
        : '$' +
          // parse responses as floats and fix to 2 decimals
          (parseFloat(daiPriceInEth) * parseFloat(ethPriceInUSD)).toFixed(2)}
    </div>
    <div className="token-liquidity ">
      Dai total liquidity:{' '}
      {daiLoading
        ? 'Loading token data...'
        : // display the total amount of DAI spread across all pools
          // parseFloat(daiTotalLiquidity).toFixed(0)
          daiTotalLiquidity
          }
    </div>
  </div>
  );
}

export default App;
