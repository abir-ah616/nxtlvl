import React, { useState, useEffect } from 'react';
import { DollarSign, Globe, Settings, Save, RefreshCw, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getUSDToBDTRate, getCachedUSDToBDTRate } from '../utils/currencyConverter';
import { ConfirmationModal } from './ConfirmationModal';
import { NotificationModal } from './NotificationModal';

interface CurrencyRateSetting {
  id: string;
  rate_source: 'api' | 'custom';
  custom_rate: number;
  is_active: boolean;
  updated_at: string;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

interface NotificationState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface CurrencyRateManagerProps {
  setConfirmModal: React.Dispatch<React.SetStateAction<ModalState>>;
  setNotification: React.Dispatch<React.SetStateAction<NotificationState>>;
}

export const CurrencyRateManager: React.FC<CurrencyRateManagerProps> = ({ setConfirmModal, setNotification }) => {
  const [settings, setSettings] = useState<CurrencyRateSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [cachedApiRate, setCachedApiRate] = useState<number | null>(null);
  const [freshApiRate, setFreshApiRate] = useState<number | null>(null);
  const [rateSource, setRateSource] = useState<'api' | 'custom'>('api');
  const [customRate, setCustomRate] = useState<number>(120);
  const [confirmModal, setConfirmModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [notification, setNotificationState] = useState<NotificationState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('currency_rate_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching currency rate settings:', error);
        // Create default setting if none exists
        await createDefaultSetting();
      } else {
        setSettings(data);
        setRateSource(data.rate_source);
        setCustomRate(data.custom_rate);
        // Load cached rate after settings are loaded
        await loadCachedRate();
      }
    } catch (error) {
      console.error('Error fetching currency rate settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('currency_rate_settings')
        .insert([{
          rate_source: 'api',
          custom_rate: 120,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating default setting:', error);
      } else {
        setSettings(data);
        setRateSource('api');
        setCustomRate(120);
        // Load cached rate after default settings are created
        await loadCachedRate();
      }
    } catch (error) {
      console.error('Error creating default setting:', error);
    }
  };

  const loadCachedRate = async () => {
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('rate, updated_at')
        .eq('from_currency', 'USD')
        .eq('to_currency', 'BDT')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error loading cached rate:', error);
        setCachedApiRate(120); // Fallback
      } else {
        const rate = parseFloat(data.rate);
        setCachedApiRate(rate);
        console.log('Loaded cached rate:', rate);
      }
    } catch (error) {
      console.error('Error loading cached rate:', error);
      setCachedApiRate(120); // Fallback
    }
  };

  const testApiRate = async () => {
    try {
      setTestingApi(true);
      const rate = await getUSDToBDTRate();
      setFreshApiRate(rate);
      // Also update the cached rate display
      setCachedApiRate(rate);
    } catch (error) {
      console.error('Error testing API rate:', error);
      setFreshApiRate(null);
    } finally {
      setTestingApi(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setConfirmModal({
      isOpen: true,
      title: 'Save Currency Settings',
      message: 'Are you sure you want to save these currency rate settings? This will affect all price calculations and currency conversions across the website.',
      onConfirm: () => performSaveSettings()
    });
  };

  const performSaveSettings = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });

