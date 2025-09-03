import React from 'react';

export const EnhancedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}
        ></div>

        {/* Digital Rain Effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={`rain-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${50 + Math.random() * 100}px`,
                animation: `digitalRain ${2 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Scanlines */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(transparent 50%, rgba(6, 182, 212, 0.03) 50%)',
            backgroundSize: '100% 4px',
            animation: 'scanlines 2s linear infinite'
          }}
        ></div>
      </div>

      {/* Enhanced Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" style={{ animation: 'orbFloat 8s ease-in-out infinite' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" style={{ animation: 'orbFloat 10s ease-in-out infinite', animationDelay: '2s' }}></div>
      <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl" style={{ animation: 'orbFloat 12s ease-in-out infinite', animationDelay: '4s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/6 rounded-full blur-3xl" style={{ animation: 'orbFloat 14s ease-in-out infinite', animationDelay: '6s' }}></div>
      <div className="absolute top-10 right-10 w-48 h-48 bg-yellow-500/6 rounded-full blur-3xl" style={{ animation: 'orbFloat 16s ease-in-out infinite', animationDelay: '8s' }}></div>
    </div>
  );
};