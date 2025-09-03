import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'from-red-500/20 to-pink-600/20',
          border: 'border-red-400/30',
          icon: 'text-red-400',
          confirmBtn: 'from-red-500/20 to-pink-600/20 border-red-400/30 hover:from-red-500/30 hover:to-pink-600/30 hover:border-red-400/50'
        };
      case 'warning':
        return {
          bg: 'from-yellow-500/20 to-orange-600/20',
          border: 'border-yellow-400/30',
          icon: 'text-yellow-400',
          confirmBtn: 'from-yellow-500/20 to-orange-600/20 border-yellow-400/30 hover:from-yellow-500/30 hover:to-orange-600/30 hover:border-yellow-400/50'
        };
      case 'info':
        return {
          bg: 'from-blue-500/20 to-indigo-600/20',
          border: 'border-blue-400/30',
          icon: 'text-blue-400',
          confirmBtn: 'from-blue-500/20 to-indigo-600/20 border-blue-400/30 hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed', width: '100vw', height: '100vh' }}>
      <div className={`bg-gradient-to-br ${styles.bg} backdrop-blur-xl rounded-2xl p-6 border ${styles.border} shadow-2xl max-w-md w-full animate-fadeIn`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${styles.bg} backdrop-blur-md border ${styles.border} rounded-xl flex items-center justify-center`}>
            <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 bg-gradient-to-r ${styles.confirmBtn} backdrop-blur-md text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2`}
          >
            <Check className="w-4 h-4" />
            <span>{confirmText}</span>
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-md border border-gray-400/30 text-white font-medium rounded-xl hover:from-gray-500/30 hover:to-gray-600/30 hover:border-gray-400/50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>{cancelText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};