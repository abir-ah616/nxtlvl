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