import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Bubble, BubbleChart, BubbleLabel, BubbleSeries, ChartTooltip, Gradient, GradientStop } from 'reaviz'
import './App.css'
import { SORT_BY_OPTIONS } from './constants'

type AutosizeChartProps = {
  chartData: {
    key: string;
    data: number;
  }[];
  sortBy: string;
}

const getFormattedValue = (value: number, sortBy: string) => {
  if (sortBy === 'reserveUSD' || sortBy === 'volumeUSD') {
    const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(_.round(value, 2))
    return `${formattedValue}`
  }
  else {
    const formattedValue = new Intl.NumberFormat().format(value)
    return formattedValue
  }
}  

const getLabel = (sortBy: string) => {
  const selectedOption = _.find(SORT_BY_OPTIONS, option => option.value === sortBy)
  return `${selectedOption?.label}:`
}



const shouldRenderLabel = (bubbleValue: number, maxChartValue: number | undefined, isMobile: boolean) => {
  if (maxChartValue) {
    const percent = (bubbleValue / maxChartValue) * 100
    return isMobile ? percent > 9 : percent > 3
  }  
}

const getFontSize = (bubbleValue: number, maxChartValue: number | undefined, isMobile: boolean) => {
  if (maxChartValue) {
    const percent = (bubbleValue / maxChartValue) * 100
    if ( percent > 30) {
      return isMobile ? 18 : 20
    }
    if ( percent >= 3 && percent <= 10) {
      return isMobile ? 8 : 12
    } 
    else return isMobile ? 8 : 16
  }
}

const getTopDy = (bubbleValue: number, maxChartValue: number | undefined, isMobile: boolean) => {
  if (maxChartValue) {
    const percent = (bubbleValue / maxChartValue) * 100
    if ( percent >= 3 && percent <= 30) {
      return isMobile ? -13 : -15
    }
  }
  
  return -20
}

const getBottomDy = (bubbleValue: number, maxChartValue: number | undefined, isMobile: boolean) => {
  if (maxChartValue) {
    const percent = (bubbleValue / maxChartValue) * 100
    if ( percent >= 3 && percent <= 30) {
      return isMobile ? 12 : 18 
    }
  }
  
  return 25
}



export const AutosizeChart: React.VFC<AutosizeChartProps> = ({ chartData, sortBy }) => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;
  const maxChartValue = _.max(_.map(chartData, pool => pool.data))

  const formatBubbleLabel = (data: any) => {
    const pairStr = data.data.key
    const pairValue = data.data.data
    
  
    const symbol0Match = pairStr.match(/[^-]*/)
    const symbol1Match = pairStr.match(/\-(.*)/)
    const symbol0 = symbol0Match ? symbol0Match[0] : ''
    const symbol1 = symbol1Match? symbol1Match[1] : ''

    const fontSize = getFontSize(pairValue, maxChartValue, isMobile)
    const topDy = getTopDy(pairValue, maxChartValue, isMobile)
    const bottomDy = getBottomDy(pairValue, maxChartValue, isMobile)
  
    return shouldRenderLabel(pairValue, maxChartValue, isMobile) ? (
      <g>
        <text dy={topDy} textAnchor="middle" fill="#004529" fontSize={fontSize}>
          {symbol0}
        </text>
        <image y={-10} x={-4} height={10} width={10} href={require('./jewel-icon.png')} />
        <text dy={bottomDy} textAnchor="middle" fill="#004529" fontSize={fontSize}>
          {symbol1}
        </text>
      </g>
    ) : (
      <g>
        <image y={-6} x={-4} height={10} width={10} href={require('./jewel-icon.png')} />
      </g>
    )
  }
  
  return (
    <div className='chart'>
      <BubbleChart 
        data={chartData}
        series={
          <BubbleSeries 
            colorScheme="YlGn"
            animated={false}
            bubble={
              <Bubble
                tooltip={
                  <ChartTooltip
                    content={(d: any) => (
                      <div className='tooltip'>
                        <div className="tooltip_pair">{d.x}</div>
                        <div className="tooltip_label">{getLabel(sortBy)}</div>
                        <div className="tooltip_data_item">{getFormattedValue(d.y, sortBy)}</div>
                      </div>
                    )}
                  />
                }
                gradient={
                  <Gradient
                      stops={[
                        <GradientStop
                          offset="5%"
                          stopOpacity={0.25}
                          key="start"
                        />,
                        <GradientStop offset="90%" stopOpacity={0.7} key="stop" />
                      ]}
                    />
                }
              />
            }
            label={
              <BubbleLabel 
                format={formatBubbleLabel}
              />
            }
          />
        }
      />
    </div>
  )
}