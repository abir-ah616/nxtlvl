import React from 'react';
import { Heart, Code, Cpu } from 'lucide-react';
import { useSocialLinks } from '../hooks/useSocialLinks';

export const Footer: React.FC = () => {
  const { getLinkByPlatform } = useSocialLinks();

  return (
    <footer className="relative z-10 mt-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-cyan-900/10 to-transparent">
        {/* Circuit Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-400/60 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Floating Data Particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 backdrop-blur-2xl border-t border-cyan-400/20">
        {/* Glowing Top Border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-pulse"></div>
        
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <div className="relative">
                  <img src="/logo.png" alt="Next Level FF" className="w-10 h-10 object-contain" />
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-logo">
                    NEXT LEVEL - FF
                  </h3>
                  <div className="flex items-center justify-center md:justify-start space-x-2 mt-1">
                    <Cpu className="w-3 h-3 text-cyan-400/60" />
                    <span className="text-xs text-cyan-400/80 font-mono tracking-wider">FF level up service</span>
                    <Cpu className="w-3 h-3 text-cyan-400/60" />
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-4 font-body">
                Professional Free Fire level up service. Get to your desired level quickly, safely, and affordably.
              </p>
            </div>

            {/* Social Matrix */}
            <div className="text-center md:text-right">
              <h4 className="text-base font-bold text-white mb-4 flex items-center justify-center md:justify-end space-x-2 font-headings">
                <span>CONTACT US</span>
              </h4>
              
              <div className="flex justify-center md:justify-end space-x-3">
                {/* Discord */}
                <a
                  href={getLinkByPlatform('discord') || 'https://discord.gg/REB74heWQc'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-indigo-500/15 to-purple-600/15 backdrop-blur-md rounded-lg p-3 border border-indigo-400/30 hover:border-indigo-400/60 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-600/0 group-hover:from-indigo-500/10 group-hover:to-purple-600/10 rounded-lg transition-all duration-300"></div>
                  <div className="relative">
                    <img src="/discord.png" alt="Discord" className="w-5 h-5 object-contain" />
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={getLinkByPlatform('whatsapp') || 'https://wa.me/8801764696964'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-green-500/15 to-emerald-600/15 backdrop-blur-md rounded-lg p-3 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-600/0 group-hover:from-green-500/10 group-hover:to-emerald-600/10 rounded-lg transition-all duration-300"></div>
                  <div className="relative">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href={getLinkByPlatform('facebook') || 'https://www.facebook.com/mroppy69'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-blue-500/15 to-indigo-600/15 backdrop-blur-md rounded-lg p-3 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-600/0 group-hover:from-blue-500/10 group-hover:to-indigo-600/10 rounded-lg transition-all duration-300"></div>
                  <div className="relative">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href={getLinkByPlatform('instagram') || 'https://www.instagram.com/mroppy21/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-pink-500/15 to-rose-600/15 backdrop-blur-md rounded-lg p-3 border border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-600/0 group-hover:from-pink-500/10 group-hover:to-rose-600/10 rounded-lg transition-all duration-300"></div>
                  <div className="relative">
                    <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-6 pt-4 border-t border-cyan-400/20">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-400 font-mono text-xs">©</span>
                  </div>
                  <span className="text-gray-400 font-mono text-sm">2025 NEXT LEVEL FF</span>
                </div>
              </div>

              {/* Developer Credits */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-400 text-sm font-body">
                  <span>Crafted with</span>
                  <Heart className="w-3 h-3 text-red-400 animate-pulse" />
                  <span>by</span>
                </div>
                <a 
                  href="https://mroppy.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md border border-cyan-400/20 rounded-lg hover:border-cyan-400/40 hover:scale-105 transition-all duration-300 group"
                >
                  <Code className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-cyan-400 font-mono text-sm tracking-wider group-hover:text-cyan-300">MR.OPPY</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Glow Effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
      </div>
    </footer>
  );
};