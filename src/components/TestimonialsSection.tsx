import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Review } from '../types';

export const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(6);

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

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              What Our Customers Say
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="text-cyan-400 font-medium ml-4">Loading testimonials...</span>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-6 py-8 md:py-16 scroll-reveal">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 text-base md:text-lg px-4">
            Trusted by thousands of Free Fire players worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-6 border border-cyan-400/20 shadow-xl shadow-cyan-500/20 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-2 transition-all duration-500 animate-fadeIn group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                  {review.profile_pic_url ? (
                    <img
                      src={review.profile_pic_url}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/30"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-cyan-400 font-bold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <Quote className="absolute -top-1 -right-1 w-5 h-5 text-cyan-400/60 group-hover:text-cyan-400/80 group-hover:scale-110 transition-all duration-300" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">{review.name}</h4>
                  <p className="text-gray-500 text-xs font-mono">UID: {review.uid}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                "{review.review_text}"
              </p>
              
              <div className="mt-4 text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};