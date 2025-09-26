import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loader mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ShopHub</h2>
        <p className="text-gray-600">Loading your shopping experience...</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader; 