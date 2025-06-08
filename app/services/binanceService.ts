export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketData {
  price: number;
  volume24h: number;
  priceChange24h: number;
  priceChangePercent24h: number;
}

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export async function getCandleData(symbol: string, interval: string): Promise<CandleData[]> {
  try {
    const response = await fetch(
      `${BINANCE_API_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=500`
    );
    const data = await response.json();

    return data.map((candle: any[]) => ({
      time: Math.floor(candle[0] / 1000),
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
    }));
  } catch (error) {
    console.error('Error fetching candle data:', error);
    return [];
  }
}

export async function getMarketData(symbol: string): Promise<MarketData> {
  try {
    const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`);
    const data = await response.json();

    return {
      price: parseFloat(data.lastPrice),
      volume24h: parseFloat(data.volume),
      priceChange24h: parseFloat(data.priceChange),
      priceChangePercent24h: parseFloat(data.priceChangePercent),
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return {
      price: 0,
      volume24h: 0,
      priceChange24h: 0,
      priceChangePercent24h: 0,
    };
  }
} 