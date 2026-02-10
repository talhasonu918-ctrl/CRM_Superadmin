import React, { useState } from 'react';
import { Search, Plus, Edit3, Trash2, DollarSign } from 'lucide-react';
import { ReusableModal } from '../../../components/ReusableModal';

interface AddOnsViewProps {
  isDarkMode: boolean;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export const AddOnsView: React.FC<AddOnsViewProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Sample data
  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: '1', name: 'Extra Cheese', price: 2.5, category: 'Toppings', available: true },
    { id: '2', name: 'Bacon', price: 3.0, category: 'Toppings', available: true },
    { id: '3', name: 'Mushrooms', price: 2.0, category: 'Vegetables', available: true },
    { id: '4', name: 'Olives', price: 1.5, category: 'Vegetables', available: true },
    { id: '5', name: 'Extra Sauce', price: 1.0, category: 'Sauces', available: false },
    { id: '6', name: 'Jalapeños', price: 1.5, category: 'Vegetables', available: true },
  ]);

  const [currentAddon, setCurrentAddon] = useState<AddOn>({
    id: '',
    name: '',
    price: 0,
    category: '',
    available: true,
  });

  const inputClass = `w-full px-4 py-2 rounded-lg border ${isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
    } focus:outline-none focus:ring-2 focus:ring-orange-500`;

  const handleAdd = () => {
    setEditingId(null);
    setCurrentAddon({
      id: Date.now().toString(),
      name: '',
      price: 0,
      category: '',
      available: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (addon: AddOn) => {
    setEditingId(addon.id);
    setCurrentAddon({ ...addon });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddOns(addOns.filter(a => a.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      setAddOns(addOns.map(a => a.id === editingId ? currentAddon : a));
    } else {
      setAddOns([...addOns, { ...currentAddon, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const filteredAddOns = addOns.filter(addon =>
    addon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-lg md:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Product Add-Ons
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage additional items and extras
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search add-ons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 w-64`}
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Add-On
          </button>
        </div>
      </div>

      {/* Add-Ons Table */}
      <div className={`rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Name
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Category
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Price
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {filteredAddOns.map((addOn) => (
                <tr key={addOn.id} className={isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}>
                  <td className={`px-6 py-4 whitespace-nowrap font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {addOn.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {addOn.category}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {addOn.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${addOn.available
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                        }`}
                    >
                      {addOn.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(addOn)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(addOn.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Add-On" : "Add New Add-On"}
        size="md"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Name
            </label>
            <input
              type="text"
              value={currentAddon.name}
              onChange={(e) => setCurrentAddon({ ...currentAddon, name: e.target.value })}
              className={inputClass}
              placeholder="e.g. Extra Cheese"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Category
            </label>
            <input
              type="text"
              value={currentAddon.category}
              onChange={(e) => setCurrentAddon({ ...currentAddon, category: e.target.value })}
              className={inputClass}
              placeholder="e.g. Toppings"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  value={currentAddon.price}
                  onChange={(e) => setCurrentAddon({ ...currentAddon, price: parseFloat(e.target.value) || 0 })}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Status
              </label>
              <select
                value={currentAddon.available ? 'true' : 'false'}
                onChange={(e) => setCurrentAddon({ ...currentAddon, available: e.target.value === 'true' })}
                className={inputClass}
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
            >
              Save Add-On
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};
