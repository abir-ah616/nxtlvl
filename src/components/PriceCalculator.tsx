import React, { useState, useEffect } from 'react';
import { Zap, Clock, DollarSign, MessageCircle } from 'lucide-react';
import { calculateLevelProgression, formatTime } from '../utils/calculator';
import { getUSDToBDTRate } from '../utils/currencyConverter';
import { CalculationResult } from '../types';

export const PriceCalculator: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number | ''>('');
  const [desiredLevel, setDesiredLevel] = useState<number | ''>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [totalToMax, setTotalToMax] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [bdtCost, setBdtCost] = useState<number>(0);
  const [bdtTotalCost, setBdtTotalCost] = useState<number>(0);
  const [showResultBDT, setShowResultBDT] = useState(false);
  const [showTotalBDT, setShowTotalBDT] = useState(false);
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  // Load current exchange rate on component mount
  useEffect(() => {
    const loadCurrentRate = async () => {
      try {
        const rate = await getUSDToBDTRate();
        setCurrentRate(rate);
      } catch (error) {
        console.error('Error loading current rate:', error);
        setCurrentRate(120); // Fallback rate
      } finally {
        setIsLoadingRate(false);
      }
    };

    loadCurrentRate();
  }, []);

  useEffect(() => {
    if (currentLevel && desiredLevel && typeof currentLevel === 'number' && typeof desiredLevel === 'number' && currentLevel < desiredLevel) {
      setIsCalculating(true);
      setTimeout(() => {
        const calculationResult = calculateLevelProgression(currentLevel, desiredLevel);
        setResult(calculationResult);
        setIsCalculating(false);
        setShowResultBDT(false);
      }, 800);
    } else {
      setResult(null);
      setShowResultBDT(false);
    }

    // Calculate total to level 100 when current level is set
    if (currentLevel && typeof currentLevel === 'number' && currentLevel >= 50 && currentLevel < 100) {
      const totalResult = calculateLevelProgression(currentLevel, 100);
      setTotalToMax(totalResult);
      setShowTotalBDT(false);
    } else {
      setTotalToMax(null);
      setShowTotalBDT(false);
    }
  }, [currentLevel, desiredLevel]);

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
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 pt-4 md:pt-0">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Price Calculator
          </h2>
          <p className="text-gray-400 text-base md:text-lg px-4">
            Calculate the exact cost and time for your level progression
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-3 md:space-y-4">
              <label className="block text-cyan-400 font-medium text-sm uppercase tracking-wider">
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
              {currentLevel && typeof currentLevel === 'number' && currentLevel < 50 && (
                <p className="text-red-400 text-sm mt-2">
                  Minimum current level should be 50
                </p>
              )}
            </div>

            <div className="space-y-3 md:space-y-4">
              <label className="block text-cyan-400 font-medium text-sm uppercase tracking-wider">
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

        {/* Results Section */}
        {isCalculating && (
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center justify-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              <span className="text-cyan-400 font-medium">Calculating...</span>
            </div>
          </div>
        )}

        {result && !isCalculating && (
          <div className="space-y-4 md:space-y-6 animate-fadeIn">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-gradient-to-br from-cyan-500/15 to-blue-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-400/30 shadow-xl shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 md:w-6 h-5 md:h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Total Time</p>
                    <p className="text-lg md:text-2xl font-bold text-white">{formatTime(result.totalTime)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/15 to-emerald-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-green-400/30 shadow-xl shadow-green-500/20 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/40 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 md:w-6 h-5 md:h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Total Cost</p>
                    <div className="flex flex-col">
                      <p className="text-lg md:text-2xl font-bold text-white">${result.totalCost.toFixed(2)}</p>
                      {showResultBDT && (
                        <p className="text-sm md:text-base font-medium text-green-400">৳{bdtCost.toFixed(0)}</p>
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
                    <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Total EXP</p>
                    <p className="text-lg md:text-2xl font-bold text-white">{result.totalExp.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Convert to BDT Button for Result */}
            <div className="flex justify-center">
              <button
                onClick={handleConvertResultToBDT}
                disabled={!currentRate}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!currentRate ? 'Loading rate...' : 'Convert to BDT'}
              </button>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Ready to Level Up?</h3>
              <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">Contact us now to start your level progression journey!</p>
              <a
                href="https://discord.gg/your-server"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-500/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 text-white font-bold rounded-xl hover:from-purple-500/30 hover:to-pink-600/30 hover:border-purple-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                <MessageCircle className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                Contact Us on Discord
              </a>
            </div>
          </div>
        )}

        {/* Total to Level 100 Section */}
        {totalToMax && currentLevel && typeof currentLevel === 'number' && currentLevel >= 50 && (
          <div className="mt-6 md:mt-8 bg-gradient-to-br from-yellow-500/10 to-orange-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-yellow-400/20 shadow-2xl shadow-yellow-500/20 animate-fadeIn">
            <div className="text-center mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                {currentLevel} to Level 100
              </h3>
              <p className="text-gray-400 text-sm md:text-base">Level up from {currentLevel} to 100 Level</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-gradient-to-br from-yellow-500/15 to-orange-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-yellow-400/30 shadow-xl shadow-yellow-500/20">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/40 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 md:w-6 h-5 md:h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Total Time</p>
                    <p className="text-lg md:text-xl font-bold text-white">{formatTime(totalToMax.totalTime)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/15 to-orange-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-yellow-400/30 shadow-xl shadow-yellow-500/20">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/40 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 md:w-6 h-5 md:h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Total Cost</p>
                    <div className="flex flex-col">
                      <p className="text-lg md:text-xl font-bold text-white">${totalToMax.totalCost.toFixed(2)}</p>
                      {showTotalBDT && (
                        <p className="text-sm md:text-base font-medium text-yellow-400">{bdtTotalCost.toFixed(0)} BDT</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/15 to-orange-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-yellow-400/30 shadow-xl shadow-yellow-500/20">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/40 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 md:w-6 h-5 md:h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Total EXP</p>
                    <p className="text-lg md:text-xl font-bold text-white">{totalToMax.totalExp.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Convert to BDT Button for Total */}
            <div className="flex justify-center mt-4 md:mt-6">
              <button
                onClick={handleConvertTotalToBDT}
                disabled={!currentRate}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/30 text-white font-medium rounded-xl hover:from-yellow-500/30 hover:to-orange-600/30 hover:border-yellow-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!currentRate ? 'Loading rate...' : 'Convert to BDT'}
              </button>
            </div>
          </div>
        )}

        {currentLevel && desiredLevel && typeof currentLevel === 'number' && typeof desiredLevel === 'number' && currentLevel >= desiredLevel && (
          <div className="bg-gradient-to-br from-red-500/10 to-pink-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-red-400/30 shadow-xl shadow-red-500/20">
            <div className="text-center">
              <p className="text-red-400 text-base md:text-lg font-medium">
                Desired level must be higher than current level
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};