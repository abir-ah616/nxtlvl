export interface LevelData {
  fromLevel: number;
  toLevel: number;
  expNeeded: number;
}

export interface DynamicLevelData extends LevelData {
  totalHours: number;
  costUSD: number;
}

export interface CalculationResult {
  totalTime: number;
  totalCost: number;
  totalExp: number;
  levelSteps: DynamicLevelData[];
}

export interface Review {
  id: string;
  name: string;
  uid: string;
  profile_pic_url?: string;
  review_text: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}