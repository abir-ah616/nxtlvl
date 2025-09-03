import { LevelData, DynamicLevelData, CalculationResult } from '../types';
import { parseLevelData } from './csvParser';
import { supabase } from '../lib/supabase';

export const calculateLevelProgression = async (currentLevel: number, desiredLevel: number): Promise<CalculationResult> => {
  const levelData = parseLevelData();
  
  if (currentLevel >= desiredLevel) {
    return {
      totalTime: 0,
      totalCost: 0,
      totalExp: 0,
      levelSteps: []
    };
  }

  // Fetch calculation settings from Supabase
  const { data: settings, error: settingsError } = await supabase
    .from('calculation_settings')
    .select('*');

  if (settingsError) {
    console.error('Error fetching calculation settings:', settingsError);
    // Use fallback values
  }

  // Fetch level fee rules from Supabase
  const { data: feeRules, error: feeRulesError } = await supabase
    .from('level_fee_rules')
    .select('*');

  if (feeRulesError) {
    console.error('Error fetching fee rules:', feeRulesError);
  }

  // Extract settings with fallbacks
  const expPerHour = settings?.find(s => s.setting_name === 'exp_per_hour')?.setting_value || 9000;
  const baseCostPerHour = settings?.find(s => s.setting_name === 'base_cost_per_hour')?.setting_value || 0.2083;

  const relevantSteps = levelData.filter(
    step => step.fromLevel >= currentLevel && step.fromLevel < desiredLevel
  );

  // Calculate dynamic values for each step
  const dynamicSteps: DynamicLevelData[] = relevantSteps.map(step => {
    // Calculate time based on EXP needed and EXP per hour
    const totalHours = step.expNeeded / expPerHour;
    
    // Calculate base cost
    const baseCost = totalHours * baseCostPerHour;
    
    // Find applicable fee rule
    const applicableFeeRule = feeRules?.find(rule => 
      step.fromLevel >= rule.from_level && step.fromLevel <= rule.to_level
    );
    
    const additionalFee = applicableFeeRule?.additional_fee_usd || 0;
    const finalCost = baseCost + additionalFee;
    
    return {
      ...step,
      totalHours,
      costUSD: finalCost
    };
  });

  const totalTime = dynamicSteps.reduce((sum, step) => sum + step.totalHours, 0);
  const totalCost = dynamicSteps.reduce((sum, step) => sum + step.costUSD, 0);
  const totalExp = relevantSteps.reduce((sum, step) => sum + step.expNeeded, 0);

  return {
    totalTime,
    totalCost,
    totalExp,
    levelSteps: dynamicSteps
  };
};

export const formatTime = (hours: number): string => {
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  const minutes = Math.floor((hours % 1) * 60);

  if (days > 0) {
    return `${days}d ${remainingHours}h ${minutes}m`;
  } else if (remainingHours > 0) {
    return `${remainingHours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};