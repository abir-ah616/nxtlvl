export interface ExchangeRateResponse {
  date: string;
  base_code: string;
  rates: {
    [key: string]: number;
  };
}

let cachedRate: number | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getUSDToBDTRate = async (): Promise<number> => {
  const now = Date.now();
  
  // Return cached rate if it's still valid
  if (cachedRate && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedRate;
  }

  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }
    
    const data: ExchangeRateResponse = await response.json();
    const rate = data.rates.BDT;
    
    if (!rate) {
      throw new Error('BDT rate not found in response');
    }
    
    cachedRate = rate;
    lastFetchTime = now;
    
    return rate;
  } catch (error) {
    console.error('Error fetching USD to BDT rate:', error);
    // Fallback rate if API fails
    return 120; // Approximate USD to BDT rate
  }
};

export const convertUSDToBDT = async (usdAmount: number): Promise<number> => {
  const rate = await getUSDToBDTRate();
  return usdAmount * rate;
};