import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Tag, Calendar } from 'lucide-react';
import { ReusableModal } from '../../../components/ReusableModal';

interface DealsViewProps {
  isDarkMode: boolean;
}

interface Deal {
  id: string;
  name: string;
  discount: number;
  type: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  active: boolean;
  products: number;
}

const STORAGE_KEY = 'menu_deals';

const initialDeals: Deal[] = [
  {
    id: '1',
    name: 'Family Combo',
    discount: 20,
    type: 'percentage',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    active: true,
    products: 3
  },
  {
    id: '2',
    name: 'Weekend Special',
    discount: 5,
    type: 'fixed',
    startDate: '2026-02-08',
    endDate: '2026-02-10',
    active: true,
    products: 5
  },
  {
    id: '3',
    name: 'Happy Hour',
    discount: 15,
    type: 'percentage',
    startDate: '2026-02-01',
    endDate: '2026-03-31',
    active: true,
    products: 8
  },
  {
    id: '4',
    name: 'Student Discount',
    discount: 10,
    type: 'percentage',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    active: false,
    products: 12
  },
];

export const DealsView: React.FC<DealsViewProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [currentDeal, setCurrentDeal] = useState<Deal>({
    id: '',
    name: '',
    discount: 0,
    type: 'percentage',
    startDate: '',
    endDate: '',
    active: true,
    products: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDeals(JSON.parse(stored));
      } catch (e) {
        setDeals(initialDeals);
      }
    } else {
      setDeals(initialDeals);
    }
  }, []);

  // Save to localStorage whenever deals change
  useEffect(() => {
    if (deals.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
    }
  }, [deals]);

  const inputClass = `w-full px-4 py-2 rounded-lg border ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
    } focus:outline-none focus:ring-2 focus:ring-orange-500`;

  const handleAdd = () => {
    setEditingId(null);
    setCurrentDeal({
      id: Date.now().toString(),
      name: '',
      discount: 0,
      type: 'percentage',
      startDate: '',
      endDate: '',
      active: true,
      products: 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (deal: Deal) => {
    setEditingId(deal.id);
    setCurrentDeal({ ...deal });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeals(deals.filter(d => d.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      setDeals(deals.map(d => d.id === editingId ? currentDeal : d));
    } else {
      setDeals([...deals, currentDeal]);
    }
    setIsModalOpen(false);
  };

  const filteredDeals = deals.filter(deal =>
    deal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-lg md:text-2xl p-1 md:p-0 font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Deals & Offers
          </h1>
          <p className={`text-sm p-1 md:p-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage promotional offers and discounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
    type="text"
    placeholder="Search deals..."
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
            className="bg-orange-500 hover:bg-orange-600 text-white  px-2 py-1.5 md:px-4 md:py-2 text-[12px] md:text-sm rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Deal
          </button>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 md:p-0">
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            className={`p-6 rounded-xl border ${isDarkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
              } hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {deal.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {deal.products} products included
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(deal)}
                  className="p-2 hover:bg-orange-400 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-black dark:text-white" />
                </button>
                <button
                  onClick={() => handleDelete(deal.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Discount
                </span>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {deal.type === 'percentage' ? `${deal.discount}%` : `$${deal.discount}`}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                  {deal.startDate} - {deal.endDate}
                </span>
              </div>

              <div className="pt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${deal.active
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-slate-500/10 text-slate-500'
                    }`}
                >
                  {deal.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Deal" : "Create New Deal"}
        size="lg"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Deal Name
            </label>
            <input
              type="text"
              value={currentDeal.name}
              onChange={(e) => setCurrentDeal({ ...currentDeal, name: e.target.value })}
              className={inputClass}
              placeholder="e.g. Family Combo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Discount Value
              </label>
              <input
                type="number"
                value={currentDeal.discount}
                onChange={(e) => setCurrentDeal({ ...currentDeal, discount: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Type
              </label>
              <select
                value={currentDeal.type}
                onChange={(e) => setCurrentDeal({ ...currentDeal, type: e.target.value as 'percentage' | 'fixed' })}
                className={inputClass}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Start Date
              </label>
              <input
                type="date"
                value={currentDeal.startDate}
                onChange={(e) => setCurrentDeal({ ...currentDeal, startDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                End Date
              </label>
              <input
                type="date"
                value={currentDeal.endDate}
                onChange={(e) => setCurrentDeal({ ...currentDeal, endDate: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Products Count
              </label>
              <input
                type="number"
                value={currentDeal.products}
                onChange={(e) => setCurrentDeal({ ...currentDeal, products: parseInt(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Status
              </label>
              <select
                value={currentDeal.active ? 'true' : 'false'}
                onChange={(e) => setCurrentDeal({ ...currentDeal, active: e.target.value === 'true' })}
                className={inputClass}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`px-2 py-1.5 md:px-4 md:py-2 text-[12px] md:text-md rounded-lg font-medium ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-1.5 md:px-4 md:py-2 text-[12px] md:text-md bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
            >
              {editingId ? 'Update Deal' : 'Create Deal'}
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};
