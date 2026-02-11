
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

  const inputClass = `w-full px-4 py-2 rounded-lg border ${
    isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white'
      : 'bg-white border-slate-200 text-slate-900'
  } focus:outline-none focus:ring-2 focus:ring-orange-500`;

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
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Add-On Groups</h1>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-10 w-60`}
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Add Group
          </button>
        </div>
      </div>

      {/* GROUP LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map(group => (
          <div
            key={group.id}
            className="p-5 border rounded-xl bg-white shadow-sm"
          >
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="font-semibold">{group.name}</h3>
                <p className="text-xs text-gray-500">
                  {group.isRequired ? 'Required' : 'Optional'} •
                  Min {group.minimumSelection} / Max{' '}
                  {group.maximumSelection}
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(group)}>
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(group.id)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.addOns.map(a => (
                <span
                  key={a.id}
                  className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                >
                  {a.name} (+{a.price})
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
        title={editingId ? 'Edit Group' : 'Add Group'}
        size="lg"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <input
            placeholder="Group Name (e.g. Toppings)"
            value={currentGroup.name}
            onChange={e =>
              setCurrentGroup({
                ...currentGroup,
                name: e.target.value
              })
            }
            className={inputClass}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={currentGroup.isRequired}
              onChange={e =>
                setCurrentGroup({
                  ...currentGroup,
                  isRequired: e.target.checked,
                  minimumSelection: e.target.checked ? 1 : 0
                })
              }
            />
            Required Selection
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={currentGroup.minimumSelection}
              onChange={e =>
                setCurrentGroup({
                  ...currentGroup,
                  minimumSelection: Number(e.target.value)
                })
              }
              placeholder="Min"
              className={inputClass}
            />
            <input
              type="number"
              value={currentGroup.maximumSelection}
              onChange={e =>
                setCurrentGroup({
                  ...currentGroup,
                  maximumSelection: Number(e.target.value)
                })
              }
              placeholder="Max"
              className={inputClass}
            />
          </div>

          {/* ADDONS */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Add-Ons</span>
              <button
                onClick={addAddOn}
                className="text-orange-500 text-sm"
              >
                + Add Add-On
              </button>
            </div>

            {currentGroup.addOns.map(a => (
              <div key={a.id} className="flex gap-2 mb-2">
                <input
                  placeholder="Name"
                  value={a.name}
                  onChange={e =>
                    updateAddOn(a.id, 'name', e.target.value)
                  }
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={a.price}
                  onChange={e =>
                    updateAddOn(a.id, 'price', Number(e.target.value))
                  }
                  className={`${inputClass} w-28`}
                />
                <button
                  onClick={() => removeAddOn(a.id)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button
              disabled={!isValid}
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg text-white ${
                isValid
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-gray-400 cursor-not-allowed'
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
