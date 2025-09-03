import { LevelData, CalculationResult } from '../types';
import { parseLevelData } from './csvParser';

export const calculateLevelProgression = (currentLevel: number, desiredLevel: number): CalculationResult => {
  const levelData = parseLevelData();
  
  if (currentLevel >= desiredLevel) {
    return {
      totalTime: 0,
      totalCost: 0,
      totalExp: 0,
      levelSteps: []
    };
  }

  const relevantSteps = levelData.filter(
    step => step.fromLevel >= currentLevel && step.fromLevel < desiredLevel
  );

  const totalTime = relevantSteps.reduce((sum, step) => sum + step.totalHours, 0);
  const totalCost = relevantSteps.reduce((sum, step) => sum + step.costUSD, 0);
  const totalExp = relevantSteps.reduce((sum, step) => sum + step.expNeeded, 0);

  return {
    totalTime,
    totalCost,
    totalExp,
    levelSteps: relevantSteps
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