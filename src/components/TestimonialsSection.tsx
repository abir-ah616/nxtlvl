import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Review } from '../types';
import { LoadingSkeleton } from './LoadingSkeleton';

export const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_featured', true)
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

    fetchReviews();
  }, []);

  // Continuous smooth scrolling
  useEffect(() => {
    if (isAutoPlaying && !isPaused && reviews.length > 0) {
      const animate = () => {
        setTranslateX(prev => {
          const cardWidth = 100 / 3; // Each card takes 33.33% width
          const maxTranslate = reviews.length * cardWidth;
          const newTranslate = prev + 0.05; // Smooth increment
          
          // Reset when we've scrolled through all original cards
          if (newTranslate >= maxTranslate) {
            return 0;
          }
          return newTranslate;
        });
        
        if (isAutoPlaying && !isPaused) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoPlaying, isPaused, reviews.length]);

  // Pause auto-slide when hovering
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const goToSlide = (index: number) => {
    const cardWidth = 100 / 3;
    setTranslateX(index * cardWidth);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    const cardWidth = 100 / 3;
    setTranslateX(newIndex * cardWidth);
  };

  const goToNext = () => {
    const newIndex = currentIndex + 1 >= reviews.length ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    const cardWidth = 100 / 3;
    setTranslateX(newIndex * cardWidth);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

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
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 font-headings">
              What Our Customers Say
            </h2>
            <p className="text-gray-400 text-base md:text-lg px-4 font-body">
              Trusted by thousands of Free Fire players worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <LoadingSkeleton type="testimonial" count={6} />
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
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 font-headings">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 text-base md:text-lg px-4 font-body">
            Trusted by thousands of Free Fire players worldwide
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Auto-play Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAutoPlay}
                className={`p-2 backdrop-blur-md border rounded-lg transition-all duration-300 ${
                  isAutoPlaying
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-green-400/30 text-green-400 hover:from-green-500/30 hover:to-emerald-600/30'
                    : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-400/30 text-gray-400 hover:from-gray-500/30 hover:to-gray-600/30'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="text-gray-400 text-sm font-body">
                {isAutoPlaying ? 'Auto-playing' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div
              className="overflow-hidden rounded-2xl"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                ref={carouselRef}
                className="flex"
                style={{
                  transform: `translateX(-${translateX}%)`,
                  transition: 'none'
                }}
              >
                {[...reviews, ...reviews].map((review, index) => (
                  <div
                    key={`${review.id}-${index}`}
                    className="flex-shrink-0 px-3"
                    style={{ 
                      width: window.innerWidth < 768 ? '90%' : window.innerWidth < 1024 ? '50%' : '33.333%'
                    }}
                  >
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-400/20 shadow-xl shadow-cyan-500/20 h-full min-h-[280px] flex flex-col">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="relative">
                          {review.profile_pic_url ? (
                            <img
                              src={review.profile_pic_url}
                              alt={review.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/30"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-full flex items-center justify-center">
                              <span className="text-cyan-400 font-bold text-lg font-headings">
                                {review.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <Quote className="absolute -top-1 -right-1 w-5 h-5 text-cyan-400/60" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg font-headings">{review.name}</h4>
                          <p className="text-gray-500 text-xs font-numbers">UID: {review.uid}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed font-body flex-grow">
                        "{review.review_text}"
                      </p>
                      
                      <div className="mt-4 text-xs text-gray-500 font-numbers pt-2 border-t border-cyan-400/10">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};