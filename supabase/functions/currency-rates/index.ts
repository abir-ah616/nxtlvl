import { createClient } from '@supabase/supabase-js';

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
  console.log('🚀 Currency rates function called');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  try {
    if (req.method === "OPTIONS") {
      console.log('✅ Handling OPTIONS request');
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    console.log('🔧 Initializing Supabase client...');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPrefix: supabaseUrl?.substring(0, 20) + '...'
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables');
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    console.log('⏰ Time check:', {
      now: now.toISOString(),
      twelveHoursAgo: twelveHoursAgo.toISOString()
    });

    // Check if we have a recent rate in cache
    console.log('🔍 Checking cache for recent rates...');
    
    // First, let's see what's in the table
    const { data: allRates, error: allRatesError } = await supabase
      .from('currency_rates')
      .select('*')
      .eq('from_currency', 'USD')
      .eq('to_currency', 'BDT');
    
    console.log('📊 All USD->BDT rates in database:', {
      count: allRates?.length || 0,
      rates: allRates?.map(r => ({
        rate: r.rate,
        updated_at: r.updated_at,
        age_hours: (now.getTime() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60)
      })) || [],
      error: allRatesError?.message
    });
    
    const { data: cachedRate, error: fetchError } = await supabase
      .from('currency_rates')
      .select('*')
      .eq('from_currency', 'USD')
      .eq('to_currency', 'BDT')
      .gte('updated_at', twelveHoursAgo.toISOString())
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    console.log('Cache check result:', {
      hasCachedRate: !!cachedRate,
      fetchError: fetchError?.message,
      fetchErrorCode: fetchError?.code,
      cacheData: cachedRate ? {
        rate: cachedRate.rate,
        updated_at: cachedRate.updated_at,
        age_hours: (now.getTime() - new Date(cachedRate.updated_at).getTime()) / (1000 * 60 * 60)
      } : null
    });

    // Check if we have a valid cached rate (not just no error)
    if (cachedRate && !fetchError) {
      console.log('✅ Using cached rate:', cachedRate.rate);
      // Return cached rate
      return new Response(
        JSON.stringify({
          rate: parseFloat(cachedRate.rate),
          cached: true,
          updated_at: cachedRate.updated_at,
          age_hours: (now.getTime() - new Date(cachedRate.updated_at).getTime()) / (1000 * 60 * 60)
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    } else {
      console.log('❌ No valid cached rate found, reason:', {
        hasCachedRate: !!cachedRate,
        errorMessage: fetchError?.message,
        errorCode: fetchError?.code
      });
    }

    console.log('🌐 Fetching fresh rate from external API...');
    
    // Fetch new rate from external API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ API request timeout after 8 seconds');
      controller.abort();
    }, 8000);
    
    try {
      const apiResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log('API response status:', apiResponse.status);
      
      if (!apiResponse.ok) {
        throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`);
      }
      
      const data: ExchangeRateResponse = await apiResponse.json();
      const rate = data.rates.BDT;
      
      console.log('API response data:', {
        hasRates: !!data.rates,
        bdtRate: rate,
        baseCode: data.base_code
      });
      
      if (!rate || typeof rate !== 'number') {
        throw new Error('Invalid BDT rate in API response');
      }

      console.log('💾 Caching new rate:', rate);
      
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
        console.error('❌ Error caching rate:', upsertError);
      } else {
        console.log('✅ Successfully cached new rate');
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

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('❌ External API fetch failed:', fetchError);
      
      // Try to get the most recent cached rate as fallback
      console.log('🔄 Trying to get stale cached rate as fallback...');
      const { data: lastCachedRate } = await supabase
        .from('currency_rates')
        .select('*')
        .eq('from_currency', 'USD')
        .eq('to_currency', 'BDT')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      console.log('Stale cache check:', {
        hasStaleRate: !!lastCachedRate,
        staleRate: lastCachedRate?.rate,
        staleUpdatedAt: lastCachedRate?.updated_at
      });

      if (lastCachedRate) {
        console.log('✅ Using stale cached rate:', lastCachedRate.rate);
        return new Response(
          JSON.stringify({
            rate: parseFloat(lastCachedRate.rate),
            cached: true,
            stale: true,
            updated_at: lastCachedRate.updated_at
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            }
          }
        );
      }

      console.log('⚠️ Using final fallback rate: 120');
      // Final fallback
      return new Response(
        JSON.stringify({
          rate: 120,
          cached: false,
          fallback: true,
          updated_at: now.toISOString()
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

  } catch (error) {
    console.error('💥 Critical error in currency-rates function:', error);
    
    return new Response(
      JSON.stringify({
        rate: 120,
        cached: false,
        fallback: true,
        error: error.message,
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