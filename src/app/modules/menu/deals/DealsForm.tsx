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

  const inputClass = `w-full px-4 py-2.5 rounded-lg border ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-orange-500 hover:border-orange-500/50'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500 hover:border-orange-500/50'
    } focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm`;

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
      <div className="space-y-6 sm:space-y-8 animate-in fade-in zoom-in duration-300 max-h-[80vh] overflow-y-auto px-0.5 sm:px-1 pb-6 scrollbar-hidden">
        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-y-5 gap-x-4">
          <div className="col-span-1">
            <label className={`block text-xs font-black uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Name</label>
            <input type="text" value={currentDeal.name} onChange={e => setCurrentDeal({ ...currentDeal, name: e.target.value })} placeholder="e.g. Family Feast" className={inputClass} />
          </div>
          <div className="col-span-1">
            <label className={`block text-xs font-black uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Display Name</label>
            <input type="text" value={currentDeal.displayName} onChange={e => setCurrentDeal({ ...currentDeal, displayName: e.target.value })} placeholder="Display Name" className={inputClass} />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={`block text-xs font-black uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Description</label>
            <input type="text" value={currentDeal.description} onChange={e => setCurrentDeal({ ...currentDeal, description: e.target.value })} placeholder="Deal description" className={inputClass} />
          </div>
          <div className="col-span-1">
            <label className={`block text-xs font-black uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Price</label>
            <input type="number" value={currentDeal.price} onChange={e => setCurrentDeal({ ...currentDeal, price: Number(e.target.value) })} className={inputClass} />
          </div>

          <div className="col-span-1">
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
              placeholder="Select"
            />
          </div>
          <div className="col-span-1">
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
              placeholder="Select"
            />
          </div>
          <div className="col-span-1">
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
              placeholder="Select"
            />
          </div>
          <div className="col-span-1">
            <SearchableDropdown
              label="Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              value={currentDeal.status}
              onChange={(value: string) => setCurrentDeal({ ...currentDeal, status: value as 'Active' | 'Inactive' })}
              isDarkMode={isDarkMode}
              placeholder="Status"
            />
          </div>
          <div className="col-span-1">
            <SearchableDropdown
              label="POS Only"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
              value={currentDeal.showInPOSOnly ? 'true' : 'false'}
              onChange={(value: string) => setCurrentDeal({ ...currentDeal, showInPOSOnly: value === 'true' })}
              isDarkMode={isDarkMode}
              placeholder="POS?"
            />
          </div>
          <div className="sm:col-span-1">
            <label className={`block text-xs font-black uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Order Types</label>
            <input type="text" placeholder="Dine In, Take Away" value={currentDeal.orderTypes.join(', ')} onChange={e => setCurrentDeal({ ...currentDeal, orderTypes: e.target.value.split(',').map(s => s.trim()) })} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-start sm:items-center py-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={currentDeal.isTimeSpecific} onChange={e => setCurrentDeal({ ...currentDeal, isTimeSpecific: e.target.checked })} className="w-5 h-5 sm:w-4 sm:h-4 rounded border-slate-300 text-primary focus:ring-primary transition-colors" />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Is Time Specific</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={currentDeal.showOnMobile} onChange={e => setCurrentDeal({ ...currentDeal, showOnMobile: e.target.checked })} className="w-5 h-5 sm:w-4 sm:h-4 rounded border-slate-300 text-primary focus:ring-primary transition-colors" />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show on Mobile App</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={currentDeal.showOnWeb} onChange={e => setCurrentDeal({ ...currentDeal, showOnWeb: e.target.checked })} className="w-5 h-5 sm:w-4 sm:h-4 rounded border-slate-300 text-primary focus:ring-primary transition-colors" />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show on Web App</span>
          </label>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="dealImage-form" className="cursor-pointer flex-1 sm:flex-none">
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
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </label>
            {currentDeal.image && (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg">
                <img src={currentDeal.image} alt="Deal preview" className="w-8 h-8 rounded object-cover shadow-sm" />
                <button
                  type="button"
                  onClick={() => setCurrentDeal({ ...currentDeal, image: undefined })}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <hr className={isDarkMode ? 'border-slate-700' : 'border-slate-200'} />

        {/* Products Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Deal Products
            </h3>
            <button
              onClick={addProduct}
              className="text-primary hover:text-orange-600 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase transition-colors"
            >
              <PlusCircle size={14} />
              <span>Add More</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {currentDeal.products.map((p, idx) => (
              <div key={idx} className={`relative p-3 sm:p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50/50 border-slate-200'} animate-in slide-in-from-left-2 duration-300 shadow-sm`}>
                <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded bg-primary text-white text-[10px] sm:text-xs font-bold uppercase">
                  Item #{p.sequence}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end pt-2">
                  <div className="hidden sm:block sm:col-span-1">
                    <label className="block text-[10px] font-bold mb-1.5 opacity-60 uppercase">Seq</label>
                    <input type="text" readOnly value={p.sequence} className={`${inputClass} !py-1.5 !px-2 bg-slate-100/50 dark:bg-slate-800/50 text-center text-xs`} />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] sm:text-xs font-bold mb-1.5 opacity-60 uppercase">Product Name</label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={e => updateProduct(idx, { name: e.target.value })}
                      className={`${inputClass} !py-2 sm:!py-2.5 shadow-none`}
                      placeholder="e.g. Burger"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] sm:text-xs font-bold mb-1.5 opacity-60 uppercase">Contribution</label>
                    <input
                      type="number"
                      value={p.priceContribution}
                      onChange={e => updateProduct(idx, { priceContribution: Number(e.target.value) })}
                      className={`${inputClass} !py-2 sm:!py-2.5 shadow-none`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <SearchableDropdown
                      label="AddOns"
                      options={[
                        { value: 'true', label: 'Yes' },
                        { value: 'false', label: 'No' },
                      ]}
                      value={p.allowAddOns ? 'true' : 'false'}
                      onChange={(value: string) => updateProduct(idx, { allowAddOns: value === 'true' })}
                      isDarkMode={isDarkMode}
                      placeholder="Add-ons?"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end pb-1.5 px-1">
                    <button
                      onClick={() => removeProduct(idx)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={addProduct}
              className="w-full py-3.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-all flex items-center justify-center gap-2 bg-transparent group"
            >
              <Plus size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Add Item to Deal</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-900 pb-2 z-10 mx-[-4px]">
          <button
            onClick={onClose}
            className={`flex-1 sm:flex-none  px-3 py-2  sm:px-6 sm:py-2.5 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${isDarkMode
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] sm:flex-none px-4 py-2 sm:px-10 sm:py-2.5 bg-primary hover:bg-orange-600 text-white rounded-lg font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-center"
          >
            Save Deal
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default DealsForm;
