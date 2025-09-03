import React, { useState, useEffect } from 'react';
import { Settings, DollarSign, Zap, Save, RefreshCw, Calculator } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ConfirmationModal } from './ConfirmationModal';
import { NotificationModal } from './NotificationModal';

interface CalculationSetting {
  id: string;
  setting_name: string;
  setting_value: number;
  updated_at: string;
}

interface LevelFeeRule {
  id: string;
  from_level: number;
  to_level: number;
  additional_fee_usd: number;
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

interface CalculationSettingsManagerProps {
  setConfirmModal: React.Dispatch<React.SetStateAction<ModalState>>;
  setNotification: React.Dispatch<React.SetStateAction<NotificationState>>;
}

export const CalculationSettingsManager: React.FC<CalculationSettingsManagerProps> = ({ setConfirmModal, setNotification }) => {
  const [settings, setSettings] = useState<CalculationSetting[]>([]);
  const [feeRules, setFeeRules] = useState<LevelFeeRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expPerHour, setExpPerHour] = useState<number>(9000);
  const [baseCostPerHour, setBaseCostPerHour] = useState<number>(0.2083);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch calculation settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('calculation_settings')
        .select('*')
        .order('setting_name');

      if (settingsError) {
        console.error('Error fetching settings:', settingsError);
      } else {
        setSettings(settingsData || []);
        
        // Set individual values
        const expSetting = settingsData?.find(s => s.setting_name === 'exp_per_hour');
        const costSetting = settingsData?.find(s => s.setting_name === 'base_cost_per_hour');
        
        if (expSetting) setExpPerHour(expSetting.setting_value);
        if (costSetting) setBaseCostPerHour(costSetting.setting_value);
      }

      // Fetch level fee rules
      const { data: feeRulesData, error: feeRulesError } = await supabase
        .from('level_fee_rules')
        .select('*')
        .order('from_level');

      if (feeRulesError) {
        console.error('Error fetching fee rules:', feeRulesError);
      } else {
        setFeeRules(feeRulesData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingName: string, value: number) => {
    try {
      const { error } = await supabase
        .from('calculation_settings')
        .upsert({
          setting_name: settingName,
          setting_value: value
        }, {
          onConflict: 'setting_name'
        });

      if (error) {
        console.error('Error updating setting:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error updating setting: ' + error.message,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error updating setting',
        type: 'error'
      });
    }
  };

  const updateFeeRule = async (ruleId: string, additionalFee: number) => {
    try {
      const { error } = await supabase
        .from('level_fee_rules')
        .update({ additional_fee_usd: additionalFee })
        .eq('id', ruleId);

      if (error) {
        console.error('Error updating fee rule:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error updating fee rule: ' + error.message,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating fee rule:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error updating fee rule',
        type: 'error'
      });
    }
  };

  const handleSaveSettings = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Save Settings',
      message: 'Are you sure you want to save these calculation settings? This will affect all price calculations across the website.',
      onConfirm: () => performSaveSettings()
    });
  };

  const performSaveSettings = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
    setSaving(true);
    try {
      await updateSetting('exp_per_hour', expPerHour);
      await updateSetting('base_cost_per_hour', baseCostPerHour);
      
      // Update all fee rules
      for (const rule of feeRules) {
        await updateFeeRule(rule.id, rule.additional_fee_usd);
      }
      
      setNotification({
        isOpen: true,
        title: 'Success',
        message: 'Settings saved successfully!',
        type: 'success'
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error saving settings',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateFeeRuleValue = (ruleId: string, newValue: number) => {
    setFeeRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, additional_fee_usd: newValue }
        : rule
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 md:py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="text-cyan-400 font-medium ml-4">Loading calculation settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Calculation Settings
        </h2>
        <p className="text-gray-400 text-sm md:text-base px-4">Manage EXP rates, costs, and level fee rules</p>
      </div>

      {/* Global Settings */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center space-x-2">
          <Settings className="w-5 md:w-6 h-5 md:h-6 text-cyan-400" />
          <span>Global Settings</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2 md:space-y-3">
            <label className="block text-cyan-400 font-medium text-xs md:text-sm uppercase tracking-wider">
              EXP Per Hour
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-cyan-400" />
              <input
                type="number"
                value={expPerHour}
                onChange={(e) => setExpPerHour(parseFloat(e.target.value) || 0)}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-sm md:text-base"
                placeholder="9000"
              />
            </div>
            <p className="text-gray-500 text-xs md:text-sm">Average EXP gained per hour</p>
          </div>

          <div className="space-y-2 md:space-y-3">
            <label className="block text-cyan-400 font-medium text-xs md:text-sm uppercase tracking-wider">
              Base Cost Per Hour (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-green-400" />
              <input
                type="number"
                step="0.0001"
                value={baseCostPerHour}
                onChange={(e) => setBaseCostPerHour(parseFloat(e.target.value) || 0)}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg md:rounded-xl pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 text-sm md:text-base"
                placeholder="0.2083"
              />
            </div>
            <p className="text-gray-500 text-xs md:text-sm">Base cost per hour of service</p>
          </div>
        </div>
      </div>

      {/* Level Fee Rules */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-400/20 shadow-2xl shadow-purple-500/20">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center space-x-2">
          <Calculator className="w-5 md:w-6 h-5 md:h-6 text-purple-400" />
          <span>Level Fee Rules</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {feeRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-gradient-to-br from-purple-500/15 to-pink-600/15 backdrop-blur-xl rounded-lg md:rounded-xl p-3 md:p-4 border border-purple-400/30 shadow-xl shadow-purple-500/20"
            >
              <div className="text-center mb-2 md:mb-3">
                <h4 className="text-white font-bold text-sm md:text-base">
                  Level {rule.from_level}-{rule.to_level}
                </h4>
                <p className="text-gray-400 text-xs md:text-sm">Additional fee per level</p>
              </div>
              
              <div className="relative">
                <DollarSign className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-purple-400" />
                <input
                  type="number"
                  step="0.01"
                  value={rule.additional_fee_usd}
                  onChange={(e) => updateFeeRuleValue(rule.id, parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg pl-8 md:pl-10 pr-2 md:pr-4 py-1.5 md:py-2 text-white text-center focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 text-sm md:text-base"
                />
              </div>
            </div>
          ))}
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
              <span>Save All Settings</span>
            </>
          )}
        </button>

        <button
          onClick={fetchData}
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
        confirmText="Save Changes"
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