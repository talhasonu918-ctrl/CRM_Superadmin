'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  Package, 
  ClipboardList, 
  LayoutGrid,
  Info
} from 'lucide-react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { SearchableDropdown } from '../../../../../components/SearchableDropdown';
import { StockAdjustment } from '../types';
import { InventoryProduct, INITIAL_INVENTORY_PRODUCTS } from '../../../pos/mockData';

interface StockAdjustmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (adjustment: StockAdjustment) => void;
  adjustment: StockAdjustment;
  isDarkMode: boolean;
}

export const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  isOpen,
  onClose,
  onSave,
  adjustment,
  isDarkMode,
}) => {
  const [formData, setFormData] = useState<StockAdjustment>(adjustment);
  const [products] = useState<InventoryProduct[]>(INITIAL_INVENTORY_PRODUCTS);

  useEffect(() => {
    setFormData(adjustment);
  }, [adjustment, isOpen]);

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // For demo purposes, we'll assume a random current stock since mock data doesn't have it
      const currentStock = Math.floor(Math.random() * 100) + 10;
      setFormData(prev => ({
        ...prev,
        productId,
        productName: product.name,
        currentStock,
        newStock: prev.type === 'Increase' ? currentStock + prev.adjustmentQty : currentStock - prev.adjustmentQty
      }));
    }
  };

  const handleQtyChange = (qty: number) => {
    setFormData(prev => ({
      ...prev,
      adjustmentQty: qty,
      newStock: prev.type === 'Increase' ? prev.currentStock + qty : prev.currentStock - qty
    }));
  };

  const handleTypeChange = (type: 'Increase' | 'Decrease') => {
    setFormData(prev => ({
      ...prev,
      type,
      newStock: type === 'Increase' ? prev.currentStock + prev.adjustmentQty : prev.currentStock - prev.adjustmentQty
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || formData.adjustmentQty <= 0) return;
    onSave(formData);
  };

  const reasons = ['Damage', 'Loss', 'Theft', 'Expiry', 'Correction', 'Found', 'Other'];

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title={adjustment.id ? 'Edit Stock Adjustment' : 'New Stock Adjustment'}
      size="2xl"
      isDarkMode={isDarkMode}
    >
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Main Form Area */}
        <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10 gap-4 sm:gap-0">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ClipboardList size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Adjustment No</p>
                <h3 className={`text-base font-black truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.adjustmentNo}</h3>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-primary/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
              <input 
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className={`w-full sm:w-auto bg-transparent text-sm font-bold outline-none text-left sm:text-right ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Action Type */}
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Adjustment Type</label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleTypeChange('Increase')}
                  className={`flex-1 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-black transition-all ${
                    formData.type === 'Increase' 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" /> Increase
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('Decrease')}
                  className={`flex-1 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-black transition-all ${
                    formData.type === 'Decrease' 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                      : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <ArrowDownRight size={16} className="sm:w-[18px] sm:h-[18px]" /> Decrease
                </button>
              </div>
            </div>

            {/* Product Selection */}
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Select Product</label>
              <SearchableDropdown
                options={products.map(p => ({ value: p.id, label: p.name }))}
                value={formData.productId}
                onChange={handleProductChange}
                placeholder="Search Item..."
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Adjustment Quantity */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Adjustment Quantity</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  min="1"
                  value={formData.adjustmentQty || ''}
                  onChange={e => handleQtyChange(Number(e.target.value))}
                  placeholder="Enter quantity"
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-sm font-black outline-none transition-all ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-primary/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primary/30'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Reason for Adjustment</label>
              <SearchableDropdown
                options={reasons.map(r => ({ value: r, label: r }))}
                value={formData.reason}
                onChange={val => setFormData({...formData, reason: val as any})}
                placeholder="Select Reason..."
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Additional Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={e => setFormData({...formData, remarks: e.target.value})}
              placeholder="Explain why this adjustment is being made..."
              rows={3}
              className={`w-full p-4 rounded-xl border text-sm font-medium outline-none transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-primary/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primary/30'
              }`}
            />
          </div>
        </div>

        {/* Sidebar Summary Area */}
        <div className={`w-full lg:w-72 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l flex flex-col justify-between ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
              <LayoutGrid size={20} className="text-primary" />
              <h4 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stock Summary</h4>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center text-[11px] sm:text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Current Stock:</span>
                <span className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formData.currentStock}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] sm:text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Adjustment:</span>
                <span className={`font-black ${formData.type === 'Increase' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formData.type === 'Increase' ? '+' : '-'}{formData.adjustmentQty}
                </span>
              </div>
              
              <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-black text-primary uppercase tracking-wider">Final Stock:</span>
                  <span className={`text-lg sm:text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {formData.newStock || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-3 sm:p-4 rounded-xl text-[10px] sm:text-[11px] leading-relaxed flex gap-3 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm border border-slate-100'}`}>
              <Info size={16} className="text-primary shrink-0" />
              <p>
                Stock adjustment will directly update your current inventory levels. 
                Keep remarks detailed for audit purposes.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6 sm:mt-8 lg:mt-0">
            <button
              type="button"
              onClick={onClose}
              className={`w-full py-2.5 sm:py-3 rounded-xl text-xs font-black transition-all ${
                isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-500 hover:bg-slate-100 shadow-sm border border-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.productId || formData.adjustmentQty <= 0}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-primary text-white text-xs font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </ReusableModal>
  );
};

export default StockAdjustmentForm;

