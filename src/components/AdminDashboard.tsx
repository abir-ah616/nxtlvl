import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Save, X, Star, LogOut, Shield, Eye, EyeOff, Type, MessageSquare, Settings, Link, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Review } from '../types';
import { EnhancedBackground } from './EnhancedBackground';
import FontManager from './FontManager';
import { CalculationSettingsManager } from './CalculationSettingsManager';
import { SocialLinksManager } from './SocialLinksManager';
import { CurrencyRateManager } from './CurrencyRateManager';
import { ConfirmationModal } from './ConfirmationModal';
import { NotificationModal } from './NotificationModal';

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'reviews' | 'fonts' | 'settings' | 'social' | 'currency'>('reviews');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    uid: '',
    profile_pic_url: '',
    review_text: '',
    rating: 5,
    is_featured: false
  });
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

  const handleNotificationClose = useCallback(() => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
      } else if (data.user) {
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred');
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setReviews([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([formData]);

      if (error) {
        console.error('Error adding review:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error adding review: ' + error.message,
          type: 'error'
        });
      } else {
        setFormData({
          name: '',
          uid: '',
          profile_pic_url: '',
          review_text: '',
          rating: 5,
          is_featured: false
        });
        setShowAddForm(false);
        fetchReviews();
        setNotification({
          isOpen: true,
          title: 'Success',
          message: 'Review added successfully!',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error adding review:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error adding review',
        type: 'error'
      });
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          name: formData.name,
          uid: formData.uid,
          profile_pic_url: formData.profile_pic_url,
          review_text: formData.review_text,
          rating: formData.rating,
          is_featured: formData.is_featured
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating review:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error updating review: ' + error.message,
          type: 'error'
        });
      } else {
        setEditingId(null);
        fetchReviews();
        setNotification({
          isOpen: true,
          title: 'Success',
          message: 'Review updated successfully!',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating review:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error updating review',
        type: 'error'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const reviewToDelete = reviews.find(review => review.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Review',
      message: `Are you sure you want to delete the review by "${reviewToDelete?.name}"? This action cannot be undone.`,
      onConfirm: () => performDeleteReview(id)
    });
  };

  const performDeleteReview = async (id: string) => {
    setConfirmModal({ ...confirmModal, isOpen: false });

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting review:', error);
        setNotification({
          isOpen: true,
          title: 'Error',
          message: 'Error deleting review: ' + error.message,
          type: 'error'
        });
      } else {
        fetchReviews();
        setNotification({
          isOpen: true,
          title: 'Success',
          message: 'Review deleted successfully!',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'Error deleting review',
        type: 'error'
      });
    }
  };

  const startEdit = (review: Review) => {
    setFormData({
      name: review.name,
      uid: review.uid,
      profile_pic_url: review.profile_pic_url || '',
      review_text: review.review_text,
      rating: review.rating,
      is_featured: review.is_featured || false
    });
    setEditingId(review.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      uid: '',
      profile_pic_url: '',
      review_text: '',
      rating: 5,
      is_featured: false
    });
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
        onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <EnhancedBackground />
        <div className="relative z-10 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="text-cyan-400 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <EnhancedBackground />
        <div className="relative z-10 w-full max-w-md mx-auto px-4">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-400">Please sign in to access the admin panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-cyan-400 font-medium text-sm uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-cyan-400 font-medium text-sm uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/30 text-white font-bold rounded-xl hover:from-cyan-500/30 hover:to-blue-600/30 hover:border-cyan-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <EnhancedBackground />
        <div className="relative z-10">
          {/* Admin Header */}
          <div className="bg-black/20 backdrop-blur-xl border-b border-cyan-500/20 px-4 md:px-6 py-3 md:py-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center space-x-4">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-xl flex items-center justify-center">
                  <Shield className="w-4 md:w-5 h-4 md:h-5 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-gray-400 hidden sm:block">Manage reviews and testimonials</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4 w-full sm:w-auto">
                <a
                  href="/"
                  className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-md border border-blue-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50 transition-all duration-300 text-center text-sm md:text-base"
                >
                  Back to Site
                </a>
                <button
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 backdrop-blur-md border border-red-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-red-500/30 hover:to-pink-600/30 hover:border-red-400/50 transition-all duration-300 flex items-center justify-center space-x-1 md:space-x-2 text-sm md:text-base"
                >
                  <LogOut className="w-3 md:w-4 h-3 md:h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            {/* Section Tabs */}
            <div className="mb-6 md:mb-8">
              <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 md:gap-4">
                <button
                  onClick={() => setActiveSection('reviews')}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-base ${
                    activeSection === 'reviews'
                      ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30'
                      : 'bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md border border-cyan-400/20 text-cyan-100 hover:from-cyan-500/30 hover:to-blue-600/30 hover:text-white hover:border-cyan-400/50'
                  }`}
                >
                  <MessageSquare className="w-3 md:w-5 h-3 md:h-5" />
                  <span className="hidden sm:inline">Reviews</span>
                  <span className="sm:hidden">Reviews</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('fonts')}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-base ${
                    activeSection === 'fonts'
                      ? 'bg-gradient-to-r from-purple-500/80 to-pink-600/80 backdrop-blur-md text-white shadow-lg shadow-purple-500/25 border border-purple-400/30'
                      : 'bg-gradient-to-r from-purple-500/10 to-pink-600/10 backdrop-blur-md border border-purple-400/20 text-purple-100 hover:from-purple-500/30 hover:to-pink-600/30 hover:text-white hover:border-purple-400/50'
                  }`}
                >
                  <Type className="w-3 md:w-5 h-3 md:h-5" />
                  <span>Fonts</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('settings')}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-base ${
                    activeSection === 'settings'
                      ? 'bg-gradient-to-r from-green-500/80 to-emerald-600/80 backdrop-blur-md text-white shadow-lg shadow-green-500/25 border border-green-400/30'
                      : 'bg-gradient-to-r from-green-500/10 to-emerald-600/10 backdrop-blur-md border border-green-400/20 text-green-100 hover:from-green-500/30 hover:to-emerald-600/30 hover:text-white hover:border-green-400/50'
                  }`}
                >
                  <Settings className="w-3 md:w-5 h-3 md:h-5" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('social')}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-base ${
                    activeSection === 'social'
                      ? 'bg-gradient-to-r from-pink-500/80 to-rose-600/80 backdrop-blur-md text-white shadow-lg shadow-pink-500/25 border border-pink-400/30'
                      : 'bg-gradient-to-r from-pink-500/10 to-rose-600/10 backdrop-blur-md border border-pink-400/20 text-pink-100 hover:from-pink-500/30 hover:to-rose-600/30 hover:text-white hover:border-pink-400/50'
                  }`}
                >
                  <Link className="w-3 md:w-5 h-3 md:h-5" />
                  <span>Social</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('currency')}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-base col-span-2 lg:col-span-1 ${
                    activeSection === 'currency'
                      ? 'bg-gradient-to-r from-yellow-500/80 to-orange-600/80 backdrop-blur-md text-white shadow-lg shadow-yellow-500/25 border border-yellow-400/30'
                      : 'bg-gradient-to-r from-yellow-500/10 to-orange-600/10 backdrop-blur-md border border-yellow-400/20 text-yellow-100 hover:from-yellow-500/30 hover:to-orange-600/30 hover:text-white hover:border-yellow-400/50'
                  }`}
                >
                  <DollarSign className="w-3 md:w-5 h-3 md:h-5" />
                  <span>Currency</span>
                </button>
              </div>
            </div>

            {/* Content based on active section */}
            {activeSection === 'reviews' && (
              <div>
                {/* Add Review Button */}
                <div className="mb-4 md:mb-6">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25 flex items-center justify-center space-x-2 text-sm md:text-base"
                  >
                    <Plus className="w-4 md:w-5 h-4 md:h-5" />
                    <span>Add New Review</span>
                  </button>
                </div>

                {/* Add Review Form */}
                {showAddForm && (
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4">Add New Review</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-sm md:text-base"
                      />
                      <input
                        type="text"
                        placeholder="Free Fire UID"
                        value={formData.uid}
                        onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                        className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-sm md:text-base"
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Profile Picture URL (optional)"
                      value={formData.profile_pic_url}
                      onChange={(e) => setFormData({ ...formData, profile_pic_url: e.target.value })}
                      className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 mb-3 md:mb-4 text-sm md:text-base"
                    />
                    <textarea
                      placeholder="Review Text"
                      value={formData.review_text}
                      onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                      rows={3}
                      className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 mb-3 md:mb-4 text-sm md:text-base"
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium text-sm md:text-base">Rating:</span>
                        <div className="flex space-x-1">
                          {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                        </div>
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                          className="w-3 md:w-4 h-3 md:h-4 text-cyan-400 bg-black/40 border border-cyan-500/30 rounded focus:ring-cyan-400/20"
                        />
                        <span className="text-white font-medium text-sm md:text-base">Featured</span>
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={handleAdd}
                        className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                      >
                        <Save className="w-3 md:w-4 h-3 md:h-4" />
                        <span>Save Review</span>
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-500/20 to-pink-600/20 backdrop-blur-md border border-red-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-red-500/30 hover:to-pink-600/30 hover:border-red-400/50 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                      >
                        <X className="w-3 md:w-4 h-3 md:h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    <span className="text-cyan-400 font-medium ml-4">Loading reviews...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-400/20 shadow-xl shadow-cyan-500/20"
                      >
                        {editingId === review.id ? (
                          // Edit Form
                          <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-sm md:text-base"
                              />
                              <input
                                type="text"
                                value={formData.uid}
                                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-sm md:text-base"
                              />
                            </div>
                            <input
                              type="url"
                              value={formData.profile_pic_url}
                              onChange={(e) => setFormData({ ...formData, profile_pic_url: e.target.value })}
                              className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 mb-3 md:mb-4 text-sm md:text-base"
                            />
                            <textarea
                              value={formData.review_text}
                              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                              rows={3}
                              className="w-full bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 mb-3 md:mb-4 text-sm md:text-base"
                            />
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-medium text-sm md:text-base">Rating:</span>
                                <div className="flex space-x-1">
                                  {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                                </div>
                              </div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.is_featured}
                                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                  className="w-3 md:w-4 h-3 md:h-4 text-cyan-400 bg-black/40 border border-cyan-500/30 rounded focus:ring-cyan-400/20"
                                />
                                <span className="text-white font-medium text-sm md:text-base">Featured</span>
                              </label>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                              <button
                                onClick={() => handleEdit(review.id)}
                                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                              >
                                <Save className="w-3 md:w-4 h-3 md:h-4" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-md border border-gray-400/30 text-white font-medium rounded-lg md:rounded-xl hover:from-gray-500/30 hover:to-gray-600/30 hover:border-gray-400/50 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                              >
                                <X className="w-3 md:w-4 h-3 md:h-4" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Display Mode
                          <div>
                            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 space-y-3 sm:space-y-0">
                              <div className="flex items-start space-x-4">
                                {review.profile_pic_url ? (
                                  <img
                                    src={review.profile_pic_url}
                                    alt={review.name}
                                    className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover border-2 border-cyan-400/30"
                                  />
                                ) : (
                                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-full flex items-center justify-center">
                                    <span className="text-cyan-400 font-bold text-base md:text-lg">
                                      {review.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-white font-bold text-base md:text-lg">{review.name}</h4>
                                  <p className="text-gray-500 text-xs md:text-sm font-mono">UID: {review.uid}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div className="flex space-x-1">
                                      {renderStars(review.rating)}
                                    </div>
                                    {review.is_featured && (
                                      <span className="px-1 md:px-2 py-0.5 md:py-1 bg-yellow-500/20 border border-yellow-400/30 rounded text-yellow-400 text-xs font-medium">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2 self-start">
                                <button
                                  onClick={() => startEdit(review)}
                                  className="p-1.5 md:p-2 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-md border border-blue-400/30 text-blue-400 rounded-lg hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50 transition-all duration-300"
                                >
                                  <Edit className="w-3 md:w-4 h-3 md:h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(review.id)}
                                  className="p-1.5 md:p-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 backdrop-blur-md border border-red-400/30 text-red-400 rounded-lg hover:from-red-500/30 hover:to-pink-600/30 hover:border-red-400/50 transition-all duration-300"
                                >
                                  <Trash2 className="w-3 md:w-4 h-3 md:h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-2">
                              "{review.review_text}"
                            </p>
                            
                            <div className="text-xs md:text-sm text-gray-500">
                              Created: {new Date(review.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {reviews.length === 0 && (
                      <div className="text-center py-8 md:py-12">
                        <p className="text-gray-400 text-base md:text-lg">No reviews found. Add your first review!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {activeSection === 'fonts' && (
              <FontManager 
                setConfirmModal={setConfirmModal}
                setNotification={setNotification}
              />
            )}
            
            {activeSection === 'settings' && (
              <CalculationSettingsManager 
                setConfirmModal={setConfirmModal}
                setNotification={setNotification}
              />
            )}
            
            {activeSection === 'social' && (
              <SocialLinksManager 
                setConfirmModal={setConfirmModal}
                setNotification={setNotification}
              />
            )}
            
            {activeSection === 'currency' && (
              <CurrencyRateManager 
                setConfirmModal={setConfirmModal}
                setNotification={setNotification}
              />
            )}
          </div>
        </div>
      </div>

      {/* Global Modals - Outside all containers for proper backdrop coverage */}
      {confirmModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          confirmText={confirmModal.title.includes('Delete') ? 'Delete' : 'Confirm'}
          cancelText="Cancel"
          type={confirmModal.title.includes('Delete') ? 'danger' : 'warning'}
        />
      )}

      {notification.isOpen && (
        <NotificationModal
          isOpen={notification.isOpen}
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
    </>
  );
};