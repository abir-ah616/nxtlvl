interface CurrencyRateResponse {
  rate: number;
  cached: boolean;
  updated_at: string;
  fallback?: boolean;
}

export const getUSDToBDTRate = async (): Promise<number> => {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/currency-rates`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }
    
    const data: CurrencyRateResponse = await response.json();
    const rate = data.rate;
    
    if (!rate) {
      throw new Error('BDT rate not found in response');
    }
    
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
}