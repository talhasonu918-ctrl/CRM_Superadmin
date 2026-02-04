import React, { useState, useMemo } from 'react';
import { Table } from '../types';
import { mockTables } from '../mockData';
import { Search, Users, Clock, DollarSign, User } from 'lucide-react';
import { getThemeColors } from '../../../../theme/colors';

interface TablesViewProps {
  isDarkMode?: boolean;
  
}

interface TableCardProps {
  table: Table;
  isDarkMode: boolean;
  onClick: () => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, isDarkMode, onClick }) => {
  const getStatusStyles = () => {
    switch (table.status) {
      case 'occupied':
        return {
          bg: 'from-orange-500 to-orange-600',
          text: 'text-white',
          shadow: 'shadow-lg shadow-orange-500/30',
          border: 'border-orange-400',
          icon: 'text-white',
        };
      case 'reserved':
        return {
          bg: isDarkMode ? 'from-gray-700 to-gray-800' : 'from-gray-200 to-gray-300',
          text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
          shadow: 'shadow-md',
          border: isDarkMode ? 'border-gray-600' : 'border-gray-400',
          icon: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        };
      case 'available':
        return {
          bg: isDarkMode ? 'from-gray-700 to-gray-800' : 'from-gray-100 to-gray-200',
          text: isDarkMode ? 'text-gray-300' : 'text-gray-600',
          shadow: 'shadow-sm',
          border: isDarkMode ? 'border-gray-600' : 'border-gray-300',
          icon: isDarkMode ? 'text-gray-500' : 'text-gray-400',
        };
      default:
        return {
          bg: isDarkMode ? 'from-gray-700 to-gray-800' : 'from-gray-200 to-gray-300',
          text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
          shadow: 'shadow-md',
          border: isDarkMode ? 'border-gray-600' : 'border-gray-400',
          icon: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <button
      onClick={onClick}
      className={`group relative aspect-square rounded-2xl bg-gradient-to-br ${styles.bg} ${styles.shadow} 
        border-2 ${styles.border} transition-all duration-300 hover:scale-105 hover:shadow-xl 
        flex flex-col items-center justify-center p-4 overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1">
        <span className={`text-xl font-bold ${styles.text} mb-1`}>
          {table.number}
        </span>
        
        {table.status === 'occupied' && (
          <>
            <Users size={16} className={`${styles.icon} opacity-90`} />
            <div className="mt-1 text-xs font-medium text-white/80">
              Guest
            </div>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <Clock size={10} />
              <span>45m</span>
            </div>
          </>       )}
        
        {table.status === 'reserved' && (
          <div className={`text-xs ${styles.text} opacity-70 font-medium mt-1`}>
            Reserved
          </div>
        )}
        
        {table.status === 'available' && (
          <div className={`text-xs ${styles.text} opacity-50 font-medium mt-1`}>
            Available
          </div>
        )}
      </div>

      {/* Status Indicator Dot */}
      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
        table.status === 'occupied' ? 'bg-white' : 
        table.status === 'reserved' ? 'bg-yellow-500' : 
        'bg-green-500'
      } shadow-md`} />

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
    </button>
  );
};

export const TablesView: React.FC<TablesViewProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);
  const [selectedFloor, setSelectedFloor] = useState<'ground' | 'first'>('ground');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'reserved' | 'booked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const filteredTables = useMemo(() => {
    return mockTables.filter(table => {
      const matchesFloor = table.floor === selectedFloor;
      const matchesStatus = filterStatus === 'all' || table.status === filterStatus;
      const matchesSearch = table.number.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFloor && matchesStatus && matchesSearch;
    });
  }, [selectedFloor, filterStatus, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts = mockTables.filter(t => t.floor === selectedFloor).reduce((acc, table) => {
      acc[table.status] = (acc[table.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      all: mockTables.filter(t => t.floor === selectedFloor).length,
      available: counts['available'] || 0,
      occupied: counts['occupied'] || 0,
      reserved: counts['reserved'] || 0,
    };
  }, [selectedFloor]);

  return (
    <div className={`min-h-[calc(100vh-16rem)] flex flex-col ${isDarkMode ? theme.neutral.background : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header with Stats */}
      <div className={`px-6 pt-6 pb-4 border-b ${theme.border.main} ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm sticky top-0 z-20`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-3xl font-bold ${theme.text.primary} mb-1`}>
              Tables Management
            </h1>
            <p className={`text-sm ${theme.text.tertiary}`}>
              Floor: {selectedFloor === 'ground' ? 'Ground Floor' : '1st Floor'} • {filteredTables.length} tables
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className={`px-4 py-2 rounded-xl ${theme.neutral.card} shadow-sm border ${theme.border.secondary}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <div className={`text-xs ${theme.text.tertiary}`}>Available</div>
                  <div className={`text-lg font-bold ${theme.text.primary}`}>
                    {statusCounts.available || 0}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-xl ${theme.neutral.card} shadow-sm border ${theme.border.secondary}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <div>
                  <div className={`text-xs ${theme.text.tertiary}`}>Occupied</div>
                  <div className={`text-lg font-bold ${theme.text.primary}`}>
                    {statusCounts.occupied || 0}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-xl ${theme.neutral.card} shadow-sm border ${theme.border.secondary}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div>
                  <div className={`text-xs ${theme.text.tertiary}`}>Reserved</div>
                  <div className={`text-lg font-bold ${theme.text.primary}`}>
                    {statusCounts.reserved || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* First Row: Floor Tabs and Search */}
        <div className="flex items-center justify-between gap-4 mb-3">
          {/* Floor Tabs */}
          <div className={`flex gap-2 p-1 rounded-xl ${theme.neutral.card} shadow-sm`}>
            <button
              onClick={() => setSelectedFloor('ground')}
              className={`px-6 py-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all ${
                selectedFloor === 'ground'
                  ? `bg-gradient-to-r ${theme.primary.gradient} text-white shadow-md shadow-orange-500/30`
                  : `${theme.text.muted} ${isDarkMode ? 'hover:text-white hover:bg-gray-700' : 'hover:bg-gray-100'}`
              }`}
            >
              Ground Floor
            </button>
            <button
              onClick={() => setSelectedFloor('first')}
              className={`px-6 py-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all ${
                selectedFloor === 'first'
                  ? `bg-gradient-to-r ${theme.primary.gradient} text-white shadow-md shadow-orange-500/30`
                  : `${theme.text.muted} ${isDarkMode ? 'hover:text-white hover:bg-gray-700' : 'hover:bg-gray-100'}`
              }`}
            >
              1st Floor
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 ${theme.primary.ring} transition-all shadow-sm ${theme.input.background} border ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
            />
          </div>
        </div>

        {/* Second Row: Status Filters */}
        <div className={`flex gap-2 p-1 rounded-xl ${theme.neutral.card} shadow-sm w-fit`}>
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'available', label: 'Available', count: statusCounts.available || 0 },
            { key: 'occupied', label: 'Occupied', count: statusCounts.occupied || 0 },
            { key: 'reserved', label: 'Reserved', count: statusCounts.reserved || 0 },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filterStatus === key
                  ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : `${theme.primary.main} text-white shadow-sm`
                  : `${theme.text.muted} ${isDarkMode ? 'hover:text-white hover:bg-gray-700' : 'hover:bg-gray-100'}`
              }`}
            >
              {label}
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                filterStatus === key
                  ? `bg-white ${theme.primary.text}`
                  : isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tables Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {filteredTables.map(table => (
            <TableCard
              key={table.id}
              table={table}
              isDarkMode={isDarkMode}
              onClick={() => setSelectedTable(table)}
            />
          ))}
        </div>
        
        {filteredTables.length === 0 && (
          <div className={`text-center py-12 ${theme.text.muted}`}>
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No tables found</p>
            <p className="text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};
