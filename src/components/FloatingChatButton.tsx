import React, { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

export const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Options Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 animate-fadeIn">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/30 p-4 min-w-[200px]">
            <div className="space-y-3">
              <a
                href="https://discord.gg/your-server"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 backdrop-blur-md border border-indigo-400/30 rounded-xl hover:from-indigo-500/30 hover:to-purple-600/30 hover:border-indigo-400/50 transition-all duration-300 group"
              >
                <img src="/discord.png" alt="Discord" className="w-6 h-6 object-contain" />
                <span className="text-white font-medium group-hover:text-indigo-300">Discord</span>
              </a>
              
              <a
                href="https://wa.me/your-number"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transition-all duration-300 group"
              >
                <Phone className="w-6 h-6 text-green-400" />
                <span className="text-white font-medium group-hover:text-green-300">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-110 transition-all duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
        style={{
          animation: 'glow 2s ease-in-out infinite alternate'
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};