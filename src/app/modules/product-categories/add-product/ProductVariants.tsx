import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ProductFormData, ProductVariant, ProductVariantOption } from '../product-types';

interface ProductVariantsProps {
  formData: ProductFormData;
  onUpdateFormData: (data: Partial<ProductFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  formData,
  onUpdateFormData,
  onNext,
  onBack,
  isDarkMode,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<ProductVariant>({
    id: Date.now().toString(),
    name: '',
    displayName: 'Select Size',
    instructions: '',
    minimumSelection: 0,
    maximumSelection: 1,
    options: [
      { id: '1', name: 'SMALL' },
      { id: '2', name: 'MEDIUM' },
      { id: '3', name: 'LARGE' },
    ],
  });

  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
    isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
  }`;

  const addOption = () => {
    setCurrentVariant({
      ...currentVariant,
      options: [...currentVariant.options, { id: Date.now().toString(), name: '' }],
    });
  };

  const removeOption = (id: string) => {
    setCurrentVariant({
      ...currentVariant,
      options: currentVariant.options.filter(opt => opt.id !== id),
    });
  };

  const updateOption = (id: string, name: string) => {
    setCurrentVariant({
      ...currentVariant,
      options: currentVariant.options.map(opt => opt.id === id ? { ...opt, name } : opt),
    });
  };

  const saveVariant = () => {
    const variants = [...(formData.variants || []), currentVariant];
    onUpdateFormData({ variants });
    setCurrentVariant({
      id: Date.now().toString(),
      name: '',
      displayName: 'Select Size',
      instructions: '',
      minimumSelection: 0,
      maximumSelection: 1,
      options: [{ id: Date.now().toString(), name: '' }],
    });
    setIsAdding(false);
  };

  const deleteVariant = (id: string) => {
    const variants = (formData.variants || []).filter(variant => variant.id !== id);
    onUpdateFormData({ variants });
  };

  return (
    <div className="space-y-6">
      {/* Product Variants Header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Product Variants
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      {/* Existing Variants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(formData.variants || []).map((variant) => (
          <div
            key={variant.id}
            className={`rounded-xl border p-4 ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{variant.name || 'Variant'}</h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{variant.displayName}</p>
              </div>
              <button
                onClick={() => deleteVariant(variant.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {variant.options.map(opt => (
                <span
                  key={opt.id}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {opt.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Variant Form */}
      {isAdding && (
        <div className={`rounded-xl border p-6 ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}>
          <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            New Variant
          </h4>

          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Variant name"
                  value={currentVariant.name}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="Select Size"
                  value={currentVariant.displayName}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, displayName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Instructions
                </label>
                <input
                  type="text"
                  placeholder="Optional instructions"
                  value={currentVariant.instructions}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, instructions: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Minimum Selection
                </label>
                <input
                  type="number"
                  value={currentVariant.minimumSelection}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, minimumSelection: parseInt(e.target.value) || 0 })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Maximum Selection
                </label>
                <input
                  type="number"
                  value={currentVariant.maximumSelection}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, maximumSelection: parseInt(e.target.value) || 1 })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Variant Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Variant Options
                </label>
                <button
                  onClick={addOption}
                  className="text-sm text-orange-500 hover:text-purple-700 font-semibold flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Option
                </button>
              </div>
              <div className="space-y-2">
                {currentVariant.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1} Name`}
                      value={option.name}
                      onChange={(e) => updateOption(option.id, e.target.value)}
                      className={inputClass}
                    />
                    {currentVariant.options.length > 1 && (
                      <button
                        onClick={() => removeOption(option.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setIsAdding(false)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                  isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={saveVariant}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Save Variant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
            isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Next: Pricing
        </button>
      </div>
    </div>
  );
};
