'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeries, LineSeries, HistogramSeries, Time, HistogramData, LineData, CandlestickData } from 'lightweight-charts';
import { getCandleData, getMarketData, CandleData, MarketData } from '../services/binanceService';

interface TradingChartProps {
  symbol?: string;
  interval?: string;
  onMarketStatsUpdate?: (marketData: MarketData) => void;
}

const INTERVALS = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
];

export default function TradingChart({ symbol = 'BTCUSDT', interval = '1h', onMarketStatsUpdate }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [selectedInterval, setSelectedInterval] = useState(interval);
  const lastLoadedSymbolRef = useRef<string | undefined>(undefined);
  const lastLoadedIntervalRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }

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
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString();
        },
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

    chartRef.current = chart;

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

    let isActive = true; // Flag to ensure data fetching only happens for the active chart instance

    // Fetch and update data
    const fetchData = async (isLiveUpdate: boolean = false) => {
      if (!isActive || !chartRef.current) {
        return;
      }

      try {
        const limit = isLiveUpdate ? 1 : 500; // Fetch only 1 candle for live updates, 500 for initial/symbol/interval change
        const candleData = await getCandleData(symbol, selectedInterval, limit);
        const marketStats = await getMarketData(symbol);
        
        if (!isActive || !chartRef.current) {
          return;
        }

        // Call the callback with the latest price
        if (onMarketStatsUpdate) {
          onMarketStatsUpdate(marketStats);
        }
        
        if (candleData.length > 0) {
          const sma20Data = calculateSMA(candleData, 20);
          const sma50Data = calculateSMA(candleData, 50);
          const sma200Data = calculateSMA(candleData, 200);

          const formattedCandleData = candleData.map(candle => ({
            time: candle.time as Time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }));

          // Format volume data
          const volumeData = candleData.map(candle => ({
            time: candle.time as Time,
            value: candle.volume,
            color: candle.close >= candle.open ? '#26a69a' : '#ef5350',
          }));

          const formattedSma20Data = sma20Data.map(item => ({
            time: item.time as Time,
            value: item.value
          }));
          const formattedSma50Data = sma50Data.map(item => ({
            time: item.time as Time,
            value: item.value
          }));
          const formattedSma200Data = sma200Data.map(item => ({
            time: item.time as Time,
            value: item.value
          }));

          // Check chartRef.current again before setting data
          if (chartRef.current) {
            // Determine if we should update or set new data
            const isInitialLoadOrSymbolChange = !lastLoadedSymbolRef.current || 
              symbol !== lastLoadedSymbolRef.current || 
              selectedInterval !== lastLoadedIntervalRef.current;

            if (isInitialLoadOrSymbolChange) {
              candlestickSeries.setData(formattedCandleData);
              volumeSeries.setData(volumeData);
              sma20Series.setData(formattedSma20Data);
              sma50Series.setData(formattedSma50Data);
              sma200Series.setData(formattedSma200Data);
              lastLoadedSymbolRef.current = symbol;
              lastLoadedIntervalRef.current = selectedInterval;
              chartRef.current.timeScale().fitContent(); // Fit content only on initial load or symbol/interval change
            } else if (isLiveUpdate && formattedCandleData.length > 0) {
              const latestCandle = formattedCandleData[formattedCandleData.length - 1]; // Will be the only candle from limit=1
              const latestVolume = volumeData[volumeData.length - 1];

              // Only attempt to get latest SMA if data is available for that period
              const latestSma20 = formattedSma20Data.length > 0 ? formattedSma20Data[formattedSma20Data.length - 1] : undefined;
              const latestSma50 = formattedSma50Data.length > 0 ? formattedSma50Data[formattedSma50Data.length - 1] : undefined;
              const latestSma200 = formattedSma200Data.length > 0 ? formattedSma200Data[formattedSma200Data.length - 1] : undefined;

              const currentCandleData = candlestickSeries.data();
              const lastKnownCandleInSeries = currentCandleData.length > 0 ? currentCandleData[currentCandleData.length - 1] : undefined;

              // Check if it's a new candle or an update to the existing last candle
              if (!lastKnownCandleInSeries || latestCandle.time > lastKnownCandleInSeries.time) {
                // New candle, update (which will append it)
                candlestickSeries.update(latestCandle);
                volumeSeries.update(latestVolume);
                if (latestSma20) sma20Series.update(latestSma20);
                if (latestSma50) sma50Series.update(latestSma50);
                if (latestSma200) sma200Series.update(latestSma200);
              } else if (latestCandle.time === lastKnownCandleInSeries.time) {
                // Same candle, check if values have changed before updating
                let hasCandleChanged = false;
                // Ensure lastKnownCandleInSeries is actually a CandleData object
                if (lastKnownCandleInSeries && 'open' in lastKnownCandleInSeries) {
                  const typedLastKnownCandle = lastKnownCandleInSeries as CandlestickData<Time>;
                  hasCandleChanged = 
                    latestCandle.open !== typedLastKnownCandle.open ||
                    latestCandle.high !== typedLastKnownCandle.high ||
                    latestCandle.low !== typedLastKnownCandle.low ||
                    latestCandle.close !== typedLastKnownCandle.close;
                }

                const currentVolumeData = volumeSeries.data();
                const lastKnownVolumeInSeries = currentVolumeData.length > 0 ? currentVolumeData[currentVolumeData.length - 1] as HistogramData<Time> : undefined;
                const hasVolumeChanged = !lastKnownVolumeInSeries || latestVolume.value !== lastKnownVolumeInSeries.value;

                const currentSma20Data = sma20Series.data();
                const lastKnownSma20InSeries = currentSma20Data.length > 0 ? currentSma20Data[currentSma20Data.length - 1] as LineData<Time> : undefined;
                const hasSma20Changed = latestSma20?.value !== lastKnownSma20InSeries?.value;

                const currentSma50Data = sma50Series.data();
                const lastKnownSma50InSeries = currentSma50Data.length > 0 ? currentSma50Data[currentSma50Data.length - 1] as LineData<Time> : undefined;
                const hasSma50Changed = latestSma50?.value !== lastKnownSma50InSeries?.value;

                const currentSma200Data = sma200Series.data();
                const lastKnownSma200InSeries = currentSma200Data.length > 0 ? currentSma200Data[currentSma200Data.length - 1] as LineData<Time> : undefined;
                const hasSma200Changed = latestSma200?.value !== lastKnownSma200InSeries?.value;

                if (hasCandleChanged || hasVolumeChanged || hasSma20Changed || hasSma50Changed || hasSma200Changed) {
                  candlestickSeries.update(latestCandle);
                  volumeSeries.update(latestVolume);
                  if (latestSma20) sma20Series.update(latestSma20);
                  if (latestSma50) sma50Series.update(latestSma50);
                  if (latestSma200) sma200Series.update(latestSma200);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    // Initial data fetch
    fetchData(false); // Call with false for initial full load
    
    // Set up periodic updates using recursive setTimeout
    let timeoutId: NodeJS.Timeout;
    const scheduleNextFetch = () => {
      timeoutId = setTimeout(() => {
        if (isActive) { // Only schedule next fetch if component is still active
          fetchData(true); // Call with true for live updates
          scheduleNextFetch(); // Schedule the next one only after this one completes
        }
      }, 2000); // Changed interval to 2 seconds for more frequent updates
    };
    scheduleNextFetch(); // Start the first scheduled fetch

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      isActive = false; // Set flag to false on cleanup
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId); // Use clearTimeout
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null; 
      }
    };
  }, [symbol, selectedInterval, onMarketStatsUpdate]);

  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">{symbol}</span>
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
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
} 