interface CurrencyRateResponse {
  rate: number;
  cached: boolean;
  updated_at: string;
  fallback?: boolean;
  stale?: boolean;
}

// Get cached rate from Supabase without calling external API
export const getCachedUSDToBDTRate = async (): Promise<number> => {
  try {
    const { data, error } = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/currency_rates?from_currency=eq.USD&to_currency=eq.BDT&order=updated_at.desc&limit=1`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    
    if (error || !data || data.length === 0) {
      console.log('No cached rate found, using fallback');
      return 120; // Fallback rate
    }
    
    return parseFloat(data[0].rate);
  } catch (error) {
    console.error('Error fetching cached rate:', error);
    return 120; // Fallback rate
  }
};

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