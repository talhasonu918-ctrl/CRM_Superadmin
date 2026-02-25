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

  const inputClass = `w-full px-4 py-2 rounded-lg border ${
    isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white'
      : 'bg-white border-slate-200 text-slate-900'
  } focus:outline-none focus:ring-2 focus:ring-primary`;

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
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Product Variants</h1>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search variants..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-10 w-60`}
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/10 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Add Variant
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVariants.map(variant => (
          <div
            key={variant.id}
            className="relative group p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Edit/Delete Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(variant)}
                className="p-1 rounded-full hover:bg-orange-100"
                title="Edit"
              >
                <Edit3 size={18} className="text-primary" />
              </button>
              <button
                onClick={() => handleDelete(variant.id)}
                className="p-1 rounded-full hover:bg-red-100"
                title="Delete"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>

            {/* Card Content */}
            <div className="mb-4">
              <h3 className="font-bold text-lg text-slate-800 mb-1 flex items-center gap-2">
                {variant.name}
                {variant.status === 'active' ? (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Active</span>
                ) : (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold">Inactive</span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-1">
                <span className="capitalize">{variant.selectionType}</span>
                <span>•</span>
                <span>{variant.isRequired ? 'Required' : 'Optional'}</span>
                <span>•</span>
                <span>Min: {variant.minimumSelection}</span>
                <span>|</span>
                <span>Max: {variant.maximumSelection}</span>
              </div>
              {variant.instructions && (
                <div className="text-xs text-slate-400 italic mb-2">{variant.instructions}</div>
              )}
            </div>

            {/* Options Pills */}
            <div className="flex flex-wrap gap-2 mb-2">
              {variant.options.map(option => (
                <span
                  key={option.id}
                  className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-xs rounded-full font-medium shadow-sm flex items-center gap-1"
                >
                  {option.name}
                  {option.priceAdjustment !== 0 && (
                    <span className="ml-1 text-xs font-semibold">
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
        <div className="space-y-4">
          <input
            placeholder="Variant Name"
            value={currentVariant.name}
            onChange={e =>
              setCurrentVariant({ ...currentVariant, name: e.target.value })
            }
            className={inputClass}
          />

          <textarea
            placeholder="Instructions"
            value={currentVariant.instructions}
            onChange={e =>
              setCurrentVariant({
                ...currentVariant,
                instructions: e.target.value
              })
            }
            className={inputClass}
          />

          {/* Selection Type */}
          <div>
            <SearchableDropdown
              label="Selection Type"
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

          {/* Required Toggle */}
          <div className="flex items-center gap-2">
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
            />
            <span>Required Selection</span>
          </div>

          {/* Min Max */}
          <div className="grid grid-cols-2 gap-4">
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
              className={inputClass}
            />
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
              className={inputClass}
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Options</span>
              <button onClick={addOption} className="text-primary text-sm">
                + Add Option
              </button>
            </div>

            {currentVariant.options.map(option => (
              <div key={option.id} className="flex gap-2 mb-2">
                <input
                  placeholder="Option Name"
                  value={option.name}
                  onChange={e =>
                    updateOption(option.id, 'name', e.target.value)
                  }
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={option.priceAdjustment}
                  onChange={e =>
                    updateOption(
                      option.id,
                      'priceAdjustment',
                      Number(e.target.value)
                    )
                  }
                  className={`${inputClass} w-28`}
                />
                <button
                  onClick={() => removeOption(option.id)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button
              disabled={!isValid}
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg text-white ${
                isValid
                  ? 'bg-primary hover:bg-orange-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Save Variant
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
}