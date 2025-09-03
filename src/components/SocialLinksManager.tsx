import React, { useState, useEffect } from 'react';
import { Link, Save, RefreshCw, ExternalLink, MessageCircle, Phone, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ConfirmationModal } from './ConfirmationModal';
import { NotificationModal } from './NotificationModal';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_name?: string;
  is_active: boolean;
  updated_at: string;
}

const PLATFORM_CONFIG = {
  discord: {
    icon: MessageCircle,
    color: 'indigo',
    label: 'Discord Server',
    placeholder: 'https://discord.gg/your-invite-code'
  },
  whatsapp: {
    icon: Phone,
    color: 'green',
    label: 'WhatsApp',
    placeholder: 'https://wa.me/your-phone-number'
  },
  facebook: {
    icon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'blue',
    label: 'Facebook',
    placeholder: 'https://www.facebook.com/your-profile'
  },
  instagram: {
    icon: Camera,
    color: 'pink',
    label: 'Instagram',
    placeholder: 'https://www.instagram.com/your-profile/'
  }
};

export const SocialLinksManager = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedLinks, setEditedLinks] = useState<{ [key: string]: string }>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('platform');

      if (error) {
        console.error('Error fetching social links:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error fetching social links: ' + error.message,
          type: 'error'
        });
      } else {
        setSocialLinks(data || []);
        // Initialize edited links with current values
        const initialEdits: { [key: string]: string } = {};
        data?.forEach(link => {
          initialEdits[link.platform] = link.url;
        });
        setEditedLinks(initialEdits);
      }
    } catch (error) {
      console.error('Error fetching social links:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error fetching social links',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLink = async (platform: string, url: string) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .update({ url })
        .eq('platform', platform);

      if (error) {
        console.error('Error updating social link:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating social link:', error);
      throw error;
    }
  };

  const handleSaveAll = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Save Social Links',
      message: 'Are you sure you want to save all social link changes? This will update the contact information across the website.',
      onConfirm: () => performSaveAll()
    });
  };

  const performSaveAll = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
    setSaving(true);
    try {
      // Update all changed links
      const updatePromises = Object.entries(editedLinks).map(([platform, url]) => {
        const originalLink = socialLinks.find(link => link.platform === platform);
        if (originalLink && originalLink.url !== url) {
          return updateSocialLink(platform, url);
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      
      setNotification({
        isOpen: true,
        title: 'Success',
        message: 'Social links updated successfully!',
        type: 'success'
      });
      fetchSocialLinks(); // Refresh data
    } catch (error) {
      console.error('Error saving social links:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error saving social links',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLinkChange = (platform: string, url: string) => {
    setEditedLinks(prev => ({
      ...prev,
      [platform]: url
    }));
  };

  const toggleLinkActive = async (platform: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .update({ is_active: isActive })
        .eq('platform', platform);

      if (error) {
        console.error('Error toggling link active state:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error updating link status: ' + error.message,
          type: 'error'
        });
      } else {
        fetchSocialLinks();
      }
    } catch (error) {
      console.error('Error toggling link active state:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error updating link status',
        type: 'error'
      });
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      indigo: {
        bg: 'from-indigo-500/15 to-purple-600/15',
        border: 'border-indigo-400/30',
        text: 'text-indigo-400',
        iconBg: 'from-indigo-500/20 to-purple-600/20',
        iconBorder: 'border-indigo-400/40',
        button: 'from-indigo-500/20 to-purple-600/20 border-indigo-400/30 hover:from-indigo-500/30 hover:to-purple-600/30 hover:border-indigo-400/50',
        input: 'border-indigo-500/30 focus:border-indigo-400 focus:ring-indigo-400/20'
      },
      green: {
        bg: 'from-green-500/15 to-emerald-600/15',
        border: 'border-green-400/30',
        text: 'text-green-400',
        iconBg: 'from-green-500/20 to-emerald-600/20',
        iconBorder: 'border-green-400/40',
        button: 'from-green-500/20 to-emerald-600/20 border-green-400/30 hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50',
        input: 'border-green-500/30 focus:border-green-400 focus:ring-green-400/20'
      },
      blue: {
        bg: 'from-blue-500/15 to-indigo-600/15',
        border: 'border-blue-400/30',
        text: 'text-blue-400',
        iconBg: 'from-blue-500/20 to-indigo-600/20',
        iconBorder: 'border-blue-400/40',
        button: 'from-blue-500/20 to-indigo-600/20 border-blue-400/30 hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50',
        input: 'border-blue-500/30 focus:border-blue-400 focus:ring-blue-400/20'
      },
      pink: {
        bg: 'from-pink-500/15 to-rose-600/15',
        border: 'border-pink-400/30',
        text: 'text-pink-400',
        iconBg: 'from-pink-500/20 to-rose-600/20',
        iconBorder: 'border-pink-400/40',
        button: 'from-pink-500/20 to-rose-600/20 border-pink-400/30 hover:from-pink-500/30 hover:to-rose-600/30 hover:border-pink-400/50',
        input: 'border-pink-500/30 focus:border-pink-400 focus:ring-pink-400/20'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 md:py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="text-cyan-400 font-medium ml-4">Loading social links...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Social Links Management
        </h2>
        <p className="text-gray-400 text-sm md:text-base px-4">Manage your social media links and contact information</p>
      </div>

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {socialLinks.map((link) => {
          const config = PLATFORM_CONFIG[link.platform as keyof typeof PLATFORM_CONFIG];
          const colors = getColorClasses(config?.color || 'blue');
          const IconComponent = config?.icon || Link;
          
          return (
            <div
              key={link.id}
              className={`bg-gradient-to-br ${colors.bg} backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border ${colors.border} shadow-xl shadow-${config?.color || 'blue'}-500/20`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 md:mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br ${colors.iconBg} backdrop-blur-md border ${colors.iconBorder} rounded-lg md:rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`w-5 md:w-6 h-5 md:h-6 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg">
                      {config?.label || link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm">
                      {link.platform === 'whatsapp' ? 'Phone number or link' : 'Profile or page URL'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={link.is_active}
                      onChange={(e) => toggleLinkActive(link.platform, e.target.checked)}
                      className={`w-3 md:w-4 h-3 md:h-4 ${colors.text} bg-black/40 border ${colors.border} rounded focus:ring-2 focus:ring-${config?.color || 'blue'}-400/20`}
                    />
                    <span className="text-white text-xs md:text-sm">Active</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <input
                  type="url"
                  value={editedLinks[link.platform] || ''}
                  onChange={(e) => handleLinkChange(link.platform, e.target.value)}
                  placeholder={config?.placeholder || `Enter ${link.platform} URL`}
                  className={`w-full bg-black/40 border ${colors.input} rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:ring-2 transition-all duration-300 text-sm md:text-base`}
                />
                
                {link.url && (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-2 px-2 md:px-3 py-1.5 md:py-2 bg-gradient-to-r ${colors.button} backdrop-blur-md text-white font-medium rounded-lg transition-all duration-300 text-xs md:text-sm`}
                  >
                    <ExternalLink className="w-3 md:w-4 h-3 md:h-4" />
                    <span>Test Link</span>
                  </a>
                )}
              </div>
              
              <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
                Last updated: {new Date(link.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: window.innerWidth < 768 ? 'short' : 'long',
                  day: 'numeric',
                  ...(window.innerWidth >= 768 && {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-bold rounded-lg md:rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-3 md:h-4 w-3 md:w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 md:w-5 h-4 md:h-5" />
              <span>Save All Links</span>
            </>
          )}
        </button>

        <button
          onClick={fetchSocialLinks}
          className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-md border border-blue-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 text-sm md:text-base"
        >
          <RefreshCw className="w-3 md:w-4 h-3 md:h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        confirmText="Save Links"
        cancelText="Cancel"
        type="info"
      />

      <NotificationModal
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </div>
  );
};