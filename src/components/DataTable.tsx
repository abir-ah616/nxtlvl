import React, { useState, useEffect } from 'react';
import { Search, Zap, Clock, DollarSign } from 'lucide-react';
import { formatTime } from '../utils/calculator';
import { useAppData } from '../contexts/AppDataContext';
import { useCurrencyRate } from '../contexts/CurrencyRateContext';
import { DynamicLevelData } from '../types';
import { LoadingSkeleton } from './LoadingSkeleton';
import { useDebounce } from '../hooks/useDebounce';

export const DataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [showBDT, setShowBDT] = useState(false);
  const [bdtRates, setBdtRates] = useState<{ [key: string]: number }>({});
  const [isConverting, setIsConverting] = useState(false);
  const [levelData, setLevelData] = useState<DynamicLevelData[]>([]);
  const { currentRate, isLoadingRate } = useCurrencyRate();
  const { calculationSettings, levelFeeRules, settingsLoading } = useAppData();

  useEffect(() => {
    if (!settingsLoading && calculationSettings.length > 0 && levelFeeRules.length > 0) {
      calculateDataTableValues();
    }
  }, [settingsLoading, calculationSettings, levelFeeRules]);

  const calculateDataTableValues = () => {
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
    const parsedData: { fromLevel: number; toLevel: number; expNeeded: number }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const [fromLevel, toLevel, expNeeded] = lines[i].split(',');
      parsedData.push({
        fromLevel: parseInt(fromLevel),
        toLevel: parseInt(toLevel),
        expNeeded: parseInt(expNeeded)
      });
    }

    // Get settings with fallbacks
    const expPerHour = calculationSettings.find(s => s.setting_name === 'exp_per_hour')?.setting_value || 9000;
    const baseCostPerHour = calculationSettings.find(s => s.setting_name === 'base_cost_per_hour')?.setting_value || 0.2083;

    // Calculate dynamic values for each level step
    const dynamicData: DynamicLevelData[] = parsedData.map(step => {
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

    setLevelData(dynamicData);
  };

  const filteredData = levelData.filter(item =>
    item.fromLevel.toString().includes(debouncedSearchTerm) ||
    item.toLevel.toString().includes(debouncedSearchTerm)
  );

  const handleConvertToBDT = async () => {
    if (!currentRate) {
      alert('Currency rate not available. Please try again.');
      return;
    }
    
    setIsConverting(true);
    
    // Use the cached current rate to convert all prices instantly
    const rates: { [key: string]: number } = {};
    
    for (const item of levelData) {
      const bdtAmount = item.costUSD * currentRate;
      rates[`${item.fromLevel}-${item.toLevel}`] = bdtAmount;
    }
    
    setBdtRates(rates);
    setShowBDT(true);
    setIsConverting(false);
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 pt-4 md:pt-0">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Price List
          </h2>
          <p className="text-gray-400 text-base md:text-lg px-4">
            Complete pricing breakdown for each level progression
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 md:mb-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search levels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-gray-600/50 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Current Rate Display */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/30 rounded-xl px-4 py-2">
                <div className="text-center">
                  <p className="text-yellow-400 text-xs uppercase tracking-wider">Current Rate</p>
                  <p className="text-white font-bold">
                    {isLoadingRate ? 'Loading...' : `1 USD = ${currentRate?.toFixed(2)} BDT`}
                  </p>
                </div>
              </div>

              {/* Convert Button */}
              <button
                onClick={handleConvertToBDT}
                disabled={isConverting}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isConverting ? 'Converting...' : 'Convert to BDT'}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-cyan-400/20 shadow-2xl shadow-cyan-500/20 overflow-hidden">
          {settingsLoading ? (
            <LoadingSkeleton type="table" />
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-b border-cyan-400/30">
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-cyan-400 font-bold uppercase tracking-wider text-sm md:text-base">
                    Level Range
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-cyan-400 font-bold uppercase tracking-wider text-sm md:text-base">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3 md:w-4 h-3 md:h-4" />
                      <span className="hidden sm:inline">EXP Needed</span>
                      <span className="sm:hidden">EXP</span>
                    </div>
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-cyan-400 font-bold uppercase tracking-wider text-sm md:text-base">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 md:w-4 h-3 md:h-4" />
                      <span className="hidden sm:inline">Time Required</span>
                      <span className="sm:hidden">Time</span>
                    </div>
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-cyan-400 font-bold uppercase tracking-wider text-sm md:text-base">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-3 md:w-4 h-3 md:h-4" />
                      <span>Cost</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={`${item.fromLevel}-${item.toLevel}`}
                    className="border-b border-cyan-400/20 hover:bg-cyan-500/5 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-xs md:text-sm hover:from-cyan-500/30 hover:to-blue-600/30 transition-all duration-300">
                          {item.fromLevel}
                        </div>
                        <div className="w-3 md:w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-300"></div>
                        <div className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-md border border-purple-400/40 rounded-lg flex items-center justify-center text-purple-400 font-bold text-xs md:text-sm hover:from-purple-500/30 hover:to-pink-600/30 transition-all duration-300">
                          {item.toLevel}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-white font-bold text-sm md:text-lg font-numbers">
                        {item.expNeeded.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-cyan-400 font-medium text-sm md:text-base font-numbers">
                        {formatTime(item.totalHours)}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex flex-col">
                        <span className="text-green-400 font-bold text-sm md:text-base font-numbers">
                          ${item.costUSD.toFixed(2)}
                        </span>
                        {showBDT && bdtRates[`${item.fromLevel}-${item.toLevel}`] && (
                          <span className="text-green-300 font-medium text-xs md:text-sm font-numbers">
                            {bdtRates[`${item.fromLevel}-${item.toLevel}`].toFixed(0)} BDT
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};