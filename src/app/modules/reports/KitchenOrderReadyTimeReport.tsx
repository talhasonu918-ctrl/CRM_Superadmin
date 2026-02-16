'use client';

import React from 'react';

const KitchenOrderReadyTimeReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-4">
      <div className={`${cardStyle} rounded-lg p-8 border ${borderStyle} text-center`}>
        <div className="mb-4">
          <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${textStyle}`}>Kitchen Order Ready Time Report</h3>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Coming Soon - Track average preparation times and kitchen efficiency
        </p>
      </div>
    </div>
  );
};

export default KitchenOrderReadyTimeReport;
