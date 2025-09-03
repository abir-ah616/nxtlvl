import React from 'react';

interface LoadingSkeletonProps {
  type: 'card' | 'table' | 'testimonial' | 'calculator';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 1 }) => {
  const renderCardSkeleton = () => (
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-400/20 shadow-xl shadow-cyan-500/20 animate-pulse">
      <div className="flex items-center space-x-3 md:space-x-4 mb-4">
        <div className="w-10 md:w-12 h-10 md:h-12 bg-gray-600/30 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-3 bg-gray-600/30 rounded mb-2 w-3/4"></div>
          <div className="h-2 bg-gray-600/20 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-gray-600/20 rounded"></div>
        <div className="h-2 bg-gray-600/20 rounded w-5/6"></div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-cyan-400/20 shadow-2xl shadow-cyan-500/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-b border-cyan-400/30">
              <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                <div className="h-4 bg-gray-600/30 rounded w-24"></div>
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                <div className="h-4 bg-gray-600/30 rounded w-20"></div>
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
              </th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                <div className="h-4 bg-gray-600/30 rounded w-12"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }, (_, i) => (
              <tr key={i} className="border-b border-cyan-400/20 animate-pulse">
                <td className="px-3 md:px-6 py-3 md:py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 md:w-8 h-6 md:h-8 bg-gray-600/30 rounded-lg"></div>
                    <div className="w-3 md:w-4 h-0.5 bg-gray-600/30"></div>
                    <div className="w-6 md:w-8 h-6 md:h-8 bg-gray-600/30 rounded-lg"></div>
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4">
                  <div className="h-4 bg-gray-600/30 rounded w-16"></div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4">
                  <div className="h-4 bg-gray-600/30 rounded w-12"></div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4">
                  <div className="h-4 bg-gray-600/30 rounded w-14"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTestimonialSkeleton = () => (
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-6 border border-cyan-400/20 shadow-xl shadow-cyan-500/20 animate-pulse">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-600/30 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-600/30 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-600/20 rounded w-1/2 mb-2"></div>
          <div className="flex space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-600/30 rounded"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-600/20 rounded"></div>
        <div className="h-3 bg-gray-600/20 rounded w-5/6"></div>
        <div className="h-3 bg-gray-600/20 rounded w-4/6"></div>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-gray-600/20 rounded w-1/3"></div>
      </div>
    </div>
  );

  const renderCalculatorSkeleton = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-gradient-to-br from-cyan-500/15 to-blue-600/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-cyan-400/30 shadow-xl shadow-cyan-500/20 animate-pulse">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gray-600/30 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-600/20 rounded mb-2 w-3/4"></div>
                <div className="h-5 bg-gray-600/30 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const skeletons = {
    card: renderCardSkeleton,
    table: renderTableSkeleton,
    testimonial: renderTestimonialSkeleton,
    calculator: renderCalculatorSkeleton
  };

  return (
    <div>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={count > 1 ? 'mb-4' : ''}>
          {skeletons[type]()}
        </div>
      ))}
    </div>
  );
};