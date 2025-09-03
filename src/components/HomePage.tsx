import React, { useState, useEffect } from 'react';
import { Zap, Clock, DollarSign, MessageCircle, Calculator, Shield, Users, Headphones } from 'lucide-react';
import { CalculationResult } from '../types';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { initializeScrollAnimations } from '../utils/scrollAnimations';
import { useAppData } from '../contexts/AppDataContext';
import { useCurrencyRate } from '../contexts/CurrencyRateContext';
import { LoadingSkeleton } from './LoadingSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import { SectionDivider } from './SectionDivider';

interface HomePageProps {
  onContactClick: () => void;
  onCalculatorClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onContactClick, onCalculatorClick }) => {
  const [currentLevel, setCurrentLevel] = useState<number | ''>('');
  const [desiredLevel, setDesiredLevel] = useState<number | ''>('');
  const debouncedCurrentLevel = useDebounce(currentLevel, 500);
  const debouncedDesiredLevel = useDebounce(desiredLevel, 500);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [totalToMax, setTotalToMax] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [bdtCost, setBdtCost] = useState<number>(0);
  const [bdtTotalCost, setBdtTotalCost] = useState<number>(0);
  const [showResultBDT, setShowResultBDT] = useState(false);
  const [showTotalBDT, setShowTotalBDT] = useState(false);
  const { currentRate, isLoadingRate } = useCurrencyRate();
  const { socialLinks, getLinkByPlatform, calculationSettings, levelFeeRules, settingsLoading } = useAppData();

  // Initialize scroll animations
  useEffect(() => {
    const observer = initializeScrollAnimations();
    return () => observer.disconnect();
  }, []);

  const calculateLevelProgression = async (currentLevel: number, desiredLevel: number): Promise<CalculationResult> => {
    const csvData = `From Level,To Level,EXP Needed
50,51,24196
51,52,44262
52,53,46664
53,54,49062
54,55,51464
55,56,53856
56,57,84392
57,58,87988
58,59,91592
59,60,95186
60,61,132916
61,62,138914
62,63,144914
63,64,150918
64,65,158116
65,66,206646
66,67,215648
67,68,224648
68,69,233638
69,70,242650
70,71,301976
71,72,312778
72,73,327172
73,74,341574
74,75,355972
75,76,432102
76,77,453100
77,78,474100
78,79,495100
79,80,516098
80,81,613822
81,82,661830
82,83,709828
83,84,757826
84,85,805830
85,86,960552
86,87,1014558
87,88,1068556
88,89,1122554
89,90,1176560
90,91,1367290
91,92,1427242
92,93,1487330
93,94,1547290
94,95,1607288
95,96,1667280
96,97,1727290
97,98,1787280
98,99,1847288
99,100,1907288`;

    const lines = csvData.trim().split('\n');
    const levelData: { fromLevel: number; toLevel: number; expNeeded: number }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const [fromLevel, toLevel, expNeeded] = lines[i].split(',');
      levelData.push({
        fromLevel: parseInt(fromLevel),
        toLevel: parseInt(toLevel),
        expNeeded: parseInt(expNeeded)
      });
    }
    
    if (currentLevel >= desiredLevel) {
      return {
        totalTime: 0,
        totalCost: 0,
        totalExp: 0,
        levelSteps: []
      };
    }

    // Use cached settings
    const expPerHour = calculationSettings.find(s => s.setting_name === 'exp_per_hour')?.setting_value || 9000;
    const baseCostPerHour = calculationSettings.find(s => s.setting_name === 'base_cost_per_hour')?.setting_value || 0.2083;

    const relevantSteps = levelData.filter(
      step => step.fromLevel >= currentLevel && step.fromLevel < desiredLevel
    );

    // Calculate dynamic values for each step
    const dynamicSteps: any[] = relevantSteps.map(step => {
      const totalHours = step.expNeeded / expPerHour;
      const baseCost = totalHours * baseCostPerHour;
      
      const applicableFeeRule = levelFeeRules.find(rule => 
        step.fromLevel >= rule.from_level && step.fromLevel <= rule.to_level
      );
      
      const additionalFee = applicableFeeRule?.additional_fee_usd || 0;
      const finalCost = baseCost + additionalFee;
      
      return {
        ...step,
        totalHours,
        costUSD: finalCost
      };
    });

    const totalTime = dynamicSteps.reduce((sum, step) => sum + step.totalHours, 0);
    const totalCost = dynamicSteps.reduce((sum, step) => sum + step.costUSD, 0);
    const totalExp = relevantSteps.reduce((sum, step) => sum + step.expNeeded, 0);

    return {
      totalTime,
      totalCost,
      totalExp,
      levelSteps: dynamicSteps
    };
  };

  const formatTime = (hours: number): string => {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    const minutes = Math.floor((hours % 1) * 60);

    if (days > 0) {
      return `${days}d ${remainingHours}h ${minutes}m`;
    } else if (remainingHours > 0) {
      return `${remainingHours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  useEffect(() => {
    if (
      debouncedCurrentLevel && 
      debouncedDesiredLevel && 
      typeof debouncedCurrentLevel === 'number' && 
      typeof debouncedDesiredLevel === 'number' && 
      debouncedCurrentLevel >= 50 && 
      debouncedCurrentLevel < debouncedDesiredLevel && 
      debouncedDesiredLevel <= 100 &&
      !settingsLoading &&
      calculationSettings.length > 0
    ) {
      setIsCalculating(true);
      setTimeout(() => {
        calculateLevelProgression(debouncedCurrentLevel, debouncedDesiredLevel).then(calculationResult => {
          setResult(calculationResult);
          setIsCalculating(false);
          setShowResultBDT(false);
        }).catch(error => {
          console.error('Error calculating progression:', error);
          setIsCalculating(false);
        });
      }, 800);
    } else {
      setResult(null);
      setShowResultBDT(false);
    }

    // Calculate total to level 100 when current level is set
    if (
      debouncedCurrentLevel && 
      typeof debouncedCurrentLevel === 'number' && 
      debouncedCurrentLevel >= 50 && 
      debouncedCurrentLevel < 100 && 
      (!debouncedDesiredLevel || debouncedDesiredLevel === '' || (typeof debouncedDesiredLevel === 'number' && debouncedDesiredLevel <= 100)) &&
      !settingsLoading &&
      calculationSettings.length > 0
    ) {
      calculateLevelProgression(debouncedCurrentLevel, 100).then(totalResult => {
        setTotalToMax(totalResult);
        setShowTotalBDT(false);
      }).catch(error => {
        console.error('Error calculating total to max:', error);
      });
    } else {
      setTotalToMax(null);
      setShowTotalBDT(false);
    }
  }, [debouncedCurrentLevel, debouncedDesiredLevel, settingsLoading, calculationSettings, levelFeeRules]);

  const handleConvertResultToBDT = () => {
    if (!result || !currentRate) return;
    
    const bdtAmount = result.totalCost * currentRate;
    setBdtCost(bdtAmount);
    setShowResultBDT(true);
  };

  const handleConvertTotalToBDT = () => {
    if (!totalToMax || !currentRate) return;
    
    const bdtTotalAmount = totalToMax.totalCost * currentRate;
    setBdtTotalCost(bdtTotalAmount);
    setShowTotalBDT(true);
  };


  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12">
      {/* Hero Section */}
      <section className="px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto relative">
          {/* Main Hero Content */}
          <div className="text-center relative z-10 animate-fadeIn">
            {/* Main Title with Enhanced Effects */}
            <div className="relative mb-6 md:mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 font-hero relative will-change-auto">
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent md:animate-textGlow">
                  FREE FIRE
                </span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent md:animate-textGlow" style={{ animationDelay: '0.5s' }}>
                  LEVEL UP SERVICE
                </span>
              </h1>
              
              {/* Glitch Effect Overlay */}
              <div className="absolute inset-0 opacity-0 md:hover:opacity-100 transition-opacity duration-300">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-hero will-change-auto">
                  <span className="block text-cyan-400/30 animate-glitch1">FREE FIRE</span>
                  <span className="block text-purple-400/30 animate-glitch2">LEVEL UP SERVICE</span>
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-base md:text-xl text-gray-300 leading-relaxed mb-8 md:mb-10 max-w-3xl mx-auto font-body will-change-auto">
              Professional level progression service - Quick • Safe • Affordable • Guaranteed
            </p>
            
            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 mb-8">
              <button
                onClick={onCalculatorClick}
                className="group relative w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-400/40 text-white font-bold rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-500 shadow-xl shadow-cyan-500/30 font-buttons"
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all duration-500"></div>
                
                {/* Scanning Line Effect */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Calculator className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-lg">CALCULATE PRICE</span>
                </div>
              </button>
              
              <button
                onClick={onContactClick}
                className="group relative w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-purple-400/40 text-white font-bold rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-500 shadow-xl shadow-purple-500/30 font-buttons"
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-600/0 group-hover:from-purple-500/30 group-hover:to-pink-600/30 transition-all duration-500"></div>
                
                {/* Scanning Line Effect */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400/20 to-pink-600/20 backdrop-blur-md border border-purple-400/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-lg">CONTACT US</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* Calculator Section */}
      <section id="calculator-section" className="px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 font-headings">
              Get Your Quote
            </h2>
            <p className="text-gray-400 text-base md:text-lg px-4 font-body">
              Calculate the exact cost and time for your level progression
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-3 md:space-y-4">
                <label className="block text-cyan-400 font-medium text-sm uppercase tracking-wider font-body">
                  Current Level
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    min="50"
                    max="99"
                    placeholder="Enter level"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 md:px-6 py-3 md:py-4 text-white text-xl md:text-2xl font-bold focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 group-hover:border-cyan-400/50 placeholder-gray-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <label className="block text-cyan-400 font-medium text-sm uppercase tracking-wider font-body">
                  Desired Level
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    min="50"
                    max="100"
                    placeholder="Enter level"
                    value={desiredLevel}
                    onChange={(e) => setDesiredLevel(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 md:px-6 py-3 md:py-4 text-white text-xl md:text-2xl font-bold focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 group-hover:border-cyan-400/50 placeholder-gray-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {isCalculating && (
            <LoadingSkeleton type="calculator" />
          )}

          {result && !isCalculating && (
            <div className="space-y-4 md:space-y-6 animate-resultPop">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-gradient-to-br from-cyan-500/15 to-blue-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-400/30 shadow-xl shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 md:w-6 h-5 md:h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider font-cards">Total Time</p>
                      <p className="text-lg md:text-2xl font-bold text-white font-numbers">{formatTime(result.totalTime)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/15 to-emerald-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-green-400/30 shadow-xl shadow-green-500/20 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/40 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 md:w-6 h-5 md:h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider font-cards">Total Cost</p>
                      <div className="flex flex-col">
                        <p className="text-lg md:text-2xl font-bold text-white font-numbers">${result.totalCost.toFixed(2)}</p>
                        {showResultBDT && (
                          <p className="text-sm md:text-base font-medium text-green-400 font-numbers">{bdtCost.toFixed(0)} BDT</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/15 to-pink-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-400/30 shadow-xl shadow-purple-500/20 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-md border border-purple-400/40 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 md:w-6 h-5 md:h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider font-cards">Total EXP</p>
                      <p className="text-lg md:text-2xl font-bold text-white font-numbers">{result.totalExp.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Convert to BDT Button for Result */}
              <div className="flex justify-center">
                <button
                  onClick={handleConvertResultToBDT}
                  disabled={!currentRate}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-buttons"
                >
                  {!currentRate ? 'Loading rate...' : 'Convert to BDT'}
                </button>
              </div>

              {/* Contact Section */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 font-headings">Ready to Level Up?</h3>
                <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base font-body">Contact us now to start your level progression journey!</p>
                <a
                  href={getLinkByPlatform('discord') || 'https://discord.gg/REB74heWQc'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-500/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 text-white font-bold rounded-xl hover:from-purple-500/30 hover:to-pink-600/30 hover:border-purple-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25 font-buttons"
                >
                  <MessageCircle className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  Contact Us on Discord
                </a>
              </div>
            </div>
          )}

          {/* Total to Level 100 Section */}
          {totalToMax && currentLevel && typeof currentLevel === 'number' && currentLevel >= 50 && (
            <div className="mt-6 md:mt-8 bg-gradient-to-br from-yellow-500/10 to-orange-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-yellow-400/20 shadow-2xl shadow-yellow-500/20 animate-resultPop">
              <div className="text-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2 font-headings">
                  {currentLevel} to Level 100
                </h3>
                <p className="text-gray-400 text-sm md:text-base font-body">Level up from {currentLevel} to 100 Level</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-gradient-to-br from-yellow-500/15 to-orange-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-yellow-400/30 shadow-xl shadow-yellow-500/20 transition-all duration-300">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/40 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 md:w-6 h-5 md:h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider font-cards">Total Time</p>
                      <p className="text-lg md:text-xl font-bold text-white font-numbers">{formatTime(totalToMax.totalTime)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/15 to-orange-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-yellow-400/30 shadow-xl shadow-yellow-500/20 transition-all duration-300">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/40 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 md:w-6 h-5 md:h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider font-cards">Total Cost</p>
                      <div className="flex flex-col">
                        <p className="text-lg md:text-xl font-bold text-white font-numbers">${totalToMax.totalCost.toFixed(2)}</p>
                        {showTotalBDT && (
                          <p className="text-sm md:text-base font-medium text-yellow-400 font-numbers">{bdtTotalCost.toFixed(0)} BDT</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/15 to-orange-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-yellow-400/30 shadow-xl shadow-yellow-500/20 transition-all duration-300">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/40 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 md:w-6 h-5 md:h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider font-cards">Total EXP</p>
                      <p className="text-lg md:text-xl font-bold text-white font-numbers">{totalToMax.totalExp.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Convert to BDT Button for Total */}
              <div className="flex justify-center mt-4 md:mt-6">
                <button
                  onClick={handleConvertTotalToBDT}
                  disabled={!currentRate}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/30 text-white font-medium rounded-xl hover:from-yellow-500/30 hover:to-orange-600/30 hover:border-yellow-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-buttons"
                >
                  {!currentRate ? 'Loading rate...' : 'Convert to BDT'}
                </button>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {currentLevel && desiredLevel && typeof currentLevel === 'number' && typeof desiredLevel === 'number' && currentLevel >= 50 && (
            <>
              {currentLevel >= desiredLevel && (
                <div className="bg-gradient-to-br from-red-500/10 to-pink-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-red-400/30 shadow-xl shadow-red-500/20 animate-fadeIn">
                  <div className="text-center">
                    <p className="text-red-400 text-base md:text-lg font-medium flex items-center justify-center space-x-2">
                      <span className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">!</span>
                      <span>Desired level must be higher than current level</span>
                    </p>
                  </div>
                </div>
              )}
              
              {desiredLevel > 100 && (
                <div className="bg-gradient-to-br from-red-500/10 to-pink-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-red-400/30 shadow-xl shadow-red-500/20 animate-fadeIn">
                  <div className="text-center">
                    <p className="text-red-400 text-base md:text-lg font-medium flex items-center justify-center space-x-2">
                      <span className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">!</span>
                      <span>Maximum level is 100</span>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Separate error for current level < 50 */}
          {currentLevel && typeof currentLevel === 'number' && currentLevel < 50 && (
            <div className="bg-gradient-to-br from-red-500/10 to-pink-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-red-400/30 shadow-xl shadow-red-500/20 animate-fadeIn">
              <div className="text-center">
                <p className="text-red-400 text-base md:text-lg font-medium flex items-center justify-center space-x-2">
                  <span className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">!</span>
                  <span>Minimum current level is 50</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Divider */}
      <SectionDivider />

      {/* FAQ Section */}
      <FAQSection />

      {/* Divider */}
      <SectionDivider />

      {/* Why Choose Us Section */}
      <section className="px-4 md:px-6 py-8 md:py-16 scroll-reveal">
        <div className="max-w-6xl mx-auto animate-fadeIn">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 font-headings">
              Why Choose Us?
            </h2>
            <p className="text-gray-400 text-base md:text-lg px-4 font-body">
              We provide the best Free Fire level up service with unmatched quality
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-gradient-to-br from-cyan-500/15 to-blue-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-6 md:p-8 border border-cyan-400/30 shadow-xl shadow-cyan-500/20 text-center transform hover:scale-105 transition-all duration-300 group">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 md:w-8 h-6 md:h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Fast and Reliable</h3>
              <p className="text-gray-400 text-sm md:text-base font-body">
                Quick level progression with guaranteed results and professional service
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/15 to-emerald-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-6 md:p-8 border border-green-400/30 shadow-xl shadow-green-500/20 text-center transform hover:scale-105 transition-all duration-300 group">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/40 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Trusted and Safe</h3>
              <p className="text-gray-400 text-sm md:text-base font-body">
                100% secure service with thousands of satisfied customers worldwide
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/15 to-pink-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-6 md:p-8 border border-purple-400/30 shadow-xl shadow-purple-500/20 text-center transform hover:scale-105 transition-all duration-300 group">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-md border border-purple-400/40 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 md:w-8 h-6 md:h-8 text-purple-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">No Password Required</h3>
              <p className="text-gray-400 text-sm md:text-base font-body">
                Safe account sharing method - your account security is our priority
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/15 to-orange-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-6 md:p-8 border border-yellow-400/30 shadow-xl shadow-yellow-500/20 text-center transform hover:scale-105 transition-all duration-300 group">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/40 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="w-6 md:w-8 h-6 md:h-8 text-yellow-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">24/7 Support</h3>
              <p className="text-gray-400 text-sm md:text-base font-body">
                Round-the-clock customer support to assist you anytime you need help
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};