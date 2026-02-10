import React, { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Users2 } from 'lucide-react';
import { ReusableModal } from '../../../components/ReusableModal';

interface VariantsViewProps {
  isDarkMode: boolean;
}

interface VariantOption {
  id: string;
  name: string;
}

interface Variant {
  id: string;
  name: string;
  options: VariantOption[];
  products: number;
  instructions: string;
  minimumSelection: number;
  maximumSelection: number;
}

export const VariantsView: React.FC<VariantsViewProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Sample data with state
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: '1',
      name: 'Size',
      options: [{ id: '1', name: 'Small' }, { id: '2', name: 'Medium' }, { id: '3', name: 'Large' }],
      products: 25,
      instructions: '',
      minimumSelection: 0,
      maximumSelection: 1
    },
    {
      id: '2',
      name: 'Crust Type',
      options: [{ id: '1', name: 'Thin' }, { id: '2', name: 'Thick' }, { id: '3', name: 'Stuffed' }],
      products: 15,
      instructions: '',
      minimumSelection: 0,
      maximumSelection: 1
    },
    {
      id: '3',
      name: 'Sauce Level',
      options: [{ id: '1', name: 'Light' }, { id: '2', name: 'Normal' }, { id: '3', name: 'Extra' }],
      products: 30,
      instructions: '',
      minimumSelection: 0,
      maximumSelection: 1
    },
    {
      id: '4',
      name: 'Spice Level',
      options: [{ id: '1', name: 'Mild' }, { id: '2', name: 'Medium' }, { id: '3', name: 'Hot' }, { id: '4', name: 'Extra Hot' }],
      products: 20,
      instructions: '',
      minimumSelection: 0,
      maximumSelection: 1
    },
  ]);

  const [currentVariant, setCurrentVariant] = useState<Variant>({
    id: '',
    name: '',
    options: [{ id: '1', name: '' }],
    products: 0,
    instructions: '',
    minimumSelection: 0,
    maximumSelection: 1,
  });

  const inputClass = `w-full px-4 py-2 rounded-lg border ${isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
    } focus:outline-none focus:ring-2 focus:ring-orange-500`;

  const handleAdd = () => {
    setEditingId(null);
    setCurrentVariant({
      id: Date.now().toString(),
      name: '',
      options: [{ id: Date.now().toString(), name: '' }],
      products: 0,
      instructions: '',
      minimumSelection: 0,
      maximumSelection: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (variant: Variant) => {
    setEditingId(variant.id);
    setCurrentVariant({ ...variant });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      setVariants(variants.map(v => v.id === editingId ? currentVariant : v));
    } else {
      setVariants([...variants, currentVariant]);
    }
    setIsModalOpen(false);
  };

  const addOption = () => {
    setCurrentVariant({
      ...currentVariant,
      options: [...currentVariant.options, { id: Date.now().toString(), name: '' }]
    });
  };

  const removeOption = (id: string) => {
    setCurrentVariant({
      ...currentVariant,
      options: currentVariant.options.filter(opt => opt.id !== id)
    });
  };

  const updateOption = (id: string, name: string) => {
    setCurrentVariant({
      ...currentVariant,
      options: currentVariant.options.map(opt => opt.id === id ? { ...opt, name } : opt)
    });
  };

  const filteredVariants = variants.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-md p-1 md:p-0 md:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Product Variants
          </h1>
          <p className={`text-[12px]  p-1 md:p-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage product variations and options
          </p>
        </div>

        <div className="flex items-center gap-3 ml-2 md:ml-0">
          {/* <div className="relative border-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search variants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 w-64`}
            />
          </div> */}
          <div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-slate-400" />
  <input
    type="text"
    placeholder="Search variants..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className={`pl-10 pr-4 py-2 rounded-lg border text-[10px] md:text-sm 
      ${isDarkMode
        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
      }
      w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500
    `}
  />
</div>


          <button
            onClick={handleAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white  px-2 py-1 md:px-4 md:py-2 text-[12px] md:text-sm rounded-lg textfont-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </button>
        </div>
      </div>

      {/* Variants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVariants.map((variant) => (
          <div
            key={variant.id}
            className={`p-6 rounded-xl border ${isDarkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
              } hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {variant.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {variant.products} products
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(variant)}
                  className="p-2 hover:bg-orange-400  rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-black" />
                </button>
                <button
                  onClick={() => handleDelete(variant.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {variant.options.map((option, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-slate-100 text-slate-700'
                    }`}
                >
                  {option.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Variant" : "Add New Variant"}
        size="lg"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Variant Options
              </label>
              <button onClick={addOption} className="text-orange-500 text-sm font-medium flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Option
              </button>
            </div>
            <div className="space-y-3">
              {currentVariant.options.map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1} Name`}
                    value={option.name}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    className={inputClass}
                  />
                  {currentVariant.options.length > 1 && (
                    <button onClick={() => removeOption(option.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-md font-medium ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-1 md:px-4 md:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm md:text-md font-medium"
            >
              Save Variant
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};
