import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border-t border-cyan-400/20 py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
          {/* Social Links */}
          <div className="flex justify-center md:justify-start space-x-4 md:space-x-6 order-2 md:order-1">
            <a
              href="https://facebook.com/your-page"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-md border border-blue-400/30 rounded-xl flex items-center justify-center hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              <svg className="w-5 md:w-6 h-5 md:h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/your-number"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 rounded-xl flex items-center justify-center hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-green-500/25"
            >
              <svg className="w-5 md:w-6 h-5 md:h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </a>
            <a
              href="https://discord.gg/your-server"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-md border border-indigo-400/30 rounded-xl flex items-center justify-center hover:from-indigo-500/30 hover:to-purple-600/30 hover:border-indigo-400/50 hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-500/25"
            >
              <img src="/discord.png" alt="Discord" className="w-5 md:w-6 h-5 md:h-6 object-contain" />
            </a>
          </div>

          {/* Made with love */}
          <div className="text-center order-1 md:order-2">
            <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm md:text-base">
              <span>Made with</span>
              <Heart className="w-3 md:w-4 h-3 md:h-4 text-red-400 animate-pulse" />
              <span>by</span>
              <a 
                href="https://mroppy.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 font-bold hover:text-cyan-300 transition-all duration-300 transform hover:scale-105 hover:glow"
              >
                MR. OPPY
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right order-3">
            <p className="text-gray-500 text-xs md:text-sm">
              © 2025 Next Level - FF. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};