import React from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500/20 to-emerald-600/20',
          border: 'border-green-400/30',
          icon: 'text-green-400',
          iconBg: 'from-green-500/20 to-emerald-600/20',
          iconComponent: Check
        };
      case 'error':
        return {
          bg: 'from-red-500/20 to-pink-600/20',
          border: 'border-red-400/30',
          icon: 'text-red-400',
          iconBg: 'from-red-500/20 to-pink-600/20',
          iconComponent: X
        };
      case 'warning':
        return {
          bg: 'from-yellow-500/20 to-orange-600/20',
          border: 'border-yellow-400/30',
          icon: 'text-yellow-400',
          iconBg: 'from-yellow-500/20 to-orange-600/20',
          iconComponent: AlertTriangle
        };
      case 'info':
        return {
          bg: 'from-blue-500/20 to-indigo-600/20',
          border: 'border-blue-400/30',
          icon: 'text-blue-400',
          iconBg: 'from-blue-500/20 to-indigo-600/20',
          iconComponent: Info
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.iconComponent;

  // Auto close after 3 seconds for success messages
  React.useEffect(() => {
    if (type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div className={`fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`} style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed', width: '100vw', height: '100vh' }}>
      <div className={`bg-gradient-to-br ${styles.bg} backdrop-blur-xl rounded-2xl p-6 border ${styles.border} shadow-2xl max-w-md w-full animate-fadeIn`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${styles.iconBg} backdrop-blur-md border ${styles.border} rounded-xl flex items-center justify-center`}>
            <IconComponent className={`w-6 h-6 ${styles.icon}`} />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-md border border-gray-400/30 text-white font-medium rounded-xl hover:from-gray-500/30 hover:to-gray-600/30 hover:border-gray-400/50 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};