export interface LevelData {
  fromLevel: number;
  toLevel: number;
  expNeeded: number;
  totalHours: number;
  timeDays: number;
  timeHours: number;
  costUSD: number;
}

export interface CalculationResult {
  totalTime: number;
  totalCost: number;
  totalExp: number;
  levelSteps: LevelData[];
}