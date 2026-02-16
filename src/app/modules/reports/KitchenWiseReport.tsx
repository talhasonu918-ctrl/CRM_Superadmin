'use client';

import React from 'react';

const KitchenWiseReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-4">
      <div className={`${cardStyle} rounded-lg p-8 border ${borderStyle} text-center`}>
        <div className="mb-4">
          <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${textStyle}`}>Kitchen Wise Sale Report</h3>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Coming Soon - Kitchen wise sales analytics and performance metrics
        </p>
      </div>
    </div>
  );
};

export default KitchenWiseReport;
