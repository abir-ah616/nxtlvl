import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Review } from '../types';

export const AdminPanel: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
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
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([formData]);

      if (error) {
        console.error('Error adding review:', error);
        alert('Error adding review: ' + error.message);
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
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Error adding review');
    }
  };

  const handleEdit = async (id: string) => {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

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
        alert('Error updating review: ' + error.message);
      } else {
        setEditingId(null);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Error updating review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review: ' + error.message);
      } else {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="text-cyan-400 font-medium ml-4">Loading reviews...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Admin Panel
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Manage customer reviews and testimonials
          </p>
        </div>

        {/* Add Review Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Review</span>
          </button>
        </div>

        {/* Add Review Form */}
        {showAddForm && (
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Add New Review</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Free Fire UID"
                value={formData.uid}
                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              />
            </div>
            <input
              type="url"
              placeholder="Profile Picture URL (optional)"
              value={formData.profile_pic_url}
              onChange={(e) => setFormData({ ...formData, profile_pic_url: e.target.value })}
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 mb-4"
            />
            <textarea
              placeholder="Review Text"
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              rows={4}
              className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 mb-4"
            />
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">Rating:</span>
                <div className="flex space-x-1">
                  {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                </div>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-cyan-400 bg-black/40 border border-cyan-500/30 rounded focus:ring-cyan-400/20"
                />
                <span className="text-white font-medium">Featured</span>
              </label>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transition-all duration-300 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Review</span>
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-pink-600/20 backdrop-blur-md border border-red-400/30 text-white font-medium rounded-xl hover:from-red-500/30 hover:to-pink-600/30 hover:border-red-400/50 transition-all duration-300 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/20 shadow-xl shadow-cyan-500/20"
            >
              {editingId === review.id ? (
                // Edit Form
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    />
                    <input
                      type="text"
                      value={formData.uid}
                      onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                      className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    />
                  </div>
                  <input
                    type="url"
                    value={formData.profile_pic_url}
                    onChange={(e) => setFormData({ ...formData, profile_pic_url: e.target.value })}
                    className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 mb-4"
                  />
                  <textarea
                    value={formData.review_text}
                    onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                    rows={4}
                    className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 mb-4"
                  />
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">Rating:</span>
                      <div className="flex space-x-1">
                        {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                      </div>
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-4 h-4 text-cyan-400 bg-black/40 border border-cyan-500/30 rounded focus:ring-cyan-400/20"
                      />
                      <span className="text-white font-medium">Featured</span>
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(review.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-400/30 text-white font-medium rounded-xl hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 transition-all duration-300 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-md border border-gray-400/30 text-white font-medium rounded-xl hover:from-gray-500/30 hover:to-gray-600/30 hover:border-gray-400/50 transition-all duration-300 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {review.profile_pic_url ? (
                        <img
                          src={review.profile_pic_url}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/30"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-full flex items-center justify-center">
                          <span className="text-cyan-400 font-bold text-lg">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-white font-bold text-lg">{review.name}</h4>
                        <p className="text-gray-500 text-sm font-mono">UID: {review.uid}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          {review.is_featured && (
                            <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-400 text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(review)}
                        className="p-2 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-md border border-blue-400/30 text-blue-400 rounded-lg hover:from-blue-500/30 hover:to-indigo-600/30 hover:border-blue-400/50 transition-all duration-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 backdrop-blur-md border border-red-400/30 text-red-400 rounded-lg hover:from-red-500/30 hover:to-pink-600/30 hover:border-red-400/50 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-base leading-relaxed mb-2">
                    "{review.review_text}"
                  </p>
                  
                  <div className="text-xs text-gray-500">
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
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No reviews found. Add your first review!</p>
          </div>
        )}
      </div>
    </div>
  );
};