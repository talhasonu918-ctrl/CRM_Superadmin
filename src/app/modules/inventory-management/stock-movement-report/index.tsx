'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Settings2,
  FileText,
  Filter,
  LayoutGrid,
  List,
  Layers,
  Archive,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { StockMovementReportTable } from './table/StockMovementReport.Table';
import { ExportButton } from '../../../../components/ExportButton';
import { INITIAL_STOCK_MOVEMENTS, StockMovement } from '../../pos/mockData';

const MOVEMENTS_STORAGE_KEY = 'crm_stock_movements';
const ADJUSTMENTS_STORAGE_KEY = 'crm_stock_adjustments';

export const StockMovementReportView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode: propIsDarkMode }) => {
  const { isDarkMode: contextIsDarkMode } = useTheme();
  const isDarkMode = propIsDarkMode ?? contextIsDarkMode;

  // State Management
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Adjustment' | 'GRN' | 'Sale' | 'Transfer'>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Industry Standard Flow Simulation:
  // In a real app, the backend creates movement records automatically in a transaction
  // during Adjustment, GRN, or Sales operations.
  // Here we sync adjustments from local storage to movement report if not present.
  useEffect(() => {
    const loadData = () => {
      let currentMovements: StockMovement[] = [];
      
      // 1. Load historical/mock movements
      const savedMovements = localStorage.getItem(MOVEMENTS_STORAGE_KEY);
      if (savedMovements) {
        currentMovements = JSON.parse(savedMovements);
      } else {
        currentMovements = [...INITIAL_STOCK_MOVEMENTS];
      }

      // 2. Sync from Adjustments (Manual Trigger Simulation)
      const savedAdjustments = localStorage.getItem(ADJUSTMENTS_STORAGE_KEY);
      if (savedAdjustments) {
        const adjustments = JSON.parse(savedAdjustments);
        
        adjustments.forEach((adj: any) => {
          // Check if this adjustment is already in movements
          const exists = currentMovements.find(m => m.referenceNo === adj.adjustmentNo && m.transactionType === 'Adjustment');
          
          if (!exists) {
            const movement: StockMovement = {
              id: `mov_adj_${adj.id}`,
              date: adj.date,
              productId: adj.productId,
              productName: adj.productName,
              transactionType: 'Adjustment',
              referenceNo: adj.adjustmentNo,
              quantityIn: adj.type === 'Increase' ? adj.adjustmentQty : 0,
              quantityOut: adj.type === 'Decrease' ? adj.adjustmentQty : 0,
              openingBalance: adj.currentStock,
              closingBalance: adj.newStock,
              location: 'Main Store', // Default for adjustment
              remarks: adj.remarks
            };
            currentMovements.unshift(movement);
          }
        });
      }

      setMovements(currentMovements);
      localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(currentMovements));
    };

    loadData();
    // Refresh periodically if needed or use storage events
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Filter Logic
  const filteredMovements = useMemo(() => {
    return movements.filter(mov => {
      const matchesSearch = mov.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mov.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mov.remarks.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || mov.transactionType === filterType;
      return matchesSearch && matchesType;
    });
  }, [movements, searchQuery, filterType]);

  const exportHeaders = [
    'Date', 'Product', 'Type', 'Ref No', 'In', 'Out', 'Opening', 'Closing', 'Location'
  ];

  const exportData = filteredMovements.map(m => [
    m.date, m.productName, m.transactionType, m.referenceNo, m.quantityIn, m.quantityOut, m.openingBalance, m.closingBalance, m.location
  ]);

  return (
    <div className={`p-4 min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50/50'}`}>
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {/* <Archive className="text-primary" size={28} /> */}
            Stock Movement Report
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Audit trail of all inventory changes and movements</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden md:flex flex-col items-end mr-4">
            {/* <span className="text-[11px] font-black text-[#5e6e82] uppercase tracking-widest leading-none mb-1">DATE</span> */}
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>
              <span className="font-black text-lg leading-none">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              <Calendar size={18} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
          </div>
          <ExportButton
            headers={exportHeaders}
            data={exportData}
            fileName="stock-movement-report"
            isDarkMode={isDarkMode}
            onlyExcel={true}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Logs', value: movements.length, icon: FileText, color: 'primary' },
          { label: 'Stock In Qty', value: movements.reduce((acc, m) => acc + m.quantityIn, 0), icon: ArrowUpRight, color: 'emerald' },
          { label: 'Stock Out Qty', value: movements.reduce((acc, m) => acc + m.quantityOut, 0), icon: ArrowDownRight, color: 'red' },
          { label: 'Movements Today', value: movements.filter(m => m.date === new Date().toISOString().split('T')[0]).length, icon: Layers, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color === 'primary' ? 'primary/10 text-primary' : stat.color + '-500/10 text-' + stat.color + '-500'}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h4 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Header & Search */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 mb-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="relative flex-1 md:w-80 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search movements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-primary/50' : 'bg-slate-50 border-slate-200 text-slate-600 focus:border-primary/30'
              }`}
            />
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl whitespace-nowrap">
            {(['All', 'Adjustment', 'GRN', 'Sale', 'Transfer'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === type 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Table Area */}
      {filteredMovements.length === 0 ? (
        <div className={`p-20 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center ${isDarkMode ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-slate-50/50'}`}>
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <AlertCircle size={40} />
          </div>
          <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Movements Found</h3>
          <p className="text-slate-500 max-w-sm font-medium">There are no inventory logs matching your search or filters.</p>
        </div>
      ) : (
        viewMode === 'list' ? (
          <StockMovementReportTable
            movements={filteredMovements}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovements.map(mov => (
              <div 
                key={mov.id} 
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  isDarkMode ? 'bg-[#16191F] border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm text-slate-900'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mov.date}</span>
                    <h4 className="font-black text-sm uppercase mt-1">{mov.productName}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded font-black text-[9px] uppercase tracking-tighter ${
                    mov.transactionType === 'Adjustment' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {mov.transactionType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-dashed border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Stock In</span>
                    <span className="font-black text-emerald-600 text-lg">{mov.quantityIn || '-'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1 text-right">Stock Out</span>
                    <span className="font-black text-red-600 text-lg">{mov.quantityOut || '-'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ending Stock</span>
                    <span className="font-black text-base">{mov.closingBalance}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ref No</span>
                    <p className="font-black text-xs text-primary">{mov.referenceNo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default StockMovementReportView;


