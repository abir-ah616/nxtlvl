import React from 'react';

export const SectionDivider: React.FC = () => {
  return (
    <div className="relative py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main divider line */}
        <div className="relative flex items-center justify-center">
          {/* Left line */}
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-cyan-400/30"></div>
          
          {/* Center element */}
          <div className="relative mx-6 md:mx-8">
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-12 h-12 bg-cyan-400/20 rounded-full blur-lg animate-pulse"></div>
            
            {/* Main center circle */}
            <div className="relative w-8 h-8 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 backdrop-blur-md border border-cyan-400/50 rounded-full flex items-center justify-center">
              {/* Inner dot */}
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              
              {/* Rotating ring */}
              <div className="absolute inset-0 border border-cyan-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Right line */}
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-400/60 to-cyan-400/30"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${40 + Math.random() * 20}%`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Side accent lines */}
        <div className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 w-8 md:w-12 h-px bg-gradient-to-r from-cyan-400/40 to-transparent"></div>
        <div className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 w-8 md:w-12 h-px bg-gradient-to-l from-cyan-400/40 to-transparent"></div>
      </div>
    </div>
  );
};