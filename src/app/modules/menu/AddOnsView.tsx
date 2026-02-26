
import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2 } from 'lucide-react';
import { ReusableModal } from '../../../components/ReusableModal';

interface AddOnsViewProps {
  isDarkMode: boolean;
}

type StatusType = 'active' | 'inactive';

interface AddOn {
  id: string;
  name: string;
  price: number;
  status: StatusType;
}

interface AddOnGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minimumSelection: number;
  maximumSelection: number;
  status: StatusType;
  addOns: AddOn[];
}

const generateId = () => crypto.randomUUID();

// Default data for groups and add-ons
const defaultGroups: AddOnGroup[] = [
  {
    id: 'g1',
    name: 'Toppings',
    isRequired: false,
    minimumSelection: 0,
    maximumSelection: 3,
    status: 'active',
    addOns: [
      { id: '1', name: 'Extra Cheese', price: 2.5, status: 'active' },
      { id: '2', name: 'Bacon', price: 3.0, status: 'active' },
      { id: '3', name: 'Jalapeños', price: 1.5, status: 'active' },
    ],
  },
  {
    id: 'g2',
    name: 'Vegetables',
    isRequired: false,
    minimumSelection: 0,
    maximumSelection: 2,
    status: 'active',
    addOns: [
      { id: '4', name: 'Mushrooms', price: 2.0, status: 'active' },
      { id: '5', name: 'Olives', price: 1.5, status: 'active' },
    ],
  },
  {
    id: 'g3',
    name: 'Sauces',
    isRequired: false,
    minimumSelection: 0,
    maximumSelection: 1,
    status: 'active',
    addOns: [
      { id: '6', name: 'Extra Sauce', price: 1.0, status: 'inactive' },
    ],
  },
];

