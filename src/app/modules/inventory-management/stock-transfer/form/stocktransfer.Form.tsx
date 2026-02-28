import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { SearchableDropdown } from '../../../../../components/SearchableDropdown';
import { INITIAL_INVENTORY_PRODUCTS } from '../../../pos/mockData';
import { StockTransferEntry } from '../table/stocktransfer.Table';

interface TransferRow {
  id: string;
  productId: string;
  productName: string;
  availableStock: number;
  uom: string;
  convUnit: number;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface StockTransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onSave: (transfer: StockTransferEntry) => void;
  branches: { value: string; label: string }[];
  locations: { value: string; label: string }[];
}

export const StockTransferForm: React.FC<StockTransferFormProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onSave,
  branches,
  locations,
}) => {
  const [rows, setRows] = useState<TransferRow[]>([]);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [branchFrom, setBranchFrom] = useState('Main Branch');
  const [branchTo, setBranchTo] = useState('Main Branch');
  const [locationFrom, setLocationFrom] = useState('');
  const [locationTo, setLocationTo] = useState('');

  useEffect(() => {
    if (isOpen && rows.length === 0) {
      addRow();
    }
  }, [isOpen, rows.length]);

  const addRow = () => {
    const newRow: TransferRow = {
      id: Math.random().toString(36).substr(2, 9),
      productId: '',
      productName: '',
      availableStock: 0,
      uom: '',
      convUnit: 0,
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: keyof TransferRow, value: any) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id !== id) return row;

      const updatedRow = { ...row, [field]: value };

      // Calculate total cost
      if (field === 'quantity' || field === 'unitCost') {
        updatedRow.totalCost = (updatedRow.quantity || 0) * (updatedRow.unitCost || 0);
      }

      return updatedRow;
    }));
  };

  const handleProductSelect = (id: string, productId: string) => {
    const product = INITIAL_INVENTORY_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    setRows(prevRows => prevRows.map(row => {
      if (row.id !== id) return row;
      const defaultUom = product.uomConfig?.find(u => u.isDefault) || product.uomConfig?.[0];
      const unitCost = product.retailPrice || product.costPrice || 0;
      return {
        ...row,
        productId: product.id,
        productName: product.name,
        availableStock: 100, // Mock available stock
        uom: defaultUom?.uom || 'Unit',
        convUnit: defaultUom?.convUnit || 1,
        unitCost: unitCost,
        totalCost: row.quantity * unitCost,
      };
    }));
  };

  const handleUomChange = (rowId: string, uomName: string) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id !== rowId) return row;
      const product = INITIAL_INVENTORY_PRODUCTS.find(p => p.id === row.productId);
      const uomConfig = product?.uomConfig?.find(u => u.uom === uomName);
      if (!uomConfig) return row;
      return {
        ...row,
        uom: uomConfig.uom,
        convUnit: uomConfig.convUnit,
      };
    }));
  };

  const handleSave = () => {
    const validRows = rows.filter(row => row.productId && row.quantity > 0);
    if (validRows.length === 0 || !locationFrom || !locationTo) {
      alert('Please add at least one product and select locations');
      return;
    }

    const productNames = validRows.map(r => r.productName).join(', ');
    const totalQuantity = validRows.reduce((sum, row) => sum + row.quantity, 0);
    const totalValue = validRows.reduce((sum, row) => sum + row.totalCost, 0);
    const documentNo = `ST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    const newTransfer: StockTransferEntry = {
      id: Math.random().toString(36).substr(2, 9),
      documentNo,
      productNames,
      date: invoiceDate,
      locationFrom,
      locationTo,
      totalQuantity,
      totalProducts: validRows.length,
      totalValue,
    };

    onSave(newTransfer);
    setRows([]);
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setBranchFrom('Main Branch');
    setBranchTo('Main Branch');
    setLocationFrom('');
    setLocationTo('');
  };

  const inputClass = `w-full px-3 py-2 rounded-lg border text-xs outline-none transition-all font-medium ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary/20'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20'
    }`;

  const headerClass = "py-3 px-3 text-left text-[10px] font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-800/50 sticky top-0 z-10 whitespace-nowrap";

  const totalNetAmount = useMemo(() => {
    return rows.reduce((sum, row) => sum + row.totalCost, 0);
  }, [rows]);

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Stock Transfer"
      size="xl"
      isDarkMode={isDarkMode}
    >
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 space-y-4">
        {/* Invoice Date */}
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <label className={`text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Invoice Date
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className={inputClass}
              style={{ maxWidth: '150px' }}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1200px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className={`${headerClass} w-48`}>Product name</th>
                <th className={`${headerClass} w-28`}>Available Stock</th>
                <th className={`${headerClass} w-24`}>UOM</th>
                <th className={`${headerClass} w-24`}>Conv Unit</th>
                <th className={`${headerClass} w-24`}>Quantity</th>
                <th className={`${headerClass} w-24`}>Unit Cost</th>
                <th className={`${headerClass} w-24`}>Total Cost</th>
                <th className={`${headerClass} w-12 text-center`}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 dark:border-slate-800 group hover:bg-slate-50/30 dark:hover:bg-slate-800/30">
                  <td className="p-2">
                    <SearchableDropdown
                      options={INITIAL_INVENTORY_PRODUCTS.map(p => ({ value: p.id, label: p.name }))}
                      value={row.productId}
                      onChange={(val: string) => handleProductSelect(row.id, val)}
                      placeholder="Select Product"
                      isDarkMode={isDarkMode}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.availableStock}
                      readOnly
                      className={`${inputClass} bg-slate-50/50 dark:bg-slate-800/50 cursor-not-allowed`}
                    />
                  </td>
                  <td className="p-2">
                    {(() => {
                      const product = INITIAL_INVENTORY_PRODUCTS.find(p => p.id === row.productId);
                      if (product?.uomConfig && product.uomConfig.length > 0) {
                        return (
                          <SearchableDropdown
                            options={product.uomConfig.map(u => ({ value: u.uom, label: u.uom }))}
                            value={row.uom}
                            onChange={(val: string) => handleUomChange(row.id, val)}
                            placeholder="Unit"
                            isDarkMode={isDarkMode}
                          />
                        );
                      }
                      return (
                        <input
                          type="text"
                          value={row.uom || 'Unit'}
                          readOnly
                          className={`${inputClass} bg-slate-50/50 dark:bg-slate-800/50 cursor-not-allowed`}
                        />
                      );
                    })()}
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.convUnit}
                      readOnly
                      className={`${inputClass} bg-slate-50/50 dark:bg-slate-800/50 cursor-not-allowed`}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => updateRow(row.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className={inputClass}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.unitCost}
                      onChange={(e) => updateRow(row.id, 'unitCost', parseFloat(e.target.value) || 0)}
                      className={inputClass}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.totalCost.toFixed(2)}
                      readOnly
                      className={`${inputClass} bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold cursor-not-allowed`}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove Row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addRow}
            className="m-4 flex items-center justify-center w-8 h-8 rounded-lg border-2 border-dashed border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all active:scale-95"
            title="Add Another Product"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Branch and Location Selection */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-100'} space-y-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Branch From
                </label>
                <SearchableDropdown
                  options={branches}
                  value={branchFrom}
                  onChange={(val) => setBranchFrom(val)}
                  isDarkMode={isDarkMode}
                  placeholder="Select Branch"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Location From
                </label>
                <SearchableDropdown
                  options={locations}
                  value={locationFrom}
                  onChange={(val) => setLocationFrom(val)}
                  isDarkMode={isDarkMode}
                  placeholder="Select Location"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Branch To
                </label>
                <SearchableDropdown
                  options={branches}
                  value={branchTo}
                  onChange={(val) => setBranchTo(val)}
                  isDarkMode={isDarkMode}
                  placeholder="Select Branch"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Location To
                </label>
                <SearchableDropdown
                  options={locations}
                  value={locationTo}
                  onChange={(val) => setLocationTo(val)}
                  isDarkMode={isDarkMode}
                  placeholder="Select Location"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total and Buttons */}
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <div className="text-center sm:text-left">
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
              Total Net Amount:
            </p>
            <p className="text-2xl font-black text-emerald-600">
              {totalNetAmount.toFixed(2)} <span className="text-xs font-bold text-slate-400">PKR</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none ${isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 flex-1 sm:flex-none"
            >
              Save Stock Transfer
            </button>
          </div>
        </div>
      </div>
    </ReusableModal>
  );
};

export default StockTransferForm;
