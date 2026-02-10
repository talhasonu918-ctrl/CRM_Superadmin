import React, { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { ProductFormData, ProductAddon, ProductAddonOption } from '../product-types';

interface ProductAddonsProps {
  formData: ProductFormData;
  onUpdateFormData: (data: Partial<ProductFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export const ProductAddons: React.FC<ProductAddonsProps> = ({
  formData,
  onUpdateFormData,
  onNext,
  onBack,
  isDarkMode,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentAddon, setCurrentAddon] = useState<ProductAddon>({
    id: '',
    name: '',
    displayName: 'Select Flavor',
    instructions: '',
    minimumSelection: 1,
    maximumSelection: 1,
    options: [{ id: '1', name: '' }],
  });

  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
    }`;

  const openAddForm = () => {
    setEditingId(null);
    setCurrentAddon({
      id: Date.now().toString(),
      name: '',
      displayName: 'Select Flavor',
      instructions: '',
      minimumSelection: 1,
      maximumSelection: 1,
      options: [{ id: Date.now().toString(), name: '' }],
    });
    setIsAdding(true);
  };

  const openEditForm = (addon: ProductAddon) => {
    setEditingId(addon.id);
    setCurrentAddon({ ...addon });
    setIsAdding(true);
  };

  const addOption = () => {
    setCurrentAddon({
      ...currentAddon,
      options: [...currentAddon.options, { id: Date.now().toString(), name: '' }],
    });
  };

  const removeOption = (id: string) => {
    setCurrentAddon({
      ...currentAddon,
      options: currentAddon.options.filter(opt => opt.id !== id),
    });
  };

  const updateOption = (id: string, name: string) => {
    setCurrentAddon({
      ...currentAddon,
      options: currentAddon.options.map(opt => opt.id === id ? { ...opt, name } : opt),
    });
  };

  const saveAddon = () => {
    let updatedAddons;
    if (editingId) {
      updatedAddons = (formData.addons || []).map(a =>
        a.id === editingId ? currentAddon : a
      );
    } else {
      updatedAddons = [...(formData.addons || []), currentAddon];
    }

    onUpdateFormData({ addons: updatedAddons });
    setIsAdding(false);
    setEditingId(null);
  };

  const deleteAddon = (id: string) => {
    const addons = (formData.addons || []).filter(addon => addon.id !== id);
    onUpdateFormData({ addons });
  };

  return (
    <div className="space-y-6">
      {/* Product Add-Ons Header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-md md:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Product Add-Ons
        </h3>
        <button
          onClick={openAddForm}
          className="px-2 py-1 md:px-4 md:py-2 text-sm md:text-md bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      {/* Existing Addons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(formData.addons || []).map((addon) => (
          <div
            key={addon.id}
            className={`rounded-xl border p-4 ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{addon.name}</h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{addon.displayName}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(addon)}
                  className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                    }`}
                  title="Edit AddOn"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteAddon(addon.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                  title="Delete AddOn"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {addon.options.length} options • Min: {addon.minimumSelection} • Max: {addon.maximumSelection}
            </div>
          </div>
        ))}
        {(formData.addons || []).length === 0 && !isAdding && (
          <div className={`col-span-full py-10 text-center rounded-xl border border-dashed ${isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-400'}`}>
            <p>No add-ons added yet. Click "Add New" to create one.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Addon Form */}
      {isAdding && (
        <div className={`rounded-xl border p-6 ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}>
          <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {editingId ? 'Edit AddOn' : 'New AddOn'}
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
                  placeholder="pizza flavor"
                  value={currentAddon.name}
                  onChange={(e) => setCurrentAddon({ ...currentAddon, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="Select Flavor"
                  value={currentAddon.displayName}
                  onChange={(e) => setCurrentAddon({ ...currentAddon, displayName: e.target.value })}
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
                  value={currentAddon.instructions}
                  onChange={(e) => setCurrentAddon({ ...currentAddon, instructions: e.target.value })}
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
                  value={currentAddon.minimumSelection}
                  onChange={(e) => setCurrentAddon({ ...currentAddon, minimumSelection: parseInt(e.target.value) || 0 })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Maximum Selection
                </label>
                <input
                  type="number"
                  value={currentAddon.maximumSelection}
                  onChange={(e) => setCurrentAddon({ ...currentAddon, maximumSelection: parseInt(e.target.value) || 1 })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* AddOn Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  AddOn Options
                </label>
                <button
                  onClick={addOption}
                  className="text-sm text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Option
                </button>
              </div>
              <div className="space-y-2">
                {currentAddon.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1} Name`}
                      value={option.name}
                      onChange={(e) => updateOption(option.id, e.target.value)}
                      className={inputClass}
                    />
                    {currentAddon.options.length > 1 && (
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
                className={`px-2 py-1.5 md:px-6 md:py-2.5  rounded-lg font-semibold transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={saveAddon}
                className="px-2 py-1.5 md:px-6 md:py-2.5 text-sm md:text-md bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                {editingId ? 'Update AddOn' : 'Save AddOn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Next: Variants
        </button>
      </div>
    </div>
  );
};
