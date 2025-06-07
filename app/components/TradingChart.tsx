'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeries, LineSeries, HistogramSeries } from 'lightweight-charts';
import { getCandleData, getMarketData, CandleData } from '../services/binanceService';

interface TradingChartProps {
  symbol?: string;
  interval?: string;
}

const INTERVALS = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
];

export default function TradingChart({ symbol = 'BTCUSDT', interval = '1h' }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [selectedInterval, setSelectedInterval] = useState(interval);
  const [marketData, setMarketData] = useState({
    price: 0,
    volume24h: 0,
    priceChange24h: 0,
    priceChangePercent24h: 0
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2B2B43',
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Set as an overlay by setting a blank priceScaleId
      autoscaleInfoProvider: () => ({
        priceRange: {
          minValue: 0,
          maxValue: undefined,
        },
        margins: {
          above: 0.8,
          below: 0,
        },
      }),
    });

    // Add 20-period SMA
    const sma20Series = chart.addSeries(LineSeries, {
      color: '#2962FF',
      lineWidth: 2,
      title: 'SMA 20',
    });

    // Add 50-period SMA
    const sma50Series = chart.addSeries(LineSeries, {
      color: '#FF6B6B',
      lineWidth: 2,
      title: 'SMA 50',
    });

    // Add 200-period SMA
    const sma200Series = chart.addSeries(LineSeries, {
      color: '#4CAF50',
      lineWidth: 2,
      title: 'SMA 200',
    });

    // Calculate moving averages
    const calculateSMA = (data: CandleData[], period: number) => {
      const smaData = [];
      for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, curr) => acc + curr.close, 0);
        smaData.push({
          time: data[i].time,
          value: sum / period,
        });
      }
      return smaData;
    };

    // Fetch and update data
    const fetchData = async () => {
      const candleData = await getCandleData(symbol, selectedInterval);
      const marketStats = await getMarketData(symbol);
      
      setMarketData(marketStats);
      
      if (candleData.length > 0) {
        const sma20Data = calculateSMA(candleData, 20);
        const sma50Data = calculateSMA(candleData, 50);
        const sma200Data = calculateSMA(candleData, 200);

        // Format volume data
        const volumeData = candleData.map(candle => ({
          time: candle.time,
          value: candle.volume,
          color: candle.close >= candle.open ? '#26a69a' : '#ef5350',
        }));

        candlestickSeries.setData(candleData);
        volumeSeries.setData(volumeData);
        sma20Series.setData(sma20Data);
        sma50Series.setData(sma50Data);
        sma200Series.setData(sma200Data);

        // Fit content
        chart.timeScale().fitContent();
      }
    };

    // Initial data fetch
    fetchData();

    // Set up periodic updates
    const updateInterval = setInterval(fetchData, 5000); // Update every 5 seconds

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    chartRef.current = chart;

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(updateInterval);
      chart.remove();
    };
  }, [symbol, selectedInterval]);

  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">{symbol}</span>
          <span className="text-lg text-gray-400">${marketData.price.toLocaleString()}</span>
          <span className={`text-sm ${marketData.priceChangePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {marketData.priceChangePercent24h >= 0 ? '+' : ''}{marketData.priceChangePercent24h.toFixed(2)}%
          </span>
        </div>
        <div className="flex space-x-2">
          {INTERVALS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedInterval(value)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedInterval === value
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[600px]" />
    </div>
  );
} 