import React from 'react';
import { MessageCircle, Phone, Users, Camera } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 pt-4 md:pt-0">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-fadeIn">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto animate-slideUp">
            Get in touch with us through any of these platforms. We're here to help you level up!
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Discord */}
          <a
            href="https://discord.gg/your-server"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-indigo-500/15 to-purple-600/15 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-indigo-400/30 shadow-xl shadow-indigo-500/20 transform hover:scale-105 transition-all duration-300 block"
          >
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-md border border-indigo-400/40 rounded-2xl flex items-center justify-center group-hover:animate-glow">
                <img src="/discord.png" alt="Discord" className="w-8 md:w-10 h-8 md:h-10 object-contain" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Discord Server</h3>
                <p className="text-gray-400 text-sm md:text-base">Join our community for instant support</p>
                <p className="text-indigo-400 font-medium text-sm md:text-base mt-1">Click to join</p>
              </div>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/your-number"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-green-500/15 to-emerald-600/15 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-400/30 shadow-xl shadow-green-500/20 transform hover:scale-105 transition-all duration-300 block"
          >
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/40 rounded-2xl flex items-center justify-center group-hover:animate-glow">
                <Phone className="w-8 md:w-10 h-8 md:h-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">WhatsApp</h3>
                <p className="text-gray-400 text-sm md:text-base">Direct message for quick responses</p>
                <p className="text-green-400 font-medium text-sm md:text-base mt-1">Send message</p>
              </div>
            </div>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com/your-page"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-blue-500/15 to-indigo-600/15 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-blue-400/30 shadow-xl shadow-blue-500/20 transform hover:scale-105 transition-all duration-300 block"
          >
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-md border border-blue-400/40 rounded-2xl flex items-center justify-center group-hover:animate-glow">
                <svg className="w-8 md:w-10 h-8 md:h-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Facebook</h3>
                <p className="text-gray-400 text-sm md:text-base">Contact us on Facebook</p>
                <p className="text-blue-400 font-medium text-sm md:text-base mt-1">Click to contact</p>
              </div>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/your-account"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-pink-500/15 to-rose-600/15 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-pink-400/30 shadow-xl shadow-pink-500/20 transform hover:scale-105 transition-all duration-300 block"
          >
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-pink-500/20 to-rose-600/20 backdrop-blur-md border border-pink-400/40 rounded-2xl flex items-center justify-center group-hover:animate-glow">
                <Camera className="w-8 md:w-10 h-8 md:h-10 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Instagram</h3>
                <p className="text-gray-400 text-sm md:text-base">Contact us on Instagram</p>
                <p className="text-pink-400 font-medium text-sm md:text-base mt-1">Click to contact</p>
              </div>
            </div>
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Why Contact Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-lg flex items-center justify-center mt-0.5">
                  <span className="text-cyan-400 text-sm">✓</span>
                </div>
                <div>
                  <p className="text-white font-medium">Quick Response</p>
                  <p className="text-gray-400 text-sm">We reply within minutes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/40 rounded-lg flex items-center justify-center mt-0.5">
                  <span className="text-green-400 text-sm">✓</span>
                </div>
                <div>
                  <p className="text-white font-medium">Custom Quotes</p>
                  <p className="text-gray-400 text-sm">Personalized pricing available</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-md border border-purple-400/40 rounded-lg flex items-center justify-center mt-0.5">
                  <span className="text-purple-400 text-sm">✓</span>
                </div>
                <div>
                  <p className="text-white font-medium">24/7 Support</p>
                  <p className="text-gray-400 text-sm">Always here to help</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-400/40 rounded-lg flex items-center justify-center mt-0.5">
                  <span className="text-yellow-400 text-sm">✓</span>
                </div>
                <div>
                  <p className="text-white font-medium">Secure Service</p>
                  <p className="text-gray-400 text-sm">Your account safety guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};