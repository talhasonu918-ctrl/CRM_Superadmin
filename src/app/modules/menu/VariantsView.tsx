import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2 } from 'lucide-react';
import { ReusableModal } from '../../../components/ReusableModal';
import { SearchableDropdown } from '../../../components/SearchableDropdown';

interface VariantsViewProps {
  isDarkMode: boolean;
}

type SelectionType = 'single' | 'multiple';
type StatusType = 'active' | 'inactive';

interface VariantOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

interface Variant {
  id: string;
  name: string;
  instructions?: string;
  selectionType: SelectionType;
  isRequired: boolean;
  minimumSelection: number;
  maximumSelection: number;
  status: StatusType;
  options: VariantOption[];
}

const generateId = () => crypto.randomUUID();

export const VariantsView: React.FC<VariantsViewProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Default data for variants
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: '1',
      name: 'Size',
      instructions: '',
      selectionType: 'single',
      isRequired: false,
      minimumSelection: 0,
      maximumSelection: 1,
      status: 'active',
      options: [
        { id: '1', name: 'Small', priceAdjustment: 0 },
        { id: '2', name: 'Medium', priceAdjustment: 50 },
        { id: '3', name: 'Large', priceAdjustment: 100 }
      ]
    },
    {
      id: '2',
      name: 'Crust Type',
      instructions: '',
      selectionType: 'single',
      isRequired: false,
      minimumSelection: 0,
      maximumSelection: 1,
      status: 'active',
      options: [
        { id: '1', name: 'Thin', priceAdjustment: 0 },
        { id: '2', name: 'Thick', priceAdjustment: 20 },
        { id: '3', name: 'Stuffed', priceAdjustment: 40 }
      ]
    },
    {
      id: '3',
      name: 'Sauce Level',
      instructions: '',
      selectionType: 'single',
      isRequired: false,
      minimumSelection: 0,
      maximumSelection: 1,
      status: 'active',
      options: [
        { id: '1', name: 'Light', priceAdjustment: 0 },
        { id: '2', name: 'Normal', priceAdjustment: 0 },
        { id: '3', name: 'Extra', priceAdjustment: 10 }
      ]
    },
    {
      id: '4',
      name: 'Spice Level',
      instructions: '',
      selectionType: 'single',
      isRequired: false,
      minimumSelection: 0,
      maximumSelection: 1,
      status: 'active',
      options: [
        { id: '1', name: 'Mild', priceAdjustment: 0 },
        { id: '2', name: 'Medium', priceAdjustment: 0 },
        { id: '3', name: 'Hot', priceAdjustment: 5 },
        { id: '4', name: 'Extra Hot', priceAdjustment: 10 }
      ]
    }
  ]);

  const emptyVariant: Variant = {
    id: '',
    name: '',
    instructions: '',
    selectionType: 'single',
    isRequired: false,
    minimumSelection: 0,
    maximumSelection: 1,
    status: 'active',
    options: [{ id: generateId(), name: '', priceAdjustment: 0 }]
  };

  const [currentVariant, setCurrentVariant] = useState<Variant>(emptyVariant);

  const inputClass = `w-full px-4 py-3 rounded-xl border ${
    isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
  } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`;

  const isValid = useMemo(() => {
    if (!currentVariant.name.trim()) return false;
    if (currentVariant.options.length === 0) return false;
    if (currentVariant.options.some(o => !o.name.trim())) return false;
    if (currentVariant.minimumSelection > currentVariant.maximumSelection)
      return false;
    return true;
  }, [currentVariant]);


  const handleAdd = () => {
    setEditingId(null);
    setCurrentVariant({
      ...emptyVariant,
      id: generateId()
    });
    setIsModalOpen(true);
  };

  const handleEdit = (variant: Variant) => {
    setEditingId(variant.id);
    setCurrentVariant({ ...variant });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
     setVariants(prev => prev.filter(v => v.id !== id));
    };

  const handleSave = () => {
    if (!isValid) return;

    if (editingId) {
      setVariants(prev =>
        prev.map(v => (v.id === editingId ? currentVariant : v))
      );
    } else {
      setVariants(prev => [...prev, currentVariant]);
    }

    setIsModalOpen(false);
  };

  const addOption = () => {
    setCurrentVariant(prev => ({
      ...prev,
      options: [...prev.options, { id: generateId(), name: '', priceAdjustment: 0 }]
    }));
  };

  const removeOption = (id: string) => {
    setCurrentVariant(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== id)
    }));
  };

  const updateOption = (id: string, field: keyof VariantOption, value: any) => {
    setCurrentVariant(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.id === id ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const filteredVariants = variants.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold">Product Variants</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search variants..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-10 w-full`}
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} />
            Add Variant
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredVariants.map(variant => (
          <div
            key={variant.id}
            className={`relative group p-4 sm:p-6 rounded-2xl border ${
              isDarkMode 
                ? 'border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-900/20' 
                : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-lg'
            } transition-transform hover:-translate-y-1 hover:shadow-xl`}
          >
            {/* Edit/Delete Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(variant)}
                className={`p-1.5 rounded-full ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-orange-100'}`}
                title="Edit"
              >
                <Edit3 size={18} className="text-primary" />
              </button>
              <button
                onClick={() => handleDelete(variant.id)}
                className={`p-1.5 rounded-full ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-red-100'}`}
                title="Delete"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>

            {/* Card Content */}
            <div className="mb-4">
              <h3 className={`font-bold text-lg mb-1 flex flex-wrap items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {variant.name}
                <div className="flex gap-1">
                  {variant.status === 'active' ? (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 text-[10px] font-semibold">Inactive</span>
                  )}
                </div>
              </h3>
              <div className={`flex flex-wrap gap-x-2 gap-y-1 text-xs mb-1 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span className="capitalize">{variant.selectionType}</span>
                <span>•</span>
                <span>{variant.isRequired ? 'Required' : 'Optional'}</span>
                <span>•</span>
                <span>Min: {variant.minimumSelection}</span>
                <span>|</span>
                <span>Max: {variant.maximumSelection}</span>
              </div>
              {variant.instructions && (
                <div className={`text-xs italic mb-2 ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>{variant.instructions}</div>
              )}
            </div>

            {/* Options Pills */}
            <div className="flex flex-wrap gap-2 mb-2">
              {variant.options.map(option => (
                <span
                  key={option.id}
                  className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm flex items-center gap-1 ${
                    isDarkMode 
                      ? 'bg-slate-700 text-slate-200 border border-slate-600' 
                      : 'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}
                >
                  {option.name}
                  {option.priceAdjustment !== 0 && (
                    <span className={`ml-1 text-[10px] font-semibold ${
                      isDarkMode ? 'text-primary' : 'text-orange-900'
                    }`}>
                      {option.priceAdjustment > 0 ? `+${option.priceAdjustment}` : option.priceAdjustment}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Variant' : 'Add Variant'}
        size="lg"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-5 px-1 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Variant Name */}
          <div>
            <label className={`text-[11px] font-black uppercase tracking-wider mb-2 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Variant Name
            </label>
            <input
              placeholder="e.g. Size, Crust, Sauce"
              value={currentVariant.name}
              onChange={e =>
                setCurrentVariant({ ...currentVariant, name: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Instructions */}
          <div>
            <label className={`text-[11px] font-black uppercase tracking-wider mb-2 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Instructions (Optional)
            </label>
            <textarea
              placeholder="Add any instructions for customers..."
              value={currentVariant.instructions}
              onChange={e =>
                setCurrentVariant({
                  ...currentVariant,
                  instructions: e.target.value
                })
              }
              className={`${inputClass} min-h-[100px] resize-none`}
            />
          </div>

          {/* Selection Type */}
          <div>
            <label className={`text-[11px] font-black uppercase tracking-wider mb-2 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Selection Type
            </label>
            <SearchableDropdown
              options={[
                { value: 'single', label: 'Single Choice' },
                { value: 'multiple', label: 'Multiple Choice' }
              ]}
              value={currentVariant.selectionType}
              onChange={(value) =>
                setCurrentVariant({
                  ...currentVariant,
                  selectionType: value as SelectionType
                })
              }
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Required & Min/Max Row */}
          <div className="flex flex-col gap-4 p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 transition-all duration-300">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={currentVariant.isRequired}
                  onChange={e =>
                    setCurrentVariant({
                      ...currentVariant,
                      isRequired: e.target.checked,
                      minimumSelection: e.target.checked ? 1 : 0
                    })
                  }
                  className="w-5 h-5 rounded-lg border-2 border-slate-300 dark:border-slate-600 appearance-none checked:bg-primary checked:border-primary transition-all duration-200 cursor-pointer"
                />
                <div className={`absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200 ${currentVariant.isRequired ? 'opacity-100' : 'opacity-0'}`}>
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                    <path d="M20 6L9 17L4 12" />
                  </svg>
                </div>
              </div>
              <span className={`text-[13px] font-bold ${isDarkMode ? 'text-slate-200 group-hover:text-primary' : 'text-slate-700 group-hover:text-primary'} transition-colors`}>
                Required Selection
              </span>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider mb-1.5 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Min Selection
                </label>
                <input
                  type="number"
                  value={currentVariant.minimumSelection}
                  onChange={e =>
                    setCurrentVariant({
                      ...currentVariant,
                      minimumSelection: Number(e.target.value)
                    })
                  }
                  placeholder="Min"
                  className={`${inputClass} !py-2.5 !px-3 text-center`}
                  min="0"
                />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider mb-1.5 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Max Selection
                </label>
                <input
                  type="number"
                  value={currentVariant.maximumSelection}
                  onChange={e =>
                    setCurrentVariant({
                      ...currentVariant,
                      maximumSelection: Number(e.target.value)
                    })
                  }
                  placeholder="Max"
                  className={`${inputClass} !py-2.5 !px-3 text-center`}
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-4">
              <label className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Variant Options
              </label>
              <button 
                onClick={addOption} 
                className="group flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-primary/10 text-primary hover:bg-primary transition-all duration-300"
                type="button"
              >
                <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" /> 
                <span className="text-xs font-bold group-hover:text-white">Add Option</span>
              </button>
            </div>

            <div className="space-y-3">
              {currentVariant.options.map((option, index) => (
                <div 
                  key={option.id} 
                  className={`relative p-4 pt-5 sm:pt-4 rounded-2xl border transition-all duration-300 ${
                    isDarkMode ? 'bg-slate-900/50 border-slate-700 focus-within:border-primary/50' : 'bg-slate-50 border-slate-200 focus-within:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <label className={`text-[10px] font-black uppercase tracking-wider mb-1 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Option Name
                      </label>
                      <input
                        placeholder="e.g. Small, Medium, Extra Hot"
                        value={option.name}
                        onChange={e =>
                          updateOption(option.id, 'name', e.target.value)
                        }
                        className={`${inputClass} !py-2.5 shadow-sm text-sm`}
                      />
                    </div>
                    <div className="w-full">
                      <label className={`text-[10px] font-black uppercase tracking-wider mb-1 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Price Adjustment
                      </label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={option.priceAdjustment}
                            onChange={e =>
                              updateOption(
                                option.id,
                                'priceAdjustment',
                                Number(e.target.value)
                              )
                            }
                            className={`${inputClass} !pl-7 !py-2.5 shadow-sm transition-all duration-300 focus:scale-[1.01] text-sm`}
                          />
                        </div>
                        {currentVariant.options.length > 1 && (
                          <button
                            onClick={() => removeOption(option.id)}
                            className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                              isDarkMode ? 'bg-slate-800 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-white text-red-500 hover:bg-red-500 hover:text-white border border-slate-100'
                            }`}
                            title="Remove option"
                            type="button"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Position number for options */}
                  <div className="absolute top-2 left-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    Option #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 sticky bottom-0 bg-transparent">
            <button 
              onClick={() => setIsModalOpen(false)}
              className={`order-2 sm:order-1 px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-50 hover:text-slate-900 hover:bg-slate-100'
              }`}
              type="button"
            >
              Cancel
            </button>
            <button
              disabled={!isValid}
              onClick={handleSave}
              className={`order-1 sm:order-2 px-10 py-3.5 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-xl transition-all duration-300 ${
                isValid
                  ? 'bg-primary hover:bg-primary/90 active:scale-95 shadow-primary/25'
                  : 'bg-slate-400 cursor-not-allowed opacity-50 shadow-none'
              }`}
              type="button"
            >
              Save Variant
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
}