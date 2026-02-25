import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, X as XMarkIcon, Plus } from 'lucide-react';
import { ReusableModal } from '../../../../components/ReusableModal';
import { SearchableDropdown } from '../../../../components/SearchableDropdown';
import { Deal, ProductSelection } from './types';

interface DealsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Deal) => void;
  deal: Deal;
  isDarkMode: boolean;
  editingId: string | null;
}

const DealsForm: React.FC<DealsFormProps> = ({
  isOpen,
  onClose,
  onSave,
  deal: initialDeal,
  isDarkMode,
  editingId
}) => {
  const [currentDeal, setCurrentDeal] = useState<Deal>(initialDeal);

  useEffect(() => {
    setCurrentDeal(initialDeal);
  }, [initialDeal]);

  const inputClass = `w-full px-4 py-2 rounded-lg border ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-orange-500 hover:border-orange-500/50'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500 hover:border-orange-500/50'
    } focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all`;

  const handleSave = () => {
    // Validate required fields
    if (!currentDeal.name.trim()) {
      alert('Please enter a deal name');
      return;
    }
    if (!currentDeal.displayName.trim()) {
      alert('Please enter a display name');
      return;
    }
    if (currentDeal.price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    onSave(currentDeal);
  };

  const addProduct = () => {
    const newProduct: ProductSelection = {
      productId: '',
      name: '',
      priceContribution: 0,
      allowAddOns: false,
      sequence: currentDeal.products.length + 1
    };
    setCurrentDeal({
      ...currentDeal,
      products: [...currentDeal.products, newProduct]
    });
  };

  const updateProduct = (idx: number, updates: Partial<ProductSelection>) => {
    const newProducts = [...currentDeal.products];
    newProducts[idx] = { ...newProducts[idx], ...updates };
    setCurrentDeal({ ...currentDeal, products: newProducts });
  };

  const removeProduct = (idx: number) => {
    const newProducts = currentDeal.products.filter((_, i) => i !== idx);
    // Update sequences
    const resequenced = newProducts.map((p, i) => ({ ...p, sequence: i + 1 }));
    setCurrentDeal({ ...currentDeal, products: resequenced });
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Edit Deal" : "New Deal"}
      size="xl"
      isDarkMode={isDarkMode}
    >
      <div className="space-y-8 animate-in fade-in zoom-in duration-300 max-h-[80vh] overflow-y-auto scrollbar-hidden">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Name</label>
            <input type="text" value={currentDeal.name} onChange={e => setCurrentDeal({ ...currentDeal, name: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-1">
            <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Display Name</label>
            <input type="text" value={currentDeal.displayName} onChange={e => setCurrentDeal({ ...currentDeal, displayName: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Description</label>
            <input type="text" value={currentDeal.description} onChange={e => setCurrentDeal({ ...currentDeal, description: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-1">
            <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Price</label>
            <input type="number" value={currentDeal.price} onChange={e => setCurrentDeal({ ...currentDeal, price: Number(e.target.value) })} className={inputClass} />
          </div>

          <div className="md:col-span-1">
            <SearchableDropdown
              label="Category"
              options={[
                { value: 'Deals', label: 'Deals' },
                { value: 'Combo', label: 'Combo' },
                { value: 'Specials', label: 'Specials' },
              ]}
              value={currentDeal.category}
              onChange={(value: string) => setCurrentDeal({ ...currentDeal, category: value })}
              isDarkMode={isDarkMode}
              placeholder="Select Category"
            />
          </div>
          <div className="md:col-span-1">
            <SearchableDropdown
              label="Sub Category"
              options={[
                { value: 'Fast Food', label: 'Fast Food' },
                { value: 'Chinese', label: 'Chinese' },
                { value: 'Beverages', label: 'Beverages' },
              ]}
              value={currentDeal.subCategory}
              onChange={(value: string) => setCurrentDeal({ ...currentDeal, subCategory: value })}
              isDarkMode={isDarkMode}
              placeholder="Select Sub Category"
            />
          </div>
          <div className="md:col-span-1">
            <SearchableDropdown
              label="Main Branch"
              options={[
                { value: 'Main Branch', label: 'Main Branch' },
                { value: 'Lahore Branch', label: 'Lahore Branch' },
                { value: 'Multan Brnach', label: 'Multan Brnach' },
                { value: 'Islamabad Branch', label: 'Islamabad Branch' },
              ]}
              value={currentDeal.mainBranch}
              onChange={(value: string) => setCurrentDeal({ ...currentDeal, mainBranch: value })}
              isDarkMode={isDarkMode}
              placeholder="Select Branch"
            />
          </div>
          <div className="md:col-span-1">
            <SearchableDropdown
              label="Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              value={currentDeal.status}
              onChange={(value: string) => setCurrentDeal({ ...currentDeal, status: value as 'Active' | 'Inactive' })}
              isDarkMode={isDarkMode}
              placeholder="Select Status"
            />
          </div>
          <div className="md:col-span-1">
            <SearchableDropdown
              label="Show In POS Only"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
              value={currentDeal.showInPOSOnly ? 'true' : 'false'}
              onChange={(value: string) => setCurrentDeal({ ...currentDeal, showInPOSOnly: value === 'true' })}
              isDarkMode={isDarkMode}
              placeholder="Select POS Option"
            />
          </div>
          <div className="md:col-span-1">
            <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Order Types</label>
            <input type="text" placeholder="e.g. Dine In, Take Away" value={currentDeal.orderTypes.join(', ')} onChange={e => setCurrentDeal({ ...currentDeal, orderTypes: e.target.value.split(',').map(s => s.trim()) })} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={currentDeal.isTimeSpecific} onChange={e => setCurrentDeal({ ...currentDeal, isTimeSpecific: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Is Time Specific</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={currentDeal.showOnMobile} onChange={e => setCurrentDeal({ ...currentDeal, showOnMobile: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show on Mobile App</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={currentDeal.showOnWeb} onChange={e => setCurrentDeal({ ...currentDeal, showOnWeb: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show on Web App</span>
          </label>
          <div className="flex items-center gap-2">
            <label htmlFor="dealImage-form" className="cursor-pointer">
              <input
                id="dealImage-form"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCurrentDeal({ ...currentDeal, image: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </label>
            {currentDeal.image && (
              <div className="flex items-center gap-2">
                <img src={currentDeal.image} alt="Deal preview" className="w-8 h-8 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => setCurrentDeal({ ...currentDeal, image: undefined })}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <hr className={isDarkMode ? 'border-slate-700' : 'border-slate-200'} />

        {/* Products Section */}
        <div className="space-y-4">
          <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Products <PlusCircle size={14} className="cursor-pointer text-primary" onClick={addProduct} />
          </h3>
          <div className="space-y-3">
            {currentDeal.products.map((p, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-end group animate-in slide-in-from-left-2 duration-300">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold mb-1 opacity-60">Sequence</label>
                  <input type="text" readOnly value={p.sequence} className={`${inputClass} !py-1.5 !px-2 bg-slate-100/50 dark:bg-slate-800/50`} />
                </div>
                <div className="col-span-4">
                  <label className="block text-[10px] font-bold mb-1 opacity-60">Product Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={p.name}
                      onChange={e => updateProduct(idx, { name: e.target.value })}
                      className={inputClass}
                      placeholder="Search product..."
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold mb-1 opacity-60">Price Contribution</label>
                  <input
                    type="number"
                    value={p.priceContribution}
                    onChange={e => updateProduct(idx, { priceContribution: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div className="col-span-3">
                  <SearchableDropdown
                    label="Allow AddOns"
                    options={[
                      { value: 'true', label: 'Yes' },
                      { value: 'false', label: 'No' },
                    ]}
                    value={p.allowAddOns ? 'true' : 'false'}
                    onChange={(value: string) => updateProduct(idx, { allowAddOns: value === 'true' })}
                    isDarkMode={isDarkMode}
                    placeholder="Allow AddOns?"
                  />
                </div>
                <div className="col-span-1 pb-1 text-center">
                  <Trash2
                    size={16}
                    className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                    onClick={() => removeProduct(idx)}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addProduct}
              className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Add Product</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${isDarkMode
              ? 'bg-slate-800 text-slate-300 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500 border border-transparent'
              : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-500 border border-transparent'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-primary hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            Save Deal
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default DealsForm;
