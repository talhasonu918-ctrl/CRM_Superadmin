'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Grid3x3, List, X } from 'lucide-react';
import { StocksGRNTable, GRNEntry } from './table/stocksgrn.Table';
import { StocksGRNForm } from './form/stocksgrn.Form';

export const StocksGRNView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedGRN, setSelectedGRN] = useState<GRNEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleViewGRN = (entry: GRNEntry) => {
    setSelectedGRN(entry);
  };

  const handleDeleteGRN = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    setDeletingId(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <h2 className={`text-xl font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Stocks / GRN
          </h2>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search GRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none transition-all ${isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-primary/50'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50'
                }`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-all ${viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-all ${viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              title="Grid View"
            >
              <Grid3x3 size={18} />
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/10 active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} /> Add Stock
          </button>
        </div>
      </div>

      <StocksGRNTable
        isDarkMode={isDarkMode}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onView={handleViewGRN}
        onDelete={handleDeleteGRN}
      />

      {isModalOpen && (
        <StocksGRNForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* View Modal */}
      {selectedGRN && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} relative`}>
            <button
              onClick={() => setSelectedGRN(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all ${isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              title="Close"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-bold mb-4 pr-8">GRN Details</h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Stock ID</span>
                <p className="text-sm font-bold text-primary">{selectedGRN.grnNumber}</p>
              </div>
              
              <div>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Supplier</span>
                <p className="text-sm">{selectedGRN.supplier}</p>
              </div>

              <div>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Date</span>
                <p className="text-sm">{selectedGRN.date}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Items</span>
                  <p className="text-sm font-medium">{selectedGRN.totalItems}</p>
                </div>
                <div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Amount</span>
                  <p className="text-sm font-bold text-emerald-600">{selectedGRN.totalAmount.toLocaleString()} PKR</p>
                </div>
              </div>

              <div>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Status</span>
                <div className="mt-1">
                  {(() => {
                    const status = selectedGRN.status;
                    const colors = {
                      Completed: 'bg-emerald-500/10 text-emerald-500',
                      Draft: 'bg-amber-500/10 text-amber-500',
                      Cancelled: 'bg-red-500/10 text-red-500',
                    };
                    return (
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase inline-block ${colors[status]}`}>
                        {status}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-sm w-full ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} relative`}>
            <button
              onClick={() => setDeletingId(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all ${isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              title="Close"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-center mb-2">Delete GRN?</h3>
            <p className={`text-sm text-center mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Are you sure you want to delete this GRN entry? This action cannot be undone.
            </p>

            <button
              onClick={confirmDelete}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-all active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StocksGRNView;