export const AddOnsView: React.FC<AddOnsViewProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [groups, setGroups] = useState<AddOnGroup[]>(defaultGroups);

  const emptyGroup: AddOnGroup = {
    id: '',
    name: '',
    isRequired: false,
    minimumSelection: 0,
    maximumSelection: 1,
    status: 'active',
    addOns: [],
  };

  const [currentGroup, setCurrentGroup] = useState<AddOnGroup>(emptyGroup);

  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm ${
    isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`;

  const isValid = useMemo(() => {
    if (!currentGroup.name.trim()) return false;
    if (currentGroup.addOns.length === 0) return false;
    if (currentGroup.addOns.some(a => !a.name.trim())) return false;
    if (currentGroup.minimumSelection > currentGroup.maximumSelection)
      return false;
    return true;
  }, [currentGroup]);

  const handleAdd = () => {
    setEditingId(null);
    setCurrentGroup({ ...emptyGroup, id: generateId() });
    setIsModalOpen(true);
  };

  const handleEdit = (group: AddOnGroup) => {
    setEditingId(group.id);
    setCurrentGroup(group);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure?')) {
      setGroups(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleSave = () => {
    if (!isValid) return;

    if (editingId) {
      setGroups(prev =>
        prev.map(g => (g.id === editingId ? currentGroup : g))
      );
    } else {
      setGroups(prev => [...prev, currentGroup]);
    }

    setIsModalOpen(false);
  };

  // ======================
  // ADDON HANDLERS
  // ======================
  const addAddOn = () => {
    setCurrentGroup(prev => ({
      ...prev,
      addOns: [
        ...prev.addOns,
        { id: generateId(), name: '', price: 0, status: 'active' }
      ]
    }));
  };

  const removeAddOn = (id: string) => {
    setCurrentGroup(prev => ({
      ...prev,
      addOns: prev.addOns.filter(a => a.id !== id)
    }));
  };

  const updateAddOn = (
    id: string,
    field: keyof AddOn,
    value: any
  ) => {
    setCurrentGroup(prev => ({
      ...prev,
      addOns: prev.addOns.map(a =>
        a.id === id ? { ...a, [field]: value } : a
      )
    }));
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold">Add-On Groups</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
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
            Add Group
          </button>
        </div>
      </div>

      {/* GROUP LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredGroups.map(group => (
          <div
            key={group.id}
            className={`p-4 sm:p-5 border rounded-2xl transition-all shadow-sm ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 shadow-slate-900/20' 
                : 'bg-white border-slate-200 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {group.name}
                </h3>
                <div className={`flex flex-wrap gap-x-2 gap-y-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="font-medium">{group.isRequired ? 'Required' : 'Optional'}</span>
                  <span>•</span>
                  <span>Min {group.minimumSelection} / Max {group.maximumSelection}</span>
                </div>
              </div>

              <div className="flex gap-1">
                <button 
                  onClick={() => handleEdit(group)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Edit Group"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(group.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-slate-700 text-red-400' : 'hover:bg-red-50 text-red-500'
                  }`}
                  title="Delete Group"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.addOns.map(a => (
                <span
                  key={a.id}
                  className={`px-3 py-1 text-[11px] rounded-full font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-700 text-slate-200 border border-slate-600' 
                      : 'bg-slate-50 text-slate-700 border border-slate-100'
                  }`}
                >
                  {a.name} 
                  <span className={`ml-1 font-bold ${isDarkMode ? 'text-primary' : 'text-primary'}`}>
                    (+{a.price})
                  </span>
                </span>
              ))}
              {group.addOns.length === 0 && (
                <span className="text-xs  text-slate-400">No add-ons added</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Group' : 'Add Group'}
        size="lg"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto px-0.5 pb-2 scrollbar-hidden">
          <div className="space-y-5">
            <div>
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Group Name
              </label>
              <input
                placeholder="e.g. Toppings, Vegetable, Sauces"
                value={currentGroup.name}
                onChange={e =>
                  setCurrentGroup({
                    ...currentGroup,
                    name: e.target.value
                  })
                }
                className={inputClass}
              />
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
              currentGroup.isRequired 
                ? 'border-primary/30 bg-primary/5' 
                : isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <input
                id="isRequiredToggle"
                type="checkbox"
                checked={currentGroup.isRequired}
                onChange={e =>
                  setCurrentGroup({
                    ...currentGroup,
                    isRequired: e.target.checked,
                    minimumSelection: e.target.checked ? 1 : 0
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary transition-colors cursor-pointer"
              />
              <label htmlFor="isRequiredToggle" className={`text-sm font-bold cursor-pointer select-none ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Required Selection
                <p className={`text-[10px] font-medium leading-none mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Customer must select at least one item from this group
                </p>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-[10px] font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Min Selection
                </label>
                <input
                  type="number"
                  value={currentGroup.minimumSelection}
                  onChange={e =>
                    setCurrentGroup({
                      ...currentGroup,
                      minimumSelection: Number(e.target.value)
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`block text-[10px] font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Max Selection
                </label>
                <input
                  type="number"
                  value={currentGroup.maximumSelection}
                  onChange={e =>
                    setCurrentGroup({
                      ...currentGroup,
                      maximumSelection: Number(e.target.value)
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ADDONS */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className={`font-black uppercase text-xs tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add-Ons List</span>
                <span className={`px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold`}>{currentGroup.addOns.length}</span>
              </div>
              <button
                onClick={addAddOn}
                className="bg-primary/5 hover:bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {currentGroup.addOns.map(a => (
                <div 
                  key={a.id} 
                  className={`p-4 rounded-2xl border animate-in slide-in-from-bottom-2 duration-300 ${
                    isDarkMode ? 'bg-slate-900/50 border-slate-700/50 shadow-inner' : 'bg-slate-50 border-slate-200/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-end gap-3 sm:gap-4">
                    <div className="flex-1 w-full">
                      <label className="text-[10px] uppercase font-black tracking-[0.1em] text-slate-400 mb-1.5 block">Item Name</label>
                      <input
                        placeholder="e.g. Extra Cheese"
                        value={a.name}
                        onChange={e =>
                          updateAddOn(a.id, 'name', e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="text-[10px] uppercase font-black tracking-[0.1em] text-slate-400 mb-1.5 block">Price</label>
                      <div className="flex gap-2.5">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={a.price}
                          onChange={e =>
                            updateAddOn(a.id, 'price', Number(e.target.value))
                          }
                          className={inputClass}
                        />
                        <button
                          onClick={() => removeAddOn(a.id)}
                          className={`p-2.5 rounded-xl transition-all ${
                            isDarkMode 
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' 
                              : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-sm'
                          }`}
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {currentGroup.addOns.length === 0 && (
                <div className={`text-center py-6 rounded-xl border-2 border-dashed ${
                  isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'
                }`}>
                  Click "+ Add Item" to start adding to this group
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-2 mx-[-4px]">
            <button 
              onClick={() => setIsModalOpen(false)}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              disabled={!isValid}
              onClick={handleSave}
              className={`flex-[2] sm:flex-none px-10 py-3 rounded-xl text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all ${
                isValid
                  ? 'bg-primary hover:bg-primary/90 shadow-primary/20 active:scale-[0.98]'
                  : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50 shadow-none'
              }`}
            >
              Save Group
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};
