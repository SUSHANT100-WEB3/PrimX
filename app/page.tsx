'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, ChartBar, Brain, Shield, Award, Users, 
  ArrowRight, Check, Menu, X, Zap, Target, BarChart3 
} from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const currentChallenges = evaluationType === '1-step' ? oneStepChallenges : twoStepChallenges;

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
                <img src="/primx-logo.jpg" alt="PRIMX Logo" className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold">PRIMX</span>
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
              <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
              <a href="#challenges" className="block text-gray-300 hover:text-white">Challenges</a>
              <a href="#stats" className="block text-gray-300 hover:text-white">Community</a>
              <button 
                onClick={() => router.push('/auth')}
                className="block text-gray-300 hover:text-white"
              >
                Login
              </button>
              <button 
                onClick={() => router.push('/auth')}
                className="w-full px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-lg"
              >
                Start Challenge
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Trading Journal + Crypto Prop Firm
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold">
              Trade Smarter.
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Get Funded.
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Analyze your trades with AI, improve your performance, and trade with up to $200K in funded capital.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                onClick={() => router.push('/auth')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
              <button 
                className="px-8 py-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-all duration-200"
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 border-y border-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-xl text-gray-400">
              Professional tools meet AI intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-green-500/50 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cutting-Edge Technology Section */}
      <section className="py-20 px-6 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our custom web and mobile apps are built for fast and seamless trade execution. Our robust trading environment and modern trading terminals combine to create a smooth trading experience on your platform of choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                App Store
              </button>
              <button 
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-20 px-6 bg-gray-900/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Evaluation</h2>
            <p className="text-xl text-gray-400 mb-8">
              Start with a free trial, then scale up to $200K
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-10">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Market Type:</span>
                <button className="px-4 py-2 bg-gray-700 text-white rounded-md cursor-not-allowed opacity-70">Crypto</button>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Evaluation Type:</span>
                <div className="flex bg-gray-800 rounded-md p-1">
                  <button 
                    onClick={() => setEvaluationType('1-step')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${evaluationType === '1-step' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black' : 'text-gray-300 hover:text-white'}`}
                  >
                    1-step
                  </button>
                  <button 
                    onClick={() => setEvaluationType('2-step')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${evaluationType === '2-step' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black' : 'text-gray-300 hover:text-white'}`}
                  >
                    2-step
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-xl">
            <table className="w-full text-left bg-black border-collapse">
              <thead>
                <tr className="bg-gray-800/70">
                  <th className="p-4 text-gray-300">Account size</th>
                  {currentChallenges.map((challenge, index) => (
                    <th key={index} className="p-4 text-white font-semibold">{challenge.size}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-800">
                  <td className="p-4 text-gray-400">Gain split</td>
                  {currentChallenges.map((challenge, index) => (
                    <td key={index} className="p-4 text-white">{challenge.gainSplit}</td>
                  ))}
                </tr>
                <tr className="border-t border-gray-800">
                  <td className="p-4 text-gray-400">Step 1 goal</td>
                  {currentChallenges.map((challenge, index) => (
                    <td key={index} className="p-4 text-white">{challenge.step1Goal}</td>
                  ))}
                </tr>
                {evaluationType === '2-step' && (
                  <tr className="border-t border-gray-800">
                    <td className="p-4 text-gray-400">Step 2 goal</td>
                    {currentChallenges.map((challenge, index) => (
                      <td key={index} className="p-4 text-white">{challenge.step2Goal}</td>
                    ))}
                  </tr>
                )}
                <tr className="border-t border-gray-800">
                  <td className="p-4 text-gray-400">Max. daily loss</td>
                  {currentChallenges.map((challenge, index) => (
                    <td key={index} className="p-4 text-white">{challenge.maxDailyLoss}</td>
                  ))}
                </tr>
                <tr className="border-t border-gray-800">
                  <td className="p-4 text-gray-400">Max. drawdown</td>
                  {currentChallenges.map((challenge, index) => (
                    <td key={index} className="p-4 text-white">{challenge.maxDrawdown}</td>
                  ))}
                </tr>
                <tr className="border-t border-gray-800">
                  <td className="p-4 text-gray-400">Leverage</td>
                  {currentChallenges.map((challenge, index) => (
                    <td key={index} className="p-4 text-white">{challenge.leverage}</td>
                  ))}
                </tr>
                <tr className="border-t border-gray-800">
                  <td className="p-4 text-gray-400">Evaluation fee</td>
                  {currentChallenges.map((challenge, index) => (
                    <td key={index} className="p-4 text-green-400 font-semibold">{challenge.evaluationFee}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/auth')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
            >
              Buy now
            </button>
          </div>
        </div>
      </section>

      {/* Prime Member Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-800/50 rounded-2xl p-8 md:p-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Become a Prime Member</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Unlock exclusive features and maximize your trading potential
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto pt-4">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Free $PRIMX tokens monthly</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Priority support & payouts</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Institutional market analysis</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Exclusive courses & webinars</span>
                </div>
              </div>

              <button 
                onClick={() => router.push('/auth')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
              >
                Upgrade Now
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <img src="/primx-logo.jpg" alt="PRIMX Logo" className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">PRIMX</span>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Help</a>
            </div>
            
            <p className="text-sm text-gray-400">
              All Rights Reserved PrimX © 2025
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
