import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AvailableFont {
  id: string;
  name: string;
  font_family: string;
  google_fonts_link: string;
  category: string;
  is_active: boolean;
}

interface FontPreference {
  section: string;
  font_family: string;
  google_fonts_link?: string;
}

interface SocialLink {
  platform: string;
  url: string;
  display_name?: string;
  is_active: boolean;
}

interface CalculationSetting {
  setting_name: string;
  setting_value: number;
}

interface LevelFeeRule {
  id: string;
  from_level: number;
  to_level: number;
  additional_fee_usd: number;
}

interface CurrencyRateSetting {
  rate_source: 'api' | 'custom';
  custom_rate: number;
  is_active: boolean;
}

interface AppDataContextType {
  // Font preferences
  fontPreferences: FontPreference[];
  fontLoading: boolean;
  refreshFonts: () => Promise<void>;
  
  // Social links
  socialLinks: SocialLink[];
  socialLoading: boolean;
  getLinkByPlatform: (platform: string) => string | null;
  refreshSocialLinks: () => Promise<void>;
  
  // Calculation settings
  calculationSettings: CalculationSetting[];
  levelFeeRules: LevelFeeRule[];
  settingsLoading: boolean;
  refreshSettings: () => Promise<void>;
  
  // Currency rate settings
  currencyRateSettings: CurrencyRateSetting | null;
  currencySettingsLoading: boolean;
  refreshCurrencySettings: () => Promise<void>;
  
  // Global refresh
  refreshAllData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [fontPreferences, setFontPreferences] = useState<FontPreference[]>([]);
  const [fontLoading, setFontLoading] = useState(true);
  const [availableFonts, setAvailableFonts] = useState<AvailableFont[]>([]);
  
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [socialLoading, setSocialLoading] = useState(true);
  
  const [calculationSettings, setCalculationSettings] = useState<CalculationSetting[]>([]);
  const [levelFeeRules, setLevelFeeRules] = useState<LevelFeeRule[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(true);
  
  const [currencyRateSettings, setCurrencyRateSettings] = useState<CurrencyRateSetting | null>(null);
  const [currencySettingsLoading, setCurrencySettingsLoading] = useState(true);

  // Cache timestamps
  const [lastFontFetch, setLastFontFetch] = useState<number>(0);
  const [lastSocialFetch, setLastSocialFetch] = useState<number>(0);
  const [lastSettingsFetch, setLastSettingsFetch] = useState<number>(0);
  const [lastCurrencyFetch, setLastCurrencyFetch] = useState<number>(0);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const fetchFontPreferences = async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && fontPreferences.length > 0 && (now - lastFontFetch) < CACHE_DURATION) {
      return;
    }

    try {
      setFontLoading(true);
      
      // Fetch both font preferences and available fonts
      const [preferencesResponse, fontsResponse] = await Promise.all([
        supabase
          .from('font_preferences')
          .select('section, font_family, google_fonts_link'),
        supabase
          .from('available_fonts')
          .select('id, name, font_family, google_fonts_link, category, is_active')
          .eq('is_active', true)
      ]);

      if (preferencesResponse.error) {
        console.error('Error fetching font preferences:', preferencesResponse.error);
      } else {
        setFontPreferences(preferencesResponse.data || []);
      }

      if (fontsResponse.error) {
        console.error('Error fetching available fonts:', fontsResponse.error);
      } else {
        setAvailableFonts(fontsResponse.data || []);
      }

      // Apply fonts with both preferences and available fonts
      if (preferencesResponse.data && fontsResponse.data) {
        setLastFontFetch(now);
        applyFonts(preferencesResponse.data || [], fontsResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching font preferences:', error);
    } finally {
      setFontLoading(false);
    }
  };

  const fetchSocialLinks = async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && socialLinks.length > 0 && (now - lastSocialFetch) < CACHE_DURATION) {
      return;
    }

