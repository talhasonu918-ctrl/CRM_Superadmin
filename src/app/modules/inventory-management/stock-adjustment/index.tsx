'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Settings2,
  Plus,
  Search,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
  Filter,
  List,
  LayoutGrid,
  Calendar,
  Trash2,
  Edit2
} from 'lucide-react';
import { notify } from '../../../../utils/toast';
import { useTheme } from '../../../../contexts/ThemeContext';
import { StockAdjustmentTable } from './table/stockadjustment.Table';
import StockAdjustmentForm from './form/stockadjustment.Form';
import { ExportButton } from '../../../../components/ExportButton';
import { INITIAL_STOCK_ADJUSTMENTS } from '../../pos/mockData';
import { StockAdjustment } from './types';

const STORAGE_KEY = 'crm_stock_adjustments';

export const StockAdjustmentView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode: propIsDarkMode }) => {
  const { isDarkMode: contextIsDarkMode } = useTheme();
  const isDarkMode = propIsDarkMode ?? contextIsDarkMode;

  // State Management
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);

  // Load from Storage or Mock Data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAdjustments(JSON.parse(saved));
    } else {
      setAdjustments(INITIAL_STOCK_ADJUSTMENTS);
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Increase' | 'Decrease'>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const emptyAdjustment: StockAdjustment = {
    id: '',
    adjustmentNo: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    type: 'Decrease',
    reason: 'Correction',
    productId: '',
    productName: '',
    currentStock: 0,
    adjustmentQty: 0,
    newStock: 0,
    remarks: '',
    adjustedBy: 'Admin',
    status: 'Completed',
  };

  const [currentAdjustment, setCurrentAdjustment] = useState<StockAdjustment>(emptyAdjustment);

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAdjustments(JSON.parse(saved));
    }
  }, []);

  // Save to History
  const saveAdjustments = (data: StockAdjustment[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAdjustments(data);
  };

  // Filter Logic
  const filteredAdjustments = useMemo(() => {
    return adjustments.filter(adj => {
      const matchesSearch = adj.adjustmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adj.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adj.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || adj.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [adjustments, searchQuery, filterType]);

  // Actions
  const handleSave = (adjustment: StockAdjustment) => {
    let updated;
    if (editingId) {
      updated = adjustments.map(a => a.id === editingId ? adjustment : a);
    } else {
      const newAdj = { ...adjustment, id: Math.random().toString(36).substr(2, 9) };
      updated = [newAdj, ...adjustments];
    }
    saveAdjustments(updated);
    setIsModalOpen(false);
    setEditingId(null);
    notify.success(editingId ? 'Adjustment updated' : 'Stock adjusted successfully');
  };

  const handleDelete = (id: string) => {
    const updated = adjustments.filter(a => a.id !== id);
    saveAdjustments(updated);
    notify.success('Adjustment record deleted');
  };

  const handleEdit = (adj: StockAdjustment) => {
    setCurrentAdjustment(adj);
    setEditingId(adj.id);
    setIsModalOpen(true);
  };

  const exportHeaders = [
    'No', 'Date', 'Type', 'Product', 'Qty', 'New Stock', 'Reason', 'Adjusted By'
  ];

  const exportData = filteredAdjustments.map(adj => [
    adj.adjustmentNo, adj.date, adj.type, adj.productName, adj.adjustmentQty, adj.newStock, adj.reason, adj.adjustedBy
  ]);

  return (
    <div className={`p-4 min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50/50'}`}>
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="min-w-0">
          <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            <ClipboardList className="text-primary shrink-0" size={24} />
            <span className="truncate">Stock Adjustment</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Manage manual inventory increases and decreases</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <ExportButton
            headers={exportHeaders}
            data={exportData}
            fileName="stock-adjustments"
            isDarkMode={isDarkMode}
            onlyExcel={true}
          />
          <button
            onClick={() => {
              setCurrentAdjustment({...emptyAdjustment, adjustmentNo: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`});
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} /> New Adjustment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Adjustments', value: adjustments.length, icon: ClipboardList, color: 'primary' },
          { label: 'Stock Increases', value: adjustments.filter(a => a.type === 'Increase').length, icon: ArrowUpRight, color: 'emerald' },
          { label: 'Stock Decreases', value: adjustments.filter(a => a.type === 'Decrease').length, icon: ArrowDownRight, color: 'red' },
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
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search adjustments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-primary/50' : 'bg-slate-50 border-slate-200 text-slate-600 focus:border-primary/30'
              }`}
            />
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
            {(['All', 'Increase', 'Decrease'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 sm:flex-none p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 sm:flex-none p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {/* Table Area */}
      {filteredAdjustments.length === 0 ? (
        <div className={`p-20 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center ${isDarkMode ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-slate-50/50'}`}>
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <AlertCircle size={40} />
          </div>
          <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Adjustments Recorded</h3>
          <p className="text-slate-500 max-w-sm font-medium">Create your first stock adjustment to correct inventory levels for damage, loss, or finding extra stock.</p>
        </div>
      ) : (
        viewMode === 'list' ? (
          <StockAdjustmentTable
            adjustments={filteredAdjustments}
            isDarkMode={isDarkMode}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdjustments.map(adj => (
              <div 
                key={adj.id} 
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  isDarkMode ? 'bg-[#16191F] border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm text-slate-900'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{adj.date}</span>
                    <h4 className="font-black text-sm uppercase mt-1 leading-tight">{adj.productName}</h4>
                    <span className="text-[10px] text-primary font-black mt-0.5">{adj.adjustmentNo}</span>
                  </div>
                  <div className={`p-2 rounded-xl ${adj.type === 'Increase' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {adj.type === 'Increase' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-dashed border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Adjustment</span>
                    <span className={`font-black text-lg ${adj.type === 'Increase' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {adj.type === 'Increase' ? '+' : '-'}{adj.adjustmentQty}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1 text-right">New Stock</span>
                    <span className="font-black text-slate-900 dark:text-white text-lg">{adj.newStock}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Reason</span>
                    <span className="text-slate-500 dark:text-slate-300">{adj.reason}</span>
                  </div>
                  {adj.remarks && (
                    <p className="text-[11px] text-slate-400 italic line-clamp-1">"{adj.remarks}"</p>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleEdit(adj)}
                    className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(adj.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Form Modal */}
      <StockAdjustmentForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        adjustment={currentAdjustment}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

