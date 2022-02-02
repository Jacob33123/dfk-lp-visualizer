import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'
import { GRAPHQL_API, GET_PAIRS, SORT_BY_OPTIONS } from './constants'
import { Pair, PairData } from './types'
import { AutosizeChart } from './AutosizeChart'
import _ from 'lodash'
import { BallTriangle } from 'react-loader-spinner';
import Select, { ActionMeta } from 'react-select'

export const App: React.VFC = () => {
  const [pairData, setPairData] = useState()
  const [sortBy, setSortBy] = useState('reserveUSD')
  const [numPools, setNumPools] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    const fetchPairData = async () => {
      setIsLoading(true)
      const queryResult = await axios.post (
        GRAPHQL_API, {
          query: GET_PAIRS,
          variables: {
            first: numPools,
            orderBy: sortBy, 
            orderDirection: 'desc'
          }
        }
      )
  
      const result = queryResult.data.data
      setIsLoading(false)
      
      if (result?.pairs?.length) {
        setPairData(result.pairs)
      }
    }

    fetchPairData()
  }, [sortBy, numPools])

  const getChartKey = (pair: Pair) => `${pair.token0.symbol}-${pair.token1.symbol}`

  const getChartData = (pairData: PairData) => _.map(
    pairData, (pair) => ({
      key: getChartKey(pair),
      data: _.toNumber(_.get(pair, sortBy))
    })
  )

  const handleChangeSortBy = (newValue: any, actionMeta: ActionMeta<string>) => {
    if (newValue) {
      return setSortBy(newValue.value)
    }
  }

  const handleChangeNumPools =  (newValue: any, actionMeta: ActionMeta<string>) => {
    if (newValue) {
      return setNumPools(newValue.value)
    }
  }

  const numPoolsOptions = _.map(_.range(1, 21), num => ({value: num, label: num}))

  return (
    <div className="App">
      <div className="header">DeFi Kingdoms Liquidity Pools</div>
      <div className="dropdowns">
        <div className='dropdown_wrapper'>
          <div className='dropdown_label'>Sort By</div>
          <Select 
            options={SORT_BY_OPTIONS} 
            onChange={handleChangeSortBy} 
            defaultValue={SORT_BY_OPTIONS[0]} 
            placeholder="Sort By"
            className="dropdown"
          />
        </div>
        <div className='dropdown_wrapper'>
          <div className='dropdown_label'>Number of Pools to Display</div>
          <Select 
            options={numPoolsOptions as any}
            onChange={handleChangeNumPools}
            defaultValue={numPoolsOptions[9] as any}
            placeholder="# Pools"
            className="dropdown"
          />
        </div>
      </div>
      {!isLoading 
        ? <AutosizeChart chartData={pairData ? getChartData(pairData) : []} sortBy={sortBy}/>
        : <BallTriangle height={150} width={150} color='#004529' wrapperStyle={{ margin: '200px' }} />
      }
    </div>
  );
}

export default App;