    setSaving(true);
    try {
      const { error } = await supabase
        .from('currency_rate_settings')
        .update({
          rate_source: rateSource,
          custom_rate: customRate
        })
        .eq('id', settings.id);

      if (error) {
        console.error('Error updating currency rate settings:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error updating settings: ' + error.message,
          type: 'error'
        });
      } else {
        setNotification({
          isOpen: true,
          title: 'Success',
          message: 'Currency rate settings saved successfully!',
          type: 'success'
        });
        fetchSettings();
        // Refresh the currency rate context
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating currency rate settings:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error updating settings',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 md:py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="text-cyan-400 font-medium ml-4">Loading currency settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Currency Rate Management
        </h2>
        <p className="text-gray-400 text-sm md:text-base px-4">Choose between live API rates or set a custom USD to BDT rate</p>
      </div>

      {/* Current API Rate Display */}
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-400/20 shadow-2xl shadow-blue-500/20">
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center space-x-2">
          <Globe className="w-5 md:w-6 h-5 md:h-6 text-blue-400" />
          <span>Cached API Rate</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <p className="text-blue-400 text-xs md:text-sm uppercase tracking-wider mb-1">Current Exchange Rate</p>
            <p className="text-lg md:text-2xl font-bold text-white">
              {cachedApiRate ? `1 USD = ${cachedApiRate.toFixed(2)} BDT` : 'Loading...'}
            </p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              Cached rate from Supabase (updates every 12 hours)
            </p>
            {freshApiRate && freshApiRate !== cachedApiRate && (
              <p className="text-green-400 text-xs md:text-sm mt-1">
                Fresh API rate: {freshApiRate.toFixed(2)} BDT
              </p>
            )}
          </div>
          
          <button
            onClick={testApiRate}
            disabled={testingApi}
            className="w-full sm:w-auto px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-md border border-blue-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 text-sm md:text-base"
          >
            <RefreshCw className={`w-3 md:w-4 h-3 md:h-4 ${testingApi ? 'animate-spin' : ''}`} />
            <span>Test API</span>
          </button>
        </div>
      </div>

      {/* Rate Source Selection */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center space-x-2">
          <Settings className="w-5 md:w-6 h-5 md:h-6 text-cyan-400" />
          <span>Rate Source Configuration</span>
        </h3>
        
        <div className="space-y-4 md:space-y-6">
          {/* API Rate Option */}
          <div className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${
            rateSource === 'api' 
              ? 'border-blue-400/50 bg-blue-500/10' 
              : 'border-gray-600/30 bg-gray-500/5 hover:border-blue-400/30'
          }`}>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="rateSource"
                value="api"
                checked={rateSource === 'api'}
                onChange={(e) => setRateSource(e.target.value as 'api' | 'custom')}
                className="w-4 md:w-5 h-4 md:h-5 text-blue-400 bg-black/40 border border-blue-400/30 rounded-full focus:ring-2 focus:ring-blue-400/20 mt-1"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
                    <h4 className="text-white font-bold text-sm md:text-base">Live API Rate</h4>
                  </div>
                  <span className="px-2 py-0.5 md:py-1 bg-green-500/20 border border-green-400/30 rounded text-green-400 text-xs font-medium w-fit">
                    Recommended
                  </span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-3">
                  Automatically fetches the latest USD to BDT exchange rate from a reliable API. 
                  Uses cached rate from Supabase (updated every 12 hours) for better performance.
                </p>
                <div className="bg-black/20 border border-blue-400/20 rounded-lg p-2 md:p-3">
                  <p className="text-blue-400 text-xs md:text-sm font-medium">
                    Cached Rate: {cachedApiRate ? `${cachedApiRate.toFixed(2)} BDT` : 'Loading...'}
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Custom Rate Option */}
          <div className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${
            rateSource === 'custom' 
              ? 'border-cyan-400/50 bg-cyan-500/10' 
              : 'border-gray-600/30 bg-gray-500/5 hover:border-cyan-400/30'
          }`}>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="rateSource"
                value="custom"
                checked={rateSource === 'custom'}
                onChange={(e) => setRateSource(e.target.value as 'api' | 'custom')}
                className="w-4 md:w-5 h-4 md:h-5 text-cyan-400 bg-black/40 border border-cyan-400/30 rounded-full focus:ring-2 focus:ring-cyan-400/20 mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 md:w-5 h-4 md:h-5 text-cyan-400" />
                  <h4 className="text-white font-bold text-sm md:text-base">Custom Rate</h4>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-3">
                  Set your own fixed USD to BDT exchange rate. This rate will be used for all 
                  calculations until you change it manually.
                </p>
                <div className="relative">
                  <DollarSign className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-cyan-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={customRate}
                    onChange={(e) => setCustomRate(parseFloat(e.target.value) || 120)}
                    disabled={rateSource !== 'custom'}
                    className={`w-full bg-black/40 border rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                      rateSource === 'custom'
                        ? 'border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 pl-8 md:pl-12 pr-2 md:pr-4 py-2 md:py-3 text-sm md:text-base'
                        : 'border-gray-600/30 opacity-50 cursor-not-allowed'
                    }`}
                    placeholder="120.00"
                  />
                </div>
                <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">
                  Enter the BDT amount for 1 USD (e.g., 120.50)
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-400/20 shadow-2xl shadow-purple-500/20">
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 md:w-6 h-5 md:h-6 text-purple-400" />
          <span>Rate Preview</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-purple-500/15 to-pink-600/15 backdrop-blur-xl rounded-lg md:rounded-xl p-3 md:p-4 border border-purple-400/30">
            <p className="text-purple-400 text-xs md:text-sm uppercase tracking-wider mb-1">Selected Rate</p>
            <p className="text-lg md:text-2xl font-bold text-white">
              {rateSource === 'custom' ? `${customRate.toFixed(2)} BDT` : (cachedApiRate ? `${cachedApiRate.toFixed(2)} BDT` : 'Loading...')}
            </p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              {rateSource === 'custom' ? 'Custom rate' : 'Cached API rate'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/15 to-pink-600/15 backdrop-blur-xl rounded-lg md:rounded-xl p-3 md:p-4 border border-purple-400/30">
            <p className="text-purple-400 text-xs md:text-sm uppercase tracking-wider mb-1">$10 USD =</p>
            <p className="text-lg md:text-xl font-bold text-white">
              {rateSource === 'custom' 
                ? `${(customRate * 10).toFixed(0)} BDT`
                : (cachedApiRate ? `${(cachedApiRate * 10).toFixed(0)} BDT` : 'Loading...')
              }
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/15 to-pink-600/15 backdrop-blur-xl rounded-lg md:rounded-xl p-3 md:p-4 border border-purple-400/30">
            <p className="text-purple-400 text-xs md:text-sm uppercase tracking-wider mb-1">$50 USD =</p>
            <p className="text-lg md:text-xl font-bold text-white">
              {rateSource === 'custom' 
                ? `${(customRate * 50).toFixed(0)} BDT`
                : (cachedApiRate ? `${(cachedApiRate * 50).toFixed(0)} BDT` : 'Loading...')
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-bold rounded-lg md:rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-3 md:h-4 w-3 md:w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 md:w-5 h-4 md:h-5" />
              <span>Save Rate Settings</span>
            </>
          )}
        </button>

        <button
          onClick={() => { fetchSettings(); loadCachedRate(); }}
          className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-md border border-blue-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 text-sm md:text-base"
        >
          <RefreshCw className="w-3 md:w-4 h-3 md:h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        confirmText="Save Settings"
        cancelText="Cancel"
        type="warning"
      />

      <NotificationModal
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </div>
  );
};
