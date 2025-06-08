import { CandleData } from './binanceService';

export interface IndicatorValue {
  time: number;
  value: number;
}

export function calculateRSI(data: CandleData[], period: number): IndicatorValue[] {
  const rsiData: IndicatorValue[] = [];
  if (data.length < period) return rsiData;

  for (let i = period; i < data.length; i++) {
    let gains = 0;
    let losses = 0;

    for (let j = i - period; j <= i; j++) {
      const priceChange = data[j].close - data[j - 1]?.close || 0;
      if (priceChange > 0) {
        gains += priceChange;
      } else {
        losses -= priceChange; // losses are positive values
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    let rs = 0;
    if (avgLoss === 0) {
      rs = Infinity;
    } else {
      rs = avgGain / avgLoss;
    }

    const rsi = 100 - (100 / (1 + rs));
    rsiData.push({
      time: data[i].time,
      value: rsi,
    });
  }

  return rsiData;
}

export function calculateSMA(data: CandleData[], period: number): IndicatorValue[] {
  const smaData: IndicatorValue[] = [];
  if (data.length < period) return smaData;

  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, curr) => acc + curr.close, 0);
    smaData.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  return smaData;
}

export function calculateBollingerBands(data: CandleData[], period: number, stdDev: number = 2): {
  upper: IndicatorValue[];
  middle: IndicatorValue[];
  lower: IndicatorValue[];
} {
  const upperBand: IndicatorValue[] = [];
  const middleBand: IndicatorValue[] = [];
  const lowerBand: IndicatorValue[] = [];

  if (data.length < period) {
    return { upper: [], middle: [], lower: [] };
  }

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
    const middle = sum / period;

    const variance = slice.reduce((acc, curr) => acc + Math.pow(curr.close - middle, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);

    upperBand.push({
      time: data[i].time,
      value: middle + standardDeviation * stdDev,
    });
    middleBand.push({
      time: data[i].time,
      value: middle,
    });
    lowerBand.push({
      time: data[i].time,
      value: middle - standardDeviation * stdDev,
    });
  }

  return { upper: upperBand, middle: middleBand, lower: lowerBand };
} 