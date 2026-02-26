'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Calendar } from 'lucide-react';
import { StockTransferTable } from './table/stocktransfer.Table';
import { StockTransferForm } from './form/stocktransfer.Form';
import { StockTransferEntry } from './table/stocktransfer.Table';

export const StockTransferView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransferEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: '2026-02-01',
    to: '2026-02-28',
  });

  const [transferData, setTransferData] = useState<StockTransferEntry[]>([
    {
      id: '1',
      documentNo: 'ST-2026-0001',
      productNames: 'Rice, Dal, Ghee',
      date: '2026-02-20',
      locationFrom: 'Main Store',
      locationTo: 'Warehouse',
      totalQuantity: 150,
      totalProducts: 3,
      totalValue: 45000.00,
    },
    {
      id: '2',
      documentNo: 'ST-2026-0002',
      productNames: 'Chicken, Mutton',
      date: '2026-02-22',
      locationFrom: 'Warehouse',
      locationTo: 'Cold Storage',
      totalQuantity: 80,
      totalProducts: 2,
      totalValue: 32000.00,
    },
    {
      id: '3',
      documentNo: 'ST-2026-0003',
      productNames: 'Flour, Sugar, Salt',
      date: '2026-02-24',
      locationFrom: 'Cold Storage',
      locationTo: 'Kitchen',
      totalQuantity: 200,
      totalProducts: 3,
      totalValue: 18500.00,
    },

        {
      id: '4',
      documentNo: 'ST-2026-0003',
      productNames: 'Flour, Sugar, Salt',
      date: '2026-02-24',
      locationFrom: 'Cold Storage',
      locationTo: 'Kitchen',
      totalQuantity: 200,
      totalProducts: 3,
      totalValue: 18500.00,
    },
        {
      id: '5',
      documentNo: 'ST-2025-0013',
      productNames: 'Flour, Sugar, Salt',
      date: '2026-02-24',
      locationFrom: 'Cold Storage',
      locationTo: 'Kitchen',
      totalQuantity: 200,
      totalProducts: 3,
      totalValue: 18500.00,
    },
        {
      id: '6',
      documentNo: 'ST-2026-0023',
      productNames: 'Flour, Sugar, Salt',
      date: '2025-02-24',
      locationFrom: 'Cold Storage',
      locationTo: 'Kitchen',
      totalQuantity: 200,
      totalProducts: 3,
      totalValue: 18500.00,
    },
  ]);

  const branches = [
    { value: 'Main Branch', label: 'Main Branch' },
    { value: 'Branch 1', label: 'Branch 1' },
    { value: 'Branch 2', label: 'Branch 2' },
    { value: 'Branch 3', label: 'Branch 3' },
  ];

  const locations = [
    { value: 'Main Store', label: 'Main Store' },
    { value: 'Warehouse', label: 'Warehouse' },
    { value: 'Cold Storage', label: 'Cold Storage' },
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'Dry Store', label: 'Dry Store' },
  ];

  const handleSaveTransfer = (newTransfer: StockTransferEntry) => {
    setTransferData([...transferData, newTransfer]);
    setIsModalOpen(false);
  };

  const handleViewTransfer = (entry: StockTransferEntry) => {
    setSelectedTransfer(entry);
  };

  const handleDeleteTransfer = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setTransferData(transferData.filter(item => item.id !== deletingId));
      setDeletingId(null);
    }
  };

  const dateInputClass = `px-4 py-2 rounded-lg border text-xs outline-none transition-all font-medium ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-primary/50'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50'
    }`;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <h2 className={`text-lg sm:text-xl font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Stocks Transfer
          </h2>
          
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                From
              </span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className={dateInputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                To 
              </span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className={dateInputClass}
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none transition-all ${isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-primary/50'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50'
                }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${isDarkMode
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Calendar size={16} /> Print
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2  px-4 py-1.5 sm:px-6 sm:py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/10 active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} /> Add Stock Transfer
          </button>
        </div>
      </div>

      {/* Table */}
      <StockTransferTable
        isDarkMode={isDarkMode}
        searchTerm={searchTerm}
        data={transferData}
        onView={handleViewTransfer}
        onDelete={handleDeleteTransfer}
      />

      {/* Modal Form */}
      {isModalOpen && (
        <StockTransferForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isDarkMode={isDarkMode}
          onSave={handleSaveTransfer}
          branches={branches}
          locations={locations}
        />
      )}

      {/* View Modal */}
      {selectedTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <h3 className="text-lg font-bold mb-4">Transfer Details</h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Document No</span>
                <p className="text-sm font-bold text-primary">{selectedTransfer.documentNo}</p>
              </div>
              
              <div>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Date</span>
                <p className="text-sm">{selectedTransfer.date}</p>
              </div>

              <div>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Products</span>
                <p className="text-sm">{selectedTransfer.productNames}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>From Location</span>
                  <p className="text-sm">{selectedTransfer.locationFrom}</p>
                </div>
                <div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>To Location</span>
                  <p className="text-sm">{selectedTransfer.locationTo}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Quantity</span>
                  <p className="text-sm font-medium">{selectedTransfer.totalQuantity}</p>
                </div>
                <div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Products</span>
                  <p className="text-sm font-medium">{selectedTransfer.totalProducts}</p>
                </div>
                <div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Value</span>
                  <p className="text-sm font-bold text-emerald-600">{selectedTransfer.totalValue.toLocaleString()} PKR</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTransfer(null)}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-sm w-full ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-center mb-2">Delete Transfer?</h3>
            <p className={`text-sm text-center mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Are you sure you want to delete this stock transfer? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${isDarkMode
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTransferView;

