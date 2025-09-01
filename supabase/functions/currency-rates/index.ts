import { createClient } from 'npm:@supabase/supabase-js@2';

interface ExchangeRateResponse {
  date: string;
  base_code: string;
  rates: {
    [key: string]: number;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    // Check if we have a recent rate in cache
    const { data: cachedRate, error: fetchError } = await supabase
      .from('currency_rates')
      .select('*')
      .eq('from_currency', 'USD')
      .eq('to_currency', 'BDT')
      .gte('updated_at', twelveHoursAgo.toISOString())
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (!fetchError && cachedRate) {
      // Return cached rate
      return new Response(
        JSON.stringify({
          rate: cachedRate.rate,
          cached: true,
          updated_at: cachedRate.updated_at
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    // Fetch new rate from external API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }
    
    const data: ExchangeRateResponse = await response.json();
    const rate = data.rates.BDT;
    
    if (!rate) {
      throw new Error('BDT rate not found in response');
    }

    // Store the new rate in cache
    const { error: upsertError } = await supabase
      .from('currency_rates')
      .upsert({
        from_currency: 'USD',
        to_currency: 'BDT',
        rate: rate,
        updated_at: now.toISOString()
      }, {
        onConflict: 'from_currency,to_currency'
      });

    if (upsertError) {
      console.error('Error caching rate:', upsertError);
    }

    return new Response(
      JSON.stringify({
        rate: rate,
        cached: false,
        updated_at: now.toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    );

  } catch (error) {
    console.error('Error in currency-rates function:', error);
    
    // Fallback rate if everything fails
    return new Response(
      JSON.stringify({
        rate: 120,
        cached: false,
        fallback: true,
        updated_at: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    );
  }
});