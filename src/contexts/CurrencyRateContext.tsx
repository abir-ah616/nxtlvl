import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAppData } from './AppDataContext';

interface CurrencyRateContextType {
  currentRate: number | null;
  isLoadingRate: boolean;
  refreshRate: () => Promise<void>;
  rateSource: 'api' | 'custom';
}

const CurrencyRateContext = createContext<CurrencyRateContextType | undefined>(undefined);

interface CurrencyRateProviderProps {
  children: ReactNode;
}

export const CurrencyRateProvider: React.FC<CurrencyRateProviderProps> = ({ children }) => {
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [rateSource, setRateSource] = useState<'api' | 'custom'>('api');
  const { currencyRateSettings, currencySettingsLoading } = useAppData();

  const loadCurrentRate = async () => {
    try {
      setIsLoadingRate(true);
      
      // Wait for currency settings to load
      if (currencySettingsLoading || !currencyRateSettings) {
        return;
      }

      setRateSource(currencyRateSettings.rate_source);

      if (currencyRateSettings.rate_source === 'custom') {
        // Use custom rate
        setCurrentRate(currencyRateSettings.custom_rate);
      } else {
        // Use cached API rate from Supabase
        try {
          const { data, error } = await supabase
            .from('currency_rates')
            .select('rate')
            .eq('from_currency', 'USD')
            .eq('to_currency', 'BDT')
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

          if (error) {
            console.error('Error fetching cached rate:', error);
            setCurrentRate(120); // Fallback
          } else {
            const rate = parseFloat(data.rate);
            setCurrentRate(rate);
          }
        } catch (error) {
          console.error('Error fetching cached rate:', error);
          setCurrentRate(120); // Fallback
        }
      }
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
    if (!currencySettingsLoading && currencyRateSettings) {
      loadCurrentRate();
    }
  }, [currencySettingsLoading, currencyRateSettings]);

  const value: CurrencyRateContextType = {
    currentRate,
    isLoadingRate,
    refreshRate,
    rateSource
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