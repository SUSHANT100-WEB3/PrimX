"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, ChartBar, Brain, Shield, Award, Users, 
  ArrowRight, Check, Menu, X, Zap, Target, BarChart3, ChevronDown 
} from 'lucide-react';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import TradingChart from './components/TradingChart';
import { getCandleData, CandleData, MarketData } from './services/binanceService';
import { calculateRSI, calculateSMA, calculateBollingerBands } from './services/taService';
import "./globals.css";

interface Challenge {
  size: string;
  gainSplit: string;
  step1Goal: string;
  step2Goal?: string; // Optional for 1-step challenges
  maxDailyLoss: string;
  maxDrawdown: string;
  leverage: string;
  evaluationFee: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedTab, setSelectedTab] = useState('chart'); // 'chart' or 'indicators'
  const [pageSelectedInterval, setPageSelectedInterval] = useState('1d'); // New state for selected interval in page.tsx
  const [rsi7, setRsi7] = useState<number | null>(null);
  const [rsi14, setRsi14] = useState<number | null>(null);
  const [rsi25, setRsi25] = useState<number | null>(null);
  const [sma5, setSma5] = useState<number | null>(null);
  const [sma20, setSma20] = useState<number | null>(null);
  const [sma100, setSma100] = useState<number | null>(null);
  const [bbUpper, setBbUpper] = useState<number | null>(null);
  const [bbMiddle, setBbMiddle] = useState<number | null>(null);
  const [bbLower, setBbLower] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null); // New state for market data
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT'); // New state for selected cryptocurrency symbol

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchAndCalculateIndicators = async () => {
      const candleData: CandleData[] = await getCandleData(selectedSymbol, pageSelectedInterval); // Use pageSelectedInterval

      if (candleData.length > 0) {
        const latestClosePrice = candleData[candleData.length - 1].close;
        setCurrentPrice(latestClosePrice);

        const rsi7Data = calculateRSI(candleData, 7);
        const rsi14Data = calculateRSI(candleData, 14);
        const rsi25Data = calculateRSI(candleData, 25);
        const sma5Data = calculateSMA(candleData, 5);
        const sma20Data = calculateSMA(candleData, 20);
        const sma100Data = calculateSMA(candleData, 100);
        const bbData = calculateBollingerBands(candleData, 20);

        setRsi7(rsi7Data.length > 0 ? rsi7Data[rsi7Data.length - 1].value : null);
        setRsi14(rsi14Data.length > 0 ? rsi14Data[rsi14Data.length - 1].value : null);
        setRsi25(rsi25Data.length > 0 ? rsi25Data[rsi25Data.length - 1].value : null);
        setSma5(sma5Data.length > 0 ? sma5Data[sma5Data.length - 1].value : null);
        setSma20(sma20Data.length > 0 ? sma20Data[sma20Data.length - 1].value : null);
        setSma100(sma100Data.length > 0 ? sma100Data[sma100Data.length - 1].value : null);
        setBbUpper(bbData.upper.length > 0 ? bbData.upper[bbData.upper.length - 1].value : null);
        setBbMiddle(bbData.middle.length > 0 ? bbData.middle[bbData.middle.length - 1].value : null);
        setBbLower(bbData.lower.length > 0 ? bbData.lower[bbData.lower.length - 1].value : null);
      }
    };

    fetchAndCalculateIndicators();
    const indicatorUpdateInterval = setInterval(fetchAndCalculateIndicators, 30000); // Update every 30 seconds
    return () => clearInterval(indicatorUpdateInterval);
  }, [selectedSymbol, pageSelectedInterval]); // Add pageSelectedInterval to dependencies

  const stats = [
    { value: '368K+', label: 'Active Traders' },
    { value: '$12M+', label: 'Payouts Distributed' },
    { value: '50+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized coaching on every trade with advanced AI analysis'
    },
    {
      icon: ChartBar,
      title: 'Smart Analytics',
      description: 'Track performance with institutional-grade metrics and reporting'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Protect your capital with real-time alerts and position sizing'
    },
    {
      icon: Award,
      title: 'Funded Trading',
      description: 'Pass evaluations and trade with up to $200K in capital'
    }
  ];

  const oneStepChallenges: Challenge[] = [
    { size: '$5,000', gainSplit: 'Up to 90%', step1Goal: '$500', step2Goal: undefined, maxDailyLoss: '4%', maxDrawdown: '$300', leverage: 'Up to 5:1', evaluationFee: '$60' },
    { size: '$10,000', gainSplit: 'Up to 90%', step1Goal: '$1,000', step2Goal: undefined, maxDailyLoss: '4%', maxDrawdown: '$600', leverage: 'Up to 5:1', evaluationFee: '$110' },
    { size: '$25,000', gainSplit: 'Up to 90%', step1Goal: '$2,500', step2Goal: undefined, maxDailyLoss: '4%', maxDrawdown: '$1,500', leverage: 'Up to 5:1', evaluationFee: '$275' },
    { size: '$50,000', gainSplit: 'Up to 90%', step1Goal: '$5,000', step2Goal: undefined, maxDailyLoss: '4%', maxDrawdown: '$3,000', leverage: 'Up to 5:1', evaluationFee: '$495' },
    { size: '$100,000', gainSplit: 'Up to 90%', step1Goal: '$10,000', step2Goal: undefined, maxDailyLoss: '4%', maxDrawdown: '$6,000', leverage: 'Up to 5:1', evaluationFee: '$999' },
  ];

  const twoStepChallenges: Challenge[] = [
    { size: '$5,000', gainSplit: 'Up to 90%', step1Goal: '$250', step2Goal: '$500', maxDailyLoss: '5%', maxDrawdown: '$400', leverage: 'Up to 5:1', evaluationFee: '$50' },
    { size: '$10,000', gainSplit: 'Up to 90%', step1Goal: '$500', step2Goal: '$1,000', maxDailyLoss: '5%', maxDrawdown: '$800', leverage: 'Up to 5:1', evaluationFee: '$100' },
    { size: '$25,000', gainSplit: 'Up to 90%', step1Goal: '$1,250', step2Goal: '$2,500', maxDailyLoss: '5%', maxDrawdown: '$2,000', leverage: 'Up to 5:1', evaluationFee: '$250' },
    { size: '$50,000', gainSplit: 'Up to 90%', step1Goal: '$2,500', step2Goal: '$5,000', maxDailyLoss: '5%', maxDrawdown: '$4,000', leverage: 'Up to 5:1', evaluationFee: '$450' },
    { size: '$100,000', gainSplit: 'Up to 90%', step1Goal: '$5,000', step2Goal: '$10,000', maxDailyLoss: '5%', maxDrawdown: '$8,000', leverage: 'Up to 5:1', evaluationFee: '$725' },
  ];

  const [evaluationType, setEvaluationType] = useState('2-step');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Sample data for the trading chart
  const chartData = [
    { time: '2024-01-01', value: 40000 },
    { time: '2024-01-02', value: 41000 },
    { time: '2024-01-03', value: 39000 },
    { time: '2024-01-04', value: 42000 },
    { time: '2024-01-05', value: 43000 },
    { time: '2024-01-06', value: 42500 },
    { time: '2024-01-07', value: 44000 },
    { time: '2024-01-08', value: 43500 },
    { time: '2024-01-09', value: 45000 },
    { time: '2024-01-10', value: 44500 },
  ];

  const currentChallenges = evaluationType === '1-step' ? oneStepChallenges : twoStepChallenges;

  const faqs = [
    {
      question: "What is PrimX?",
      answer: "PrimX is an AI-Powered Trading Journal and Crypto Prop Firm that helps traders analyze their performance and trade with funded capital."
    },
    {
      question: "How do I get funded?",
      answer: "You can get funded by passing our 1-step or 2-step evaluation challenges. Once you meet the profit targets and adhere to the rules, you'll be eligible for a funded account."
    },
    {
      question: "What is the gain split?",
      answer: "PrimX offers a gain split of up to 90% for successful traders, meaning you keep most of the profits you generate."
    },
    {
      question: "Are there any recurring fees?",
      answer: "No, there are no recurring fees. You only pay an evaluation fee once to enter a challenge."
    },
    {
      question: "What markets can I trade? ",
      answer: "Currently, PrimX focuses on crypto trading. We are constantly expanding our offerings."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const getRSIInterpretation = (rsi: number | null) => {
    if (rsi === null) return 'N/A';
    if (rsi < 30) return 'Oversold (Bullish)';
    if (rsi > 70) return 'Overbought (Bearish)';
    return 'Neutral';
  };

  const getSMABollingerInterpretation = (indicatorValue: number | null, type: 'SMA' | 'LowerBBand') => {
    if (indicatorValue === null || currentPrice === null) return 'N/A';

    if (type === 'SMA') {
      if (currentPrice > indicatorValue) return 'Bullish';
      if (currentPrice < indicatorValue) return 'Bearish';
      return 'Neutral'; // If equal
    } else if (type === 'LowerBBand') {
      if (currentPrice > indicatorValue) return 'Bullish'; // Price above lower band is bullish
      return 'Neutral'; // If price is below or equal to lower band, it's neutral, as per defilens.ai's simplified display for bullish only
    }
    return 'Neutral';
  };

  // New helper function for SMA percentage difference
  const getSMADifferencePercentage = (smaValue: number | null) => {
    if (smaValue === null || currentPrice === null) return 'N/A';
    const diff = ((currentPrice - smaValue) / smaValue) * 100;
    return `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%`;
  };

  const handleMarketStatsUpdate = useCallback((data: MarketData) => {
    setMarketData(data);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md border-b border-gray-800' : ''
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <img src="/primx-logo.jpg" alt="PRIMX Logo" className="w-6 h-6 text-black object-contain" />
              </div>
              <span className="text-2xl font-bold">PRIMX</span>

              {/* Dropdown for cryptocurrency selection */}
              
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#challenges" className="text-gray-300 hover:text-white transition-colors">Challenges</a>
              <a href="#stats" className="text-gray-300 hover:text-white transition-colors">Community</a>
              <button
                onClick={() => router.push('/auth')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/auth')}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
              >
                Start Challenge
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto px-6 py-4 space-y-4">
              <a onClick={() => setIsMenuOpen(false)} href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
              <a onClick={() => setIsMenuOpen(false)} href="#challenges" className="block text-gray-300 hover:text-white transition-colors">Challenges</a>
              <a onClick={() => setIsMenuOpen(false)} href="#stats" className="block text-gray-300 hover:text-white transition-colors">Community</a>
              <button
                onClick={() => { router.push('/auth'); setIsMenuOpen(false); }}
                className="block text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Login
              </button>
              <button
                onClick={() => { router.push('/auth'); setIsMenuOpen(false); }}
                className="w-full px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-left"
              >
                Start Challenge
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          {/* Green-blue gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-800/20 via-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-green-400 mb-8 flex items-center justify-center text-center leading-tight">
              <Zap className="w-6 h-6 mr-2" /> Flawless Execution,Unmatched Alpha
            </p>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Trade Smarter.<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">Get Funded.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Analyze your trades with AI, improve your performance, and trade with up to $200K in funded capital.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => router.push('/auth')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center text-base md:text-lg"
            >
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => { /* Implement demo view logic */ }}
              className="px-8 py-3 bg-gray-800 text-gray-200 font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-base md:text-lg"
            >
              View Demo
            </button>
          </div>
        </div>
      </header>

      {/* Chart Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Real-time Market Insights
          </h2>
          <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-10 border border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10">
                  <img src="/bitcoin.png" alt="Bitcoin Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Bitcoin <span className="text-gray-400">/ USDT</span></h3>
                  <p className="text-green-500 text-lg">Live Price: ${currentPrice ? currentPrice.toFixed(2) : 'Loading...'}</p>
                </div>
                {/* Cryptocurrency Dropdown */}
                <div className="relative">
                  <select
                    aria-label="Select cryptocurrency pair"
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="BTCUSDT">BTC/USDT</option>
                    <option value="ETHUSDT">ETH/USDT</option>
                    <option value="BNBUSDT">BNB/USDT</option>
                    <option value="XRPUSDT">XRP/USDT</option>
                    <option value="ADAUSDT">ADA/USDT</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedTab('chart')}
                  className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                    selectedTab === 'chart' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Chart
                </button>
                <button
                  onClick={() => setSelectedTab('indicators')}
                  className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                    selectedTab === 'indicators' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Indicators
                </button>
              </div>
            </div>

            {selectedTab === 'chart' && (
              <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] w-full">
                <TradingChart symbol={selectedSymbol} interval={pageSelectedInterval} onMarketStatsUpdate={handleMarketStatsUpdate} />
              </div>
            )}

            {selectedTab === 'indicators' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold mb-4 text-green-400">Relative Strength Index (RSI)</h4>
                  <div className="space-y-3 text-gray-300">
                    <p className="text-sm md:text-base">RSI (7): <span className="font-semibold">{rsi7 !== null ? rsi7.toFixed(2) : 'N/A'}</span> (<span className={`${getRSIInterpretation(rsi7) === 'Oversold (Bullish)' ? 'text-green-500' : getRSIInterpretation(rsi7) === 'Overbought (Bearish)' ? 'text-red-500' : 'text-gray-400'}`}>{getRSIInterpretation(rsi7)}</span>)</p>
                    <p className="text-sm md:text-base">RSI (14): <span className="font-semibold">{rsi14 !== null ? rsi14.toFixed(2) : 'N/A'}</span> (<span className={`${getRSIInterpretation(rsi14) === 'Oversold (Bullish)' ? 'text-green-500' : getRSIInterpretation(rsi14) === 'Overbought (Bearish)' ? 'text-red-500' : 'text-gray-400'}`}>{getRSIInterpretation(rsi14)}</span>)</p>
                    <p className="text-sm md:text-base">RSI (25): <span className="font-semibold">{rsi25 !== null ? rsi25.toFixed(2) : 'N/A'}</span> (<span className={`${getRSIInterpretation(rsi25) === 'Oversold (Bullish)' ? 'text-green-500' : getRSIInterpretation(rsi25) === 'Overbought (Bearish)' ? 'text-red-500' : 'text-gray-400'}`}>{getRSIInterpretation(rsi25)}</span>)</p>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold mb-4 text-green-400">Simple Moving Averages (SMA)</h4>
                  <div className="space-y-3 text-gray-300">
                    <p className="text-sm md:text-base">SMA (5): <span className="font-semibold">{sma5 !== null ? sma5.toFixed(2) : 'N/A'}</span> (<span className={`${getSMABollingerInterpretation(sma5, 'SMA') === 'Bullish' ? 'text-green-500' : 'text-red-500'}`}>{getSMABollingerInterpretation(sma5, 'SMA')} {getSMADifferencePercentage(sma5)}</span>)</p>
                    <p className="text-sm md:text-base">SMA (20): <span className="font-semibold">{sma20 !== null ? sma20.toFixed(2) : 'N/A'}</span> (<span className={`${getSMABollingerInterpretation(sma20, 'SMA') === 'Bullish' ? 'text-green-500' : 'text-red-500'}`}>{getSMABollingerInterpretation(sma20, 'SMA')} {getSMADifferencePercentage(sma20)}</span>)</p>
                    <p className="text-sm md:text-base">SMA (100): <span className="font-semibold">{sma100 !== null ? sma100.toFixed(2) : 'N/A'}</span> (<span className={`${getSMABollingerInterpretation(sma100, 'SMA') === 'Bullish' ? 'text-green-500' : 'text-red-500'}`}>{getSMABollingerInterpretation(sma100, 'SMA')} {getSMADifferencePercentage(sma100)}</span>)</p>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold mb-4 text-green-400">Bollinger Bands (BB)</h4>
                  <div className="space-y-3 text-gray-300">
                    <p className="text-sm md:text-base">Upper Band: <span className="font-semibold">{bbUpper !== null ? bbUpper.toFixed(2) : 'N/A'}</span></p>
                    <p className="text-sm md:text-base">Middle Band: <span className="font-semibold">{bbMiddle !== null ? bbMiddle.toFixed(2) : 'N/A'}</span></p>
                    <p className="text-sm md:text-base">Lower Band: <span className="font-semibold">{bbLower !== null ? bbLower.toFixed(2) : 'N/A'}</span> (<span className={`${getSMABollingerInterpretation(bbLower, 'LowerBBand') === 'Bullish' ? 'text-green-500' : 'text-gray-400'}`}>{getSMABollingerInterpretation(bbLower, 'LowerBBand')}</span>)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-950">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Cutting-Edge Technology,Unrivaled Edge
          </h2>
          <p className="text-base sm:text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
            Harness the power of AI and advanced analytics to elevate your trading performance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-8 transform transition-transform duration-300 hover:scale-105"
              >
                <feature.icon className="h-12 w-12 text-green-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="https://apps.apple.com/app/primx/idYOUR_APP_ID" // Replace with actual App Store link
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
            >
              <img src="/appstore.jpeg" alt="Apple App Store" className="h-6 w-6 mr-2" />
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.primx.app" // Replace with actual Google Play link
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
            >
              <img src="/playstore.jpeg" alt="Google Play Store" className="h-6 w-6 mr-2" />
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Proprietary Trading Challenges
          </h2>
          <p className="text-base sm:text-lg text-gray-300 text-center mb-10 max-w-3xl mx-auto">
            Choose from our 1-step or 2-step evaluation challenges to prove your trading prowess and get access to significant funded capital.
          </p>

          <div className="flex justify-center mb-10 space-x-4">
            <button
              onClick={() => setEvaluationType('1-step')}
              className={`px-6 py-3 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 ${
                evaluationType === '1-step'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              1-Step Challenges
            </button>
            <button
              onClick={() => setEvaluationType('2-step')}
              className={`px-6 py-3 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 ${
                evaluationType === '2-step'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              2-Step Challenges
            </button>
          </div>

          <div className="overflow-x-auto mb-16">
            <table className="min-w-full bg-gray-900 rounded-lg shadow-xl border border-gray-800">
              <thead>
                <tr className="bg-gray-800 text-gray-300 text-left text-sm md:text-base">
                  <th className="py-4 px-6">Account Size</th>
                  <th className="py-4 px-6">Gain Split</th>
                  <th className="py-4 px-6">Step 1 Goal</th>
                  {evaluationType === '2-step' && <th className="py-4 px-6">Step 2 Goal</th>}
                  <th className="py-4 px-6">Max Daily Loss</th>
                  <th className="py-4 px-6">Max Drawdown</th>
                  <th className="py-4 px-6">Leverage</th>
                  <th className="py-4 px-6">Evaluation Fee</th>
                </tr>
              </thead>
              <tbody>
                {currentChallenges.map((challenge, index) => (
                  <tr key={index} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-850 transition-colors duration-200 text-sm md:text-base">
                    <td className="py-4 px-6 font-semibold text-white">{challenge.size}</td>
                    <td className="py-4 px-6 text-green-400">{challenge.gainSplit}</td>
                    <td className="py-4 px-6">{challenge.step1Goal}</td>
                    {evaluationType === '2-step' && <td className="py-4 px-6">{challenge.step2Goal}</td>}
                    <td className="py-4 px-6 text-red-400">{challenge.maxDailyLoss}</td>
                    <td className="py-4 px-6 text-red-400">{challenge.maxDrawdown}</td>
                    <td className="py-4 px-6">{challenge.leverage}</td>
                    <td className="py-4 px-6 font-semibold text-green-400">{challenge.evaluationFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/auth')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center mx-auto text-base md:text-lg"
            >
              Get Funded Today! <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="community" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Trusted by Traders Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { text: "PrimX transformed my trading. The AI insights are incredibly accurate and helped me double my profits in months!", author: "Alex R.", location: "New York, USA" },
              { text: "Getting funded through PrimX was seamless. Their challenges are fair, and the payout process is super efficient. Highly recommend!", author: "Sarah L.", location: "London, UK" },
              { text: "The risk management tools are a game-changer. I feel much more confident in my trades knowing PrimX is there to guide me.", author: "Mike C.", location: "Sydney, Australia" },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-8 shadow-lg border border-gray-800 relative">
                <p className="text-base md:text-lg text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-xl font-bold text-white mr-4">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-base md:text-lg">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-quote"><path d="M12 21.5c-4.9 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9Z"/><path d="M14 13a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V15a2 2 0 0 0-2-2Z"/><path d="M6 13a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V15a2 2 0 0 0-2-2Z"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Our Community by the Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-400 mb-3">{stat.value}</p>
                <p className="text-base md:text-lg text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-lg">
                <button
                  className="flex justify-between items-center w-full text-left text-base sm:text-xl font-semibold text-white"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <ChevronDown className={`w-6 h-6 transform transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`} />
                </button>
                {openFAQ === index && (
                  <p className="mt-4 text-gray-300 leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-emerald-700 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Amplify Your Trading?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join PrimX today and experience the future of AI-powered trading and funded accounts.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="px-10 py-4 bg-white text-green-800 font-bold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 text-base md:text-xl flex items-center justify-center mx-auto"
          >
            Start Your Free Trial Now! <ArrowRight className="ml-2 w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2 justify-center md:justify-start mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <img src="/primx-logo.jpg" alt="PRIMX Logo" className="w-6 h-6 text-black object-contain" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">PRIMX</span>
            </div>
            <p className="mb-4 text-sm md:text-base">Trade smarter, get funded, and achieve financial freedom with AI.</p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="hover:text-white transition-colors"><FaTwitter className="w-6 h-6" /></a>
              <a href="#" className="hover:text-white transition-colors"><FaInstagram className="w-6 h-6" /></a>
              <a href="#" className="hover:text-white transition-colors"><FaLinkedin className="w-6 h-6" /></a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#challenges" className="hover:text-white transition-colors">Challenges</a></li>
              <li><a href="#stats" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#faqs" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-4">Contact Us</h4>
            <p className="text-sm md:text-base">Email: support@primx.com</p>
            <p className="text-sm md:text-base">Phone: +1 (123) 456-7890</p>
            <p className="mt-4 text-sm md:text-base">&copy; 2025 PrimX. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
