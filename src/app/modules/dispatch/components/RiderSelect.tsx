import React, { useState, useMemo, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { getThemeColors } from '../../../../theme/colors';
import { mockRiders } from '../../pos/mockData';
import { Rider } from '../../pos/types';

export interface RiderSelectProps {
  currentRiderId?: string;
  onAssign: (rider: Rider) => void;
  isDarkMode: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const RiderSelect: React.FC<RiderSelectProps> = ({ currentRiderId, onAssign, isDarkMode, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = getThemeColors(isDarkMode);

  useEffect(() => {
    onToggle?.(isOpen);
  }, [isOpen, onToggle]);

  const filteredRiders = useMemo(() => {
    return mockRiders.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchQuery('');
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
          currentRiderId 
            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' 
            : `${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`
        }`}
      >
        <UserPlus size={14} />
        {currentRiderId ? mockRiders.find(r => r.id === currentRiderId)?.name : 'Assign Rider'}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div className={`absolute left-0 top-full mt-2 w-64 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border z-[110] p-3 animate-in fade-in slide-in-from-top-2 ${isDarkMode ? 'bg-[#1C1F26] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest mb-2 ${theme.text.tertiary}`}>Select Available Rider</div>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                autoFocus
                placeholder="Search rider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs border outline-none focus:ring-2 focus:ring-primary/50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>

            <div className="space-y-1 max-h-[250px] overflow-y-auto custom-scrollbar">
              {filteredRiders.length > 0 ? (
                filteredRiders.map(rider => (
                  <button
                    key={rider.id}
                    onClick={() => {
                      onAssign(rider);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                      isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{rider.name}</span>
                      <span className={`text-[9px] ${rider.status === 'available' ? 'text-green-500' : rider.status === 'busy' ? 'text-orange-500' : 'text-gray-500'}`}>
                        {rider.status.charAt(0).toUpperCase() + rider.status.slice(1)}
                      </span>
                    </div>
                    {rider.status === 'available' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                  </button>
                ))
              ) : (
                <div className={`text-center py-4 text-xs ${theme.text.tertiary}`}>No riders found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
