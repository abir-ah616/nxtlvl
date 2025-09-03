import React from 'react';
import { Home, Calculator, List } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'calculator' | 'pricelist' | 'contact' | 'admin';
  onTabChange: (tab: 'home' | 'calculator' | 'pricelist' | 'contact' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-2xl border-b border-cyan-500/30">
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-pulse"></div>
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Brand Section */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative">
              <img src="/logo.png" alt="Next Level FF" className="w-10 md:w-12 h-10 md:h-12 object-contain" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-logo">
                <span>NEXT LEVEL</span>
                <span className="hidden sm:inline text-purple-400"> - FF</span>
              </h1>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-cyan-400/80 font-mono tracking-wider">FF LEVEL SERVICE</p>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Navigation Buttons */}
          <div className="flex space-x-1 md:space-x-2">
            <button
              onClick={() => onTabChange('home')}
              className={`relative overflow-hidden px-2 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 whitespace-nowrap font-navigation group ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/50'
                  : 'bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md border border-cyan-400/20 text-cyan-100 hover:from-cyan-500/30 hover:to-blue-600/30 hover:text-white hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
            >
              {/* Scanning line effect for active tab */}
              {activeTab === 'home' && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanLine"></div>
              )}
              <div className="relative flex items-center space-x-1 md:space-x-2">
                <Home className="w-4 h-4 text-current" />
                <span className="hidden md:inline text-sm lg:text-base">Home</span>
              </div>
            </button>
            
            <button
              onClick={() => onTabChange('calculator')}
              className={`relative overflow-hidden px-2 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 whitespace-nowrap font-navigation group ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/50'
                  : 'bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md border border-cyan-400/20 text-cyan-100 hover:from-cyan-500/30 hover:to-blue-600/30 hover:text-white hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
            >
              {activeTab === 'calculator' && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanLine"></div>
              )}
              <div className="relative flex items-center space-x-1 md:space-x-2">
                <Calculator className="w-4 h-4 text-current" />
                <span className="hidden md:inline text-sm lg:text-base">Calculator</span>
              </div>
            </button>
            
            <button
              onClick={() => onTabChange('pricelist')}
              className={`relative overflow-hidden px-2 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 whitespace-nowrap font-navigation group ${
                activeTab === 'pricelist'
                  ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/50'
                  : 'bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md border border-cyan-400/20 text-cyan-100 hover:from-cyan-500/30 hover:to-blue-600/30 hover:text-white hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
            >
              {activeTab === 'pricelist' && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanLine"></div>
              )}
              <div className="relative flex items-center space-x-1 md:space-x-2">
                <List className="w-4 h-4 text-current" />
                <span className="hidden md:inline text-sm lg:text-base">Price List</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
      </div>
    </nav>
  );
};