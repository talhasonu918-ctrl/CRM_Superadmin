import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, X, Upload, FileText, Percent, Truck, IndianRupee } from 'lucide-react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { SearchableDropdown } from '../../../../../components/SearchableDropdown';
import { INITIAL_INVENTORY_PRODUCTS } from '../../../pos/mockData';
import { notify } from '../../../../../utils/toast';

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

const SUPPLIERS = [
  { value: 'Metro Wholesale', label: 'Metro Wholesale' },
  { value: 'Al-Madina Traders', label: 'Al-Madina Traders' },
  { value: 'Nestle Pakistan', label: 'Nestle Pakistan' },
  { value: 'Yum Foods', label: 'Yum Foods' },
];

const LOCATIONS = [
  { value: 'Main Store', label: 'Main Store' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Cold Storage', label: 'Cold Storage' },
  { value: 'Kitchen', label: 'Kitchen' },
  { value: 'Dry Store', label: 'Dry Store' },
];

const REASON_OPTIONS = [
  { value: 'Purchase', label: 'Purchase from Supplier' },
  { value: 'Opening', label: 'Opening Stock' },
  { value: 'Adjustment', label: 'Stock Adjustment' },
  { value: 'Return', label: 'Kitchen Return' },
  { value: 'Correction', label: 'Wastage Correction' },
];

interface GRNRow {
  id: string;
  productId: string;
  productName: string;
  uom: string;
  quantity: number;
  bonusQuantity: number;
  costPrice: number;
  totalCost: number;
  batchName: string;
}

interface StocksGRNFormProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const StocksGRNForm: React.FC<StocksGRNFormProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [flowType, setFlowType] = useState<'purchase' | 'direct'>('purchase');
  const [rows, setRows] = useState<GRNRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Purchase Flow Fields
  const [supplier, setSupplier] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  
  // Optional Global Fields
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(0);
  const [freightCharges, setFreightCharges] = useState<number>(0);
  
  // Direct Stock Flow Fields
  const [reason, setReason] = useState('Opening');

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
      totalCost: 0,
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

      const updatedRow = { ...row, [field]: value };

      // Calculate total cost
      if (field === 'quantity' || field === 'costPrice') {
        const qty = parseFloat(updatedRow.quantity.toString()) || 0;
        const cost = parseFloat(updatedRow.costPrice.toString()) || 0;
        updatedRow.totalCost = qty * cost;
      }

      return updatedRow;
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
        totalCost: (row.quantity || 0) * (product.costPrice || 0),
      };
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInvoiceFile(e.target.files[0]);
      notify.success('Invoice uploaded successfully');
    }
  };

  const subTotal = rows.reduce((sum, row) => sum + (row.totalCost || 0), 0);
  const discountAmount = (subTotal * discountPercent) / 100;
  const taxableAmount = subTotal - discountAmount;
  const taxAmount = (taxableAmount * salesTaxPercent) / 100;
  const grandTotal = taxableAmount + taxAmount + freightCharges;

  const totalProducts = rows.length;
  const totalQuantity = rows.reduce((sum, row) => sum + (row.quantity || 0), 0);

  const headerClass = "py-3 px-2 text-left text-[10px] font-bold uppercase text-slate-500 bg-slate-50/50 sticky top-0 z-10 whitespace-nowrap";

  const inputClass = `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
    }`;

  const labelClass = `text-[11px] font-bold uppercase tracking-wider mb-1.5 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`;

  const handleSave = () => {
    if (flowType === 'purchase' && !supplier) {
      notify.error('Please select a supplier');
      return;
    }
    if (!location) {
      notify.error('Please select a location');
      return;
    }
    if (rows.length === 0) {
      notify.error('Please add at least one item');
      return;
    }

    // Generate unique GRN number
    const timestamp = Date.now();
    const grnNumber = `GRN-${new Date().getFullYear()}-${String(timestamp).slice(-6)}`;

    const grnData = {
      id: timestamp.toString(),
      grnNumber,
      supplier: flowType === 'purchase' ? supplier : 'Direct Add',
      date: invoiceDate,
      totalItems: rows.length,
      totalAmount: grandTotal,
      status: 'Completed' as const,
      // Extended data
      flowType,
      invoiceNo: flowType === 'purchase' ? invoiceNo : '-',
      location,
      reason: flowType === 'direct' ? reason : 'Purchase',
      items: rows,
      totalQuantity,
      totalProducts,
      discountPercent,
      salesTaxPercent,
      freightCharges,
      subTotal,
    };

    // Get existing GRNs from localStorage
    const existingGRNs = localStorage.getItem('grn_entries');
    const grnsList = existingGRNs ? JSON.parse(existingGRNs) : [];

    // Add new GRN
    grnsList.unshift(grnData); // Add to beginning

    // Save to localStorage
    localStorage.setItem('grn_entries', JSON.stringify(grnsList));

    console.log('GRN saved to localStorage:', grnData);
    notify.success('Stock saved successfully!');
    onClose();
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add ${flowType === 'purchase' ? 'Supplier Stock' : 'Stock'}`}
      size="2xl"
      isDarkMode={isDarkMode}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Flow Type Toggle */}
        <div className={`pb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                checked={flowType === 'purchase'}
                onChange={() => setFlowType('purchase')}
                className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
              />
              <span className={`text-sm font-bold transition-colors ${flowType === 'purchase' ? 'text-primary' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Purchase from Supplier
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                checked={flowType === 'direct'}
                onChange={() => setFlowType('direct')}
                className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
              />
              <span className={`text-sm font-bold transition-colors ${flowType === 'direct' ? 'text-primary' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Quick Add Stock
              </span>
            </label>
          </div>
        </div>

        {/* Form Header */}
        <div className={`pt-6 pb-6 border-b grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          {flowType === 'purchase' ? (
            <>
              <div>
                <label className={labelClass}>Supplier *</label>
                <SearchableDropdown
                  options={SUPPLIERS}
                  value={supplier}
                  onChange={setSupplier}
                  placeholder="Select Supplier"
                  isDarkMode={isDarkMode}
                />
              </div>
              <div>
                <label className={labelClass}>Invoice No</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    placeholder="Enter Invoice #"
                    className={inputClass}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,application/pdf"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${invoiceFile ? 'text-primary' : 'text-slate-400'}`}
                      title="Upload Invoice"
                    >
                      <Upload size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Location *</label>
                <SearchableDropdown
                  options={LOCATIONS}
                  value={location}
                  onChange={setLocation}
                  placeholder="Select Location"
                  isDarkMode={isDarkMode}
                />
              </div>
              {invoiceFile && (
                <div className="md:col-span-1">
                  <label className={labelClass}>Attached File</label>
                  <div className={`flex items-center gap-2 p-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <FileText size={16} className="text-primary shrink-0" />
                    <span className="text-xs font-medium truncate shrink">{invoiceFile.name}</span>
                    <button onClick={() => setInvoiceFile(null)} className="ml-auto text-slate-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className={labelClass}>Reason *</label>
                <SearchableDropdown
                  options={REASON_OPTIONS}
                  value={reason}
                  onChange={setReason}
                  placeholder="Select Reason"
                  isDarkMode={isDarkMode}
                />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Location *</label>
                <SearchableDropdown
                  options={LOCATIONS}
                  value={location}
                  onChange={setLocation}
                  placeholder="Select Location"
                  isDarkMode={isDarkMode}
                />
              </div>
              <div className={`p-3 rounded-xl border border-dashed flex flex-col justify-center ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Supplier</p>
                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Optional Flow</p>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6 pt-6">
          {/* Items Table Container */}
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
              <table className="w-full border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className={`${headerClass} w-72 pl-4`}>Product Name</th>
                    <th className={`${headerClass} w-36`}>UOM</th>
                    <th className={`${headerClass} w-28`}>Quantity</th>
                    <th className={`${headerClass} w-28`}>Bonus Qty</th>
                    <th className={`${headerClass} w-32`}>Cost Price</th>
                    <th className={`${headerClass} w-32`}>Total Cost</th>
                    <th className={`${headerClass} w-44`}>Batch Name</th>
                    <th className={`${headerClass} w-16 text-center`}></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {rows.map((row) => (
                    <tr key={row.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="flex flex-col gap-2">
                          <SearchableDropdown
                            options={INITIAL_INVENTORY_PRODUCTS.map(p => ({ value: p.id, label: p.name }))}
                            value={row.productId}
                            onChange={(val: string) => handleProductSelect(row.id, val)}
                            placeholder="Search Product..."
                            isDarkMode={isDarkMode}
                          />
                          {/* Add Row Button under first row product name */}
                          {rows.indexOf(row) === rows.length - 1 && (
                            <button
                              onClick={addRow}
                              className={`flex items-center gap-2 text-[11px] font-bold transition-all px-2 py-1 rounded-md w-fit ${isDarkMode
                                ? 'text-primary hover:bg-primary/10'
                                : 'text-primary hover:bg-primary/5'
                                }`}
                            >
                              <Plus size={14} className="border-2 border-primary rounded-sm p-0.5" />
                              ADD ANOTHER PRODUCT
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <SearchableDropdown
                          options={UOM_OPTIONS}
                          value={row.uom}
                          onChange={(val: string) => updateRow(row.id, 'uom', val)}
                          placeholder="Unit"
                          isDarkMode={isDarkMode}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={row.quantity}
                          onChange={(e) => updateRow(row.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className={inputClass}
                          placeholder="0"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={row.bonusQuantity}
                          onChange={(e) => updateRow(row.id, 'bonusQuantity', parseFloat(e.target.value) || 0)}
                          className={inputClass}
                          placeholder="0"
                        />
                      </td>
                      <td className="p-3">
                        <div className="relative">
                          <input
                            type="number"
                            value={row.costPrice}
                            onChange={(e) => updateRow(row.id, 'costPrice', parseFloat(e.target.value) || 0)}
                            className={inputClass}
                            placeholder="0.00"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className={`px-3 py-2 rounded-lg font-bold text-sm ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                          {row.totalCost.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={row.batchName}
                          onChange={(e) => updateRow(row.id, 'batchName', e.target.value)}
                          className={inputClass}
                          placeholder="Batch ID/No"
                        />
                      </td>
                      <td className="p-3 text-center">
                        {rows.length > 1 && (
                          <button
                            onClick={() => removeRow(row.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                            title="Remove row"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            {/* Optional Fields Card */}
            <div className={`p-5 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Additional Details
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <Percent size={10} /> Discount (%)
                    </label>
                  </div>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <Percent size={10} /> Sales Tax (%)
                    </label>
                  </div>
                  <input
                    type="number"
                    value={salesTaxPercent}
                    onChange={(e) => setSalesTaxPercent(parseFloat(e.target.value) || 0)}
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <Truck size={10} /> Freight Charges
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">Rs</span>
                    <input
                      type="number"
                      value={freightCharges}
                      onChange={(e) => setFreightCharges(parseFloat(e.target.value) || 0)}
                      className={`${inputClass} pl-8`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Order Summary
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Sub Total</span>
                  <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Rs. {subTotal.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between items-center text-sm text-red-500 font-medium ">
                    <span>Discount ({discountPercent}%)</span>
                    <span>- Rs. {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {salesTaxPercent > 0 && (
                  <div className="flex justify-between items-center text-sm text-blue-500 font-medium">
                    <span>Sales Tax ({salesTaxPercent}%)</span>
                    <span>+ Rs. {taxAmount.toFixed(2)}</span>
                  </div>
                )}
                {freightCharges > 0 && (
                  <div className="flex justify-between items-center text-sm text-blue-500 font-medium">
                    <span>Freight</span>
                    <span>+ Rs. {freightCharges.toFixed(2)}</span>
                  </div>
                )}
                
                <div className={`pt-3 mt-3 border-t flex justify-between items-end ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Grand Total</span>
                    <span className="text-2xl font-black text-emerald-600">Rs. {grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400">{totalProducts} Items</span>
                    <span className="text-[10px] font-bold text-slate-400">{totalQuantity} Qty</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={onClose}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isDarkMode
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  Save Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReusableModal>
  );
};

