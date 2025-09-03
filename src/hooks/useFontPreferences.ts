import { useEffect } from 'react';
import { useAppData } from '../contexts/AppDataContext';

export const useFontPreferences = () => {
  const { fontPreferences, fontLoading, refreshFonts } = useAppData();

  return {
    fontPreferences,
    fontLoading,
    refreshFonts
  };
};