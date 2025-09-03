import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUSDToBDTRate } from '../utils/currencyConverter';

interface CurrencyRateContextType {
  currentRate: number | null;
  isLoadingRate: boolean;
  refreshRate: () => Promise<void>;
}

const CurrencyRateContext = createContext<CurrencyRateContextType | undefined>(undefined);

interface CurrencyRateProviderProps {
  children: ReactNode;
}

export const CurrencyRateProvider: React.FC<CurrencyRateProviderProps> = ({ children }) => {
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  const loadCurrentRate = async () => {
    try {
      setIsLoadingRate(true);
      const rate = await getUSDToBDTRate();
      setCurrentRate(rate);
    } catch (error) {
      console.error('Error loading current rate:', error);
      setCurrentRate(120); // Fallback rate
    } finally {
      setIsLoadingRate(false);
    }
  };

  const refreshRate = async () => {
    await loadCurrentRate();
  };

  useEffect(() => {
    loadCurrentRate();
  }, []);

  const value: CurrencyRateContextType = {
    currentRate,
    isLoadingRate,
    refreshRate
  };

  return (
    <CurrencyRateContext.Provider value={value}>
      {children}
    </CurrencyRateContext.Provider>
  );
};

export const useCurrencyRate = (): CurrencyRateContextType => {
  const context = useContext(CurrencyRateContext);
  if (context === undefined) {
    throw new Error('useCurrencyRate must be used within a CurrencyRateProvider');
  }
  return context;
};