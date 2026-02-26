import React from 'react';

export const StocksGRNForm: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm">
      Add GRN
    </button>
  );
};

