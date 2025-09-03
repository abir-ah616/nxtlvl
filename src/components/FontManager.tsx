import React, { useState, useEffect, useCallback } from 'react';
import { Type, Plus, Save, X, Eye, Trash2, Palette } from 'lucide-react';
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
  id: string;
  section: string;
  font_family: string;
  font_source: string;
  google_fonts_link?: string;
}

interface CustomFont {
  name: string;
  google_fonts_link: string;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

interface NotificationState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface FontManagerProps {
  setConfirmModal: React.Dispatch<React.SetStateAction<ModalState>>;
  setNotification: React.Dispatch<React.SetStateAction<NotificationState>>;
}

const FONT_SECTIONS = [
  { key: 'logo', label: 'Logo/Brand Text', description: 'NEXT LEVEL - FF brand text' },
  { key: 'hero', label: 'Hero Section', description: 'Main title and hero text' },
  { key: 'navigation', label: 'Navigation', description: 'Navigation menu items' },
  { key: 'headings', label: 'Section Headings', description: 'H2, H3 section titles' },
  { key: 'body', label: 'Body Text', description: 'Paragraphs and general content' },
  { key: 'buttons', label: 'Buttons', description: 'Button text and labels' },
  { key: 'cards', label: 'Cards', description: 'Card content and descriptions' },
  { key: 'numbers', label: 'Numbers', description: 'Numerical displays, prices, and calculator results' }
];

const FontManager: React.FC<FontManagerProps> = ({ setConfirmModal, setNotification }) => {
  const [availableFonts, setAvailableFonts] = useState<AvailableFont[]>([]);
  const [fontPreferences, setFontPreferences] = useState<FontPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCustomFont, setShowAddCustomFont] = useState(false);
  const [customFont, setCustomFont] = useState<CustomFont>({ name: '', google_fonts_link: '' });
  const [previewFont, setPreviewFont] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fontsResponse, preferencesResponse] = await Promise.all([
        supabase.from('available_fonts').select('*').eq('is_active', true).order('category', { ascending: true }),
        supabase.from('font_preferences').select('*')
      ]);

      if (fontsResponse.error) {
        console.error('Error fetching fonts:', fontsResponse.error);
      } else {
        setAvailableFonts(fontsResponse.data || []);
      }

      if (preferencesResponse.error) {
        console.error('Error fetching preferences:', preferencesResponse.error);
      } else {
        setFontPreferences(preferencesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFontPreference = async (section: string, fontFamily: string, fontSource: string, googleFontsLink?: string) => {
    try {
      const { error } = await supabase
        .from('font_preferences')
        .upsert({
          section,
          font_family: fontFamily,
          font_source: fontSource,
          google_fonts_link: googleFontsLink
        }, {
          onConflict: 'section'
        });

      if (error) {
        console.error('Error updating font preference:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error updating font preference: ' + error.message,
          type: 'error'
        });
      } else {
        fetchData();
        // Apply font changes immediately
        applyFontChanges();
        setNotification({
          isOpen: true,
          title: 'Success',
          message: 'Font preference updated successfully!',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating font preference:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error updating font preference',
        type: 'error'
      });
    }
  };

  const addCustomFont = async () => {
    if (!customFont.name.trim() || !customFont.google_fonts_link.trim()) {
      setNotification({
        isOpen: true,
        title: 'Validation Error',
        message: 'Please fill in both font name and Google Fonts link',
        type: 'warning'
      });
      return;
    }

    try {
      // Extract font family from Google Fonts link
      const fontFamily = extractFontFamilyFromLink(customFont.google_fonts_link);
      
      const { error } = await supabase
        .from('available_fonts')
        .insert([{
          name: customFont.name,
          font_family: fontFamily,
          google_fonts_link: customFont.google_fonts_link,
          category: 'custom',
          is_active: true
        }]);

      if (error) {
        console.error('Error adding custom font:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error adding custom font: ' + error.message,
          type: 'error'
        });
      } else {
        setCustomFont({ name: '', google_fonts_link: '' });
        setShowAddCustomFont(false);
        fetchData();
        setNotification({
          isOpen: true,
          title: 'Success',
          message: 'Custom font added successfully!',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error adding custom font:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error adding custom font',
        type: 'error'
      });
    }
  };

  const extractFontFamilyFromLink = (link: string): string => {
    try {
      const url = new URL(link);
      const familyParam = url.searchParams.get('family');
      if (familyParam) {
        // Extract font name and handle multiple fonts
        const fontNames = familyParam.split('&family=').map(family => 
          family.split(':')[0].replace(/\+/g, ' ')
        );
        return fontNames[0]; // Use the first font if multiple
      }
      return 'Unknown Font';
    } catch {
      return 'Unknown Font';
    }
  };

  const getCurrentFont = (section: string): string => {
    const preference = fontPreferences.find(pref => pref.section === section);
    return preference?.font_family || 'Inter';
  };

  const deleteCustomFont = async (fontId: string) => {
    const fontToDelete = availableFonts.find(font => font.id === fontId);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Font',
      message: `Are you sure you want to delete "${fontToDelete?.name}"? This action cannot be undone.`,
      onConfirm: () => performDeleteFont(fontId)
    });
  };

  const performDeleteFont = async (fontId: string) => {
    setConfirmModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => {}
    });

    try {
      const { error } = await supabase
        .from('available_fonts')
        .delete()
        .eq('id', fontId);

      if (error) {
        console.error('Error deleting font:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error deleting font: ' + error.message,
          type: 'error'
        });
      } else {
        fetchData();
        setNotification({
          isOpen: true,
          title: 'Success',
          message: 'Font deleted successfully!',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error deleting font:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error deleting font',
        type: 'error'
      });
    }
  };

  const applyFontChanges = () => {
    // Function to apply font changes
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 md:py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="text-cyan-400 font-medium ml-4">Loading font manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Font Management
        </h2>
        <p className="text-gray-400 text-sm md:text-base px-4">Customize fonts for different sections of your website</p>
      </div>

      {/* Font Preferences */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center space-x-2">
          <Palette className="w-5 md:w-6 h-5 md:h-6 text-cyan-400" />
          <span>Section Font Preferences</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {FONT_SECTIONS.map((section) => (
            <div key={section.key} className="space-y-2 md:space-y-3">
              <div>
                <label className="block text-cyan-400 font-medium text-xs md:text-sm uppercase tracking-wider mb-1">
                  {section.label}
                </label>
                <p className="text-gray-500 text-xs md:text-sm">{section.description}</p>
              </div>
              
              <select
                value={getCurrentFont(section.key)}
                onChange={(e) => {
                  const selectedFont = availableFonts.find(font => font.font_family === e.target.value);
                  if (selectedFont) {
                    updateFontPreference(section.key, selectedFont.font_family, 'preset', selectedFont.google_fonts_link);
                  }
                }}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-sm md:text-base"
                style={{ fontFamily: formatFontFamily(getCurrentFont(section.key)) }}
              >
                {availableFonts.map((font) => (
                  <option key={font.id} value={font.font_family} style={{ fontFamily: formatFontFamily(font.font_family) }}>
                    {font.name} ({font.category})
                  </option>
                ))}
              </select>
              
              <div 
                className="bg-black/20 border border-cyan-500/20 rounded-lg p-2 md:p-3 text-white text-xs md:text-sm"
                style={{ fontFamily: formatFontFamily(getCurrentFont(section.key)), lineHeight: '1.4' }}
              >
                Preview: The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Fonts */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-400/20 shadow-2xl shadow-purple-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 space-y-3 sm:space-y-0">
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center space-x-2">
            <Type className="w-5 md:w-6 h-5 md:h-6 text-purple-400" />
            <span>Available Fonts</span>
          </h3>
          
          <button
            onClick={() => setShowAddCustomFont(true)}
            className="w-full sm:w-auto px-3 md:px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            <Plus className="w-3 md:w-4 h-3 md:h-4" />
            <span>Add Custom Font</span>
          </button>
        </div>

        {/* Add Custom Font Form */}
        {showAddCustomFont && (
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-xl rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6 border border-green-400/20">
            <h4 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">Add Custom Google Font</h4>
            <div className="space-y-3 md:space-y-4">
              <input
                type="text"
                placeholder="Font Name (e.g., Roboto)"
                value={customFont.name}
                onChange={(e) => setCustomFont({ ...customFont, name: e.target.value })}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 text-sm md:text-base"
              />
              <input
                type="url"
                placeholder="Google Fonts Link (e.g., https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap)"
                value={customFont.google_fonts_link}
                onChange={(e) => setCustomFont({ ...customFont, google_fonts_link: e.target.value })}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 text-sm md:text-base"
              />
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={addCustomFont}
                  className="w-full sm:w-auto px-3 md:px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <Save className="w-3 md:w-4 h-3 md:h-4" />
                  <span>Add Font</span>
                </button>
                <button
                  onClick={() => setShowAddCustomFont(false)}
                  className="w-full sm:w-auto px-3 md:px-4 py-2 bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-md border border-gray-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-gray-500/30 hover:to-gray-600/30 hover:border-gray-400/50 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <X className="w-3 md:w-4 h-3 md:h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Font Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {availableFonts.map((font) => (
            <div
              key={font.id}
              className="bg-gradient-to-br from-purple-500/15 to-pink-600/15 backdrop-blur-xl rounded-xl p-4 border border-purple-400/30 shadow-xl shadow-purple-500/20 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div>
                  <h4 className="text-white font-bold text-sm md:text-base" style={{ fontFamily: font.font_family }}>
                    {font.name}
                  </h4>
                  <span className="text-purple-400 text-xs md:text-sm uppercase tracking-wider">
                    {font.category}
                  </span>
                </div>
                <div className="flex space-x-1 md:space-x-2">
                  <button
                    onClick={() => setPreviewFont(previewFont === font.font_family ? null : font.font_family)}
                    className="p-1.5 md:p-2 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-md border border-blue-400/30 text-blue-400 rounded-lg hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <Eye className="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                  {font.category === 'custom' && (
                    <button
                      onClick={() => deleteCustomFont(font.id)}
                      className="p-1.5 md:p-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 backdrop-blur-md border border-red-400/30 text-red-400 rounded-lg hover:from-red-500/30 hover:to-pink-600/30 hover:border-red-400/50 transition-all duration-300"
                    >
                      <Trash2 className="w-3 md:w-4 h-3 md:h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div 
                className="bg-black/20 border border-purple-500/20 rounded-lg p-2 md:p-3 text-white text-xs md:text-sm"
                style={{ fontFamily: font.font_family, lineHeight: '1.4' }}
              >
                The quick brown fox jumps over the lazy dog. 1234567890
              </div>
            </div>
          ))}
        </div>

        {/* Font Preview Modal */}
        {previewFont && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed', width: '100vw', height: '100vh' }}>
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-8 border border-cyan-400/30 shadow-2xl shadow-cyan-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg md:text-2xl font-bold text-white">Font Preview</h3>
                <button
                  onClick={() => setPreviewFont(null)}
                  className="p-1.5 md:p-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 backdrop-blur-md border border-red-400/30 text-red-400 rounded-lg hover:from-red-500/30 hover:to-pink-600/30 hover:border-red-400/50 transition-all duration-300"
                >
                  <X className="w-4 md:w-5 h-4 md:h-5" />
                </button>
              </div>
              
              <div className="space-y-4 md:space-y-6" style={{ fontFamily: previewFont }}>
                <div>
                  <h4 className="text-cyan-400 text-xs md:text-sm uppercase tracking-wider mb-2">Hero Text</h4>
                  <h1 className="text-2xl md:text-4xl font-bold text-white" style={{ lineHeight: '1.2' }}>
                    Free Fire Level Up Service
                  </h1>
                </div>
                
                <div>
                  <h4 className="text-cyan-400 text-xs md:text-sm uppercase tracking-wider mb-2">Logo/Brand Text</h4>
                  <h1 className="text-lg md:text-2xl font-bold text-white" style={{ lineHeight: '1.2' }}>
                    NEXT LEVEL - FF
                  </h1>
                </div>
                
                <div>
                  <h4 className="text-cyan-400 text-xs md:text-sm uppercase tracking-wider mb-2">Section Heading</h4>
                  <h2 className="text-lg md:text-2xl font-bold text-white" style={{ lineHeight: '1.3' }}>
                    Why Choose Us?
                  </h2>
                </div>
                
                <div>
                  <h4 className="text-cyan-400 text-xs md:text-sm uppercase tracking-wider mb-2">Body Text</h4>
                  <p className="text-gray-300 text-sm md:text-base" style={{ lineHeight: '1.5' }}>
                    Professional Free Fire level up service. Get to your desired level quickly, safely, and affordably. We provide the best service with unmatched quality.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-cyan-400 text-xs md:text-sm uppercase tracking-wider mb-2">Button Text</h4>
                  <button className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/30 text-white font-bold rounded-lg md:rounded-xl text-sm md:text-base">
                    Calculate Price
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// Helper function to format font family for CSS
const formatFontFamily = (fontFamily: string): string => {
  // If font name contains spaces, wrap in quotes
  if (fontFamily.includes(' ')) {
    return `"${fontFamily}"`;
  }
  return fontFamily;
};

export default FontManager;
