import React from 'react';
import { Home, Calculator, List } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'calculator' | 'pricelist' | 'contact' | 'admin';
  onTabChange: (tab: 'home' | 'calculator' | 'pricelist' | 'contact' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Next Level FF" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Next Level - FF
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">Free Fire level up service</p>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onTabChange('home')}
              className={`px-3 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50'
              }`}
            >
              <Home className="w-4 h-4 inline md:mr-2" />
              <span className="hidden md:inline">Home</span>
            </button>
            <button
              onClick={() => onTabChange('calculator')}
              className={`px-3 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50'
              }`}
            >
              <Calculator className="w-4 h-4 inline md:mr-2" />
              <span className="hidden md:inline">Calculator</span>
            </button>
            <button
              onClick={() => onTabChange('pricelist')}
              className={`px-3 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'pricelist'
                  ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50'
              }`}
            >
              <List className="w-4 h-4 inline md:mr-2" />
              <span className="hidden md:inline">Price List</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};