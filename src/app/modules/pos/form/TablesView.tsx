import React, { useState, useMemo, useEffect } from 'react';
import { Table } from '../types';
import { mockTables } from '../mockData';
import { Search, Users, Clock, DollarSign, User } from 'lucide-react';
import { tableStateManager } from '../../../../utils/tableStateManager';

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
          bg: 'bg-primary',
          text: 'text-white',
          shadow: 'shadow-lg shadow-primary/20',
          border: 'border-primary',
          icon: 'text-white',
        };
      case 'reserved':
        return {
          bg: 'bg-surface',
          text: 'text-textSecondary',
          shadow: 'shadow-md',
          border: 'border-border',
          icon: 'text-textSecondary',
        };
      case 'available':
        return {
          bg: 'bg-surface',
          text: 'text-textSecondary',
          shadow: 'shadow-sm',
          border: 'border-border',
          icon: 'text-textSecondary',
        };
      default:
        return {
          bg: 'bg-surface',
          text: 'text-textSecondary',
          shadow: 'shadow-md',
          border: 'border-border',
          icon: 'text-textSecondary',
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
          </>)}

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
      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${table.status === 'occupied' ? 'bg-white' :
        table.status === 'reserved' ? 'bg-warning' : 'bg-success'
        } shadow-md`} />

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
    </button>
  );
};

export const TablesView: React.FC<TablesViewProps> = ({ isDarkMode = false }) => {
  const [selectedFloor, setSelectedFloor] = useState<'ground' | 'first'>('ground');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'reserved' | 'booked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Get dynamic table state
  const [allTables, setAllTables] = useState(() => tableStateManager.getTables());

  // Listen for table status updates from other components
  useEffect(() => {
    return tableStateManager.subscribe(() => {
      setAllTables(tableStateManager.getTables());
    });
  }, []);

  const filteredTables = useMemo(() => {
    return allTables.filter(table => {
      // If there is a search query, search across all floors. Otherwise, filter by selected floor.
      const matchesFloor = searchQuery.trim() !== '' ? true : table.floor === selectedFloor;
      const matchesStatus = filterStatus === 'all' || table.status === filterStatus;
      const matchesSearch = table.number.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFloor && matchesStatus && matchesSearch;
    });
  }, [allTables, selectedFloor, filterStatus, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts = allTables.filter(t => t.floor === selectedFloor).reduce((acc, table) => {
      acc[table.status] = (acc[table.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      all: allTables.filter(t => t.floor === selectedFloor).length,
      available: counts['available'] || 0,
      occupied: counts['occupied'] || 0,
      reserved: counts['reserved'] || 0,
    };
  }, [allTables, selectedFloor]);

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col bg-background p-3 sm:p-4 lg:p-6">
      {/* Header with Stats */}
      {/* Header Box */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border mb-6 shadow-sm bg-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-textPrimary mb-1">
              Tables Management
            </h1>
            <p className="text-xs sm:text-sm text-textSecondary">
              {searchQuery.trim() !== '' ? 'Search Results' : `Floor: ${selectedFloor === 'ground' ? 'Ground Floor' : '1st Floor'}`} • {filteredTables.length} tables
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-2 lg:gap-3 w-full sm:w-auto overflow-x-auto scrollbar-hidden ml-auto">
            <div className="px-3 lg:px-4 py-2 rounded-xl bg-surface shadow-sm border border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <div>
                  <div className="text-xs text-textSecondary">Available</div>
                  <div className="text-base lg:text-lg font-bold text-textPrimary">
                    {statusCounts.available || 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 lg:px-4 py-2 rounded-xl bg-surface shadow-sm border border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div>
                  <div className="text-xs text-textSecondary">Occupied</div>
                  <div className="text-base lg:text-lg font-bold text-textPrimary">
                    {statusCounts.occupied || 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 lg:px-4 py-2 rounded-xl bg-surface shadow-sm border border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <div>
                  <div className="text-xs text-textSecondary">Reserved</div>
                  <div className="text-base lg:text-lg font-bold text-textPrimary">
                    {statusCounts.reserved || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">


            {/* Floor Tabs */}
            <div className="flex items-center p-1 rounded-lg border border-border bg-surface w-full sm:w-auto">
              <button
                onClick={() => setSelectedFloor('ground')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${selectedFloor === 'ground'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textSecondary hover:bg-surface/10'
                  }`}
              >
                Ground
              </button>
              <button
                onClick={() => setSelectedFloor('first')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${selectedFloor === 'first'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textSecondary hover:bg-surface/10'
                  }`}
              >
                1st Floor
              </button>
            </div>

          </div>

          {/* Status Filters */}
          <div className="flex gap-2 p-1 rounded-lg border border-border bg-surface overflow-x-auto scrollbar-hidden w-full lg:w-auto">
            {[
              { key: 'all', label: 'All' },
              { key: 'available', label: 'Available' },
              { key: 'occupied', label: 'Occupied' },
              { key: 'reserved', label: 'Reserved' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${filterStatus === key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textSecondary hover:bg-surface/10'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="w-full sm:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-surface text-textPrimary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 lg:gap-4">
          {filteredTables.map(table => (
            <TableCard
              key={table.id}
              table={table}
              isDarkMode={isDarkMode}
              onClick={() => {
                setSelectedTable(table);
                // Save to localStorage for POS View sync
                localStorage.setItem('nexus_pos_selected_table', JSON.stringify(table));
              }}
            />
          ))}
        </div>

        {filteredTables.length === 0 && (
          <div className="text-center py-12 text-textSecondary">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No tables found</p>
            <p className="text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};
