'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { getCandleData, getMarketData, CandleData } from '../services/binanceService';

interface TradingChartProps {
  symbol?: string;
  interval?: string;
}

export default function TradingChart({ symbol = 'BTCUSDT', interval = '1h' }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
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
      height: 400,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add 20-period SMA
    const sma20Series = chart.addLineSeries({
      color: '#2962FF',
      lineWidth: 2,
      title: 'SMA 20',
    });

    // Add 50-period SMA
    const sma50Series = chart.addLineSeries({
      color: '#FF6B6B',
      lineWidth: 2,
      title: 'SMA 50',
    });

    // Add 200-period SMA
    const sma200Series = chart.addLineSeries({
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
      const candleData = await getCandleData(symbol, interval);
      const marketStats = await getMarketData(symbol);
      
      setMarketData(marketStats);
      
      if (candleData.length > 0) {
        const sma20Data = calculateSMA(candleData, 20);
        const sma50Data = calculateSMA(candleData, 50);
        const sma200Data = calculateSMA(candleData, 200);

        candlestickSeries.setData(candleData);
        sma20Series.setData(sma20Data);
        sma50Series.setData(sma50Data);
        sma200Series.setData(sma200Data);
      }
    };

    // Initial data fetch
    fetchData();

    // Set up periodic updates
    const updateInterval = setInterval(fetchData, 60000); // Update every minute

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
  }, [symbol, interval]);

  return (
    <div className="w-full h-[400px] bg-[#1a1a1a] rounded-lg p-4">
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
} 