    try {
      setSocialLoading(true);
      const { data, error } = await supabase
        .from('social_links')
        .select('platform, url, display_name, is_active')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching social links:', error);
      } else {
        setSocialLinks(data || []);
        setLastSocialFetch(now);
      }
    } catch (error) {
      console.error('Error fetching social links:', error);
    } finally {
      setSocialLoading(false);
    }
  };

  const fetchCalculationSettings = async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && calculationSettings.length > 0 && (now - lastSettingsFetch) < CACHE_DURATION) {
      return;
    }

    try {
      setSettingsLoading(true);
      
      const [settingsResponse, feeRulesResponse] = await Promise.all([
        supabase.from('calculation_settings').select('setting_name, setting_value'),
        supabase.from('level_fee_rules').select('id, from_level, to_level, additional_fee_usd')
      ]);

      if (settingsResponse.error) {
        console.error('Error fetching calculation settings:', settingsResponse.error);
      } else {
        setCalculationSettings(settingsResponse.data || []);
      }

      if (feeRulesResponse.error) {
        console.error('Error fetching level fee rules:', feeRulesResponse.error);
      } else {
        setLevelFeeRules(feeRulesResponse.data || []);
      }

      setLastSettingsFetch(now);
    } catch (error) {
      console.error('Error fetching calculation settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchCurrencyRateSettings = async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && currencyRateSettings && (now - lastCurrencyFetch) < CACHE_DURATION) {
      return;
    }

    try {
      setCurrencySettingsLoading(true);
      const { data, error } = await supabase
        .from('currency_rate_settings')
        .select('rate_source, custom_rate, is_active')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching currency rate settings:', error);
        // Set default if no settings found
        setCurrencyRateSettings({ rate_source: 'api', custom_rate: 120, is_active: true });
      } else {
        setCurrencyRateSettings(data);
      }

      setLastCurrencyFetch(now);
    } catch (error) {
      console.error('Error fetching currency rate settings:', error);
      setCurrencyRateSettings({ rate_source: 'api', custom_rate: 120, is_active: true });
    } finally {
      setCurrencySettingsLoading(false);
    }
  };

  const applyFonts = (preferences: FontPreference[], availableFonts: AvailableFont[]) => {
    // Remove existing font manager links
    const existingLinks = document.querySelectorAll('link[data-font-manager]');
    existingLinks.forEach(link => link.remove());

    // Collect all unique Google Fonts links from preferences
    const fontLinks = new Set<string>();
    preferences.forEach(pref => {
      if (pref.google_fonts_link) {
        fontLinks.add(pref.google_fonts_link);
      }
    });

    // Add all active available fonts
    availableFonts.forEach(font => {
      if (font.is_active && font.google_fonts_link) {
        fontLinks.add(font.google_fonts_link);
      }
    });

    // Add preconnect links
    if (fontLinks.size > 0) {
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      preconnect1.setAttribute('data-font-manager', 'true');
      document.head.appendChild(preconnect1);

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      preconnect2.setAttribute('data-font-manager', 'true');
      document.head.appendChild(preconnect2);
    }

    // Add font links
    fontLinks.forEach(link => {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = link;
      fontLink.setAttribute('data-font-manager', 'true');
      document.head.appendChild(fontLink);
    });

    // Apply CSS custom properties
    const root = document.documentElement;
    preferences.forEach(pref => {
      root.style.setProperty(`--font-${pref.section}`, formatFontFamily(pref.font_family));
    });
  };

  const getLinkByPlatform = (platform: string): string | null => {
    const link = socialLinks.find(link => link.platform === platform);
    return link?.url || null;
  };

  const refreshAllData = async () => {
    await Promise.all([
      fetchFontPreferences(true),
      fetchSocialLinks(true),
      fetchCalculationSettings(true),
      fetchCurrencyRateSettings(true)
    ]);
  };

  useEffect(() => {
    // Initial load of all data
    Promise.all([
      fetchFontPreferences(),
      fetchSocialLinks(),
      fetchCalculationSettings(),
      fetchCurrencyRateSettings()
    ]);
  }, []);

  const value: AppDataContextType = {
    fontPreferences,
    fontLoading,
    refreshFonts: () => fetchFontPreferences(true),
    
    socialLinks,
    socialLoading,
    getLinkByPlatform,
    refreshSocialLinks: () => fetchSocialLinks(true),
    
    calculationSettings,
    levelFeeRules,
    settingsLoading,
    refreshSettings: () => fetchCalculationSettings(true),
    
    currencyRateSettings,
    currencySettingsLoading,
    refreshCurrencySettings: () => fetchCurrencyRateSettings(true),
    
    refreshAllData
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

// Helper function to format font family for CSS
const formatFontFamily = (fontFamily: string): string => {
  // Always wrap font family names in single quotes for consistency
  return `'${fontFamily}'`;
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};