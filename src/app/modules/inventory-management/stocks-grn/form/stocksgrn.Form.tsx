import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { SearchableDropdown } from '../../../../../components/SearchableDropdown';
import { INITIAL_INVENTORY_PRODUCTS } from '../../../pos/mockData';

const UOM_OPTIONS = [
  { value: 'Kilogram', label: 'Kilogram (kg)' },
  { value: 'Gram', label: 'Gram (g)' },
  { value: 'Liter', label: 'Liter (L)' },
  { value: 'Milliliter', label: 'Milliliter (mL)' },
  { value: 'Piece', label: 'Piece (Pc)' },
  { value: 'Box', label: 'Box' },
  { value: 'Carton', label: 'Carton' },
  { value: 'Dozen', label: 'Dozen' },
  { value: 'Meter', label: 'Meter (m)' },
  { value: 'Square Meter', label: 'Square Meter (m²)' },
  { value: 'Cubic Meter', label: 'Cubic Meter (m³)' },
  { value: 'Unit', label: 'Unit' },
  { value: 'Bundle', label: 'Bundle' },
  { value: 'Pack', label: 'Pack' },
  { value: 'Pouch', label: 'Pouch' },
];

interface GRNRow {
  id: string;
  productId: string;
  productName: string;
  uom: string;
  quantity: number;
  bonusQuantity: number;
  costPrice: number;
  batchName: string;
}

interface StocksGRNFormProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const StocksGRNForm: React.FC<StocksGRNFormProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [rows, setRows] = useState<GRNRow[]>([]);

  useEffect(() => {
    if (isOpen && rows.length === 0) {
      addRow();
    }
  }, [isOpen]);

  const addRow = () => {
    const newRow: GRNRow = {
      id: Math.random().toString(36).substr(2, 9),
      productId: '',
      productName: '',
      uom: '',
      quantity: 0,
      bonusQuantity: 0,
      costPrice: 0,
      batchName: '',
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: keyof GRNRow, value: any) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id !== id) return row;
      return { ...row, [field]: value };
    }));
  };

  const handleProductSelect = (id: string, productId: string) => {
    const product = INITIAL_INVENTORY_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    setRows(prevRows => prevRows.map(row => {
      if (row.id !== id) return row;
      return {
        ...row,
        productId: product.id,
        productName: product.name,
        costPrice: product.costPrice || 0,
      };
    }));
  };

  const headerClass = "py-3 px-2 text-left text-[10px] font-bold uppercase text-slate-500 bg-slate-50/50 sticky top-0 z-10 whitespace-nowrap";

  const inputClass = `w-full px-2 py-1.5 rounded border text-xs outline-none transition-all ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-primary/50'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50'
    }`;

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Stock"
      size="xl"
      isDarkMode={isDarkMode}
    >
      <div className="flex flex-col h-full bg-white dark:bg-slate-900">
        <div className="flex-1 overflow-x-auto  overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className={`${headerClass} w-64`}>Product Name</th>
                <th className={`${headerClass} w-32`}>UOM</th>
                <th className={`${headerClass} w-24`}>Quantity</th>
                <th className={`${headerClass} w-24`}>Bonus Qty</th>
                <th className={`${headerClass} w-24`}>Cost Price</th>
                <th className={`${headerClass} w-40`}>Batch Name</th>
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
                    <SearchableDropdown
                      options={UOM_OPTIONS}
                      value={row.uom}
                      onChange={(val: string) => updateRow(row.id, 'uom', val)}
                      placeholder="Select UOM"
                      isDarkMode={isDarkMode}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => updateRow(row.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className={inputClass}
                      placeholder="0"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.bonusQuantity}
                      onChange={(e) => updateRow(row.id, 'bonusQuantity', parseFloat(e.target.value) || 0)}
                      className={inputClass}
                      placeholder="0"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.costPrice}
                      onChange={(e) => updateRow(row.id, 'costPrice', parseFloat(e.target.value) || 0)}
                      className={inputClass}
                      placeholder="0"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.batchName}
                      onChange={(e) => updateRow(row.id, 'batchName', e.target.value)}
                      className={inputClass}
                      placeholder="Batch Name"
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

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 z-20">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isDarkMode
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Saving GRN:', rows);
              onClose();
            }}
            className="px-8 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/10 active:scale-95"
          >
            Save Stock
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

