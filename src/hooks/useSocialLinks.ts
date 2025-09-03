import { useAppData } from '../contexts/AppDataContext';

export const useSocialLinks = () => {
  const { socialLinks, socialLoading, getLinkByPlatform, refreshSocialLinks } = useAppData();

  return {
    socialLinks,
    loading: socialLoading,
    getLinkByPlatform,
    refreshSocialLinks
  };
};