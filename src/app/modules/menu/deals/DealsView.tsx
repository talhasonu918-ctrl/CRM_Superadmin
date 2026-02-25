import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import DealsTable from './DealsTable';
import DealsForm from './DealsForm';
import DealsViewModal from './DealsViewModal';
import { Deal } from './types';

interface DealsViewProps {
  isDarkMode: boolean;
}

const STORAGE_KEY = 'menu_deals';

const initialDeals: Deal[] = [
  {
    id: '1',
    name: 'Family Combo',
    displayName: 'Family Feast Combo',
    description: 'Perfect for a family of 4',
    price: 1500,
    category: 'Deals',
    subCategory: 'Combo',
    mainBranch: 'Main Branch',
    status: 'Active',
    showInPOSOnly: true,
    orderTypes: ['Dine In', 'Take Away'],
    isTimeSpecific: false,
    showOnMobile: true,
    showOnWeb: true,
    products: [
      { productId: 'p1', name: 'SPIN ROLL', priceContribution: 0, allowAddOns: false, sequence: 1 },
      { productId: 'p2', name: 'FULL BROAST', priceContribution: 0, allowAddOns: false, sequence: 2 },
    ],
    selectionSections: [
      {
        id: 's1',
        name: 'Daily Selection',
        instructions: 'Choose any one',
        priceContribution: 0,
        minSelection: 1,
        maxSelection: 1,
        items: [
          { productId: 'p3', name: 'FULL BROAST', priceContribution: 0, allowAddOns: false, sequence: 1 }
        ]
      }
    ]
  },
];

export const DealsView: React.FC<DealsViewProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? (parsed.length > 0 ? parsed : initialDeals) : initialDeals;
        } catch (e) {
          console.error('Error parsing localStorage:', e);
        }
      }
    }
    return initialDeals;
  });

  const emptyDeal: Deal = {
    id: '',
    name: '',
    displayName: '',
    description: '',
    price: 0,
    category: '',
    subCategory: '',
    mainBranch: '',
    status: 'Active',
    showInPOSOnly: false,
    orderTypes: [],
    isTimeSpecific: false,
    showOnMobile: false,
    showOnWeb: false,
    products: [],
    selectionSections: [],
  };

  const [currentDeal, setCurrentDeal] = useState<Deal>(emptyDeal);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  }, [deals]);

  const handleAdd = () => {
    setEditingId(null);
    setCurrentDeal({ ...emptyDeal, id: Date.now().toString() });
    setIsModalOpen(true);
  };

  const handleEdit = (deal: Deal) => {
    setEditingId(deal.id);
    setCurrentDeal({ ...deal });
    setIsModalOpen(true);
  };

  const handleView = (deal: Deal) => {
    setCurrentDeal({ ...deal });
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals(deals.filter(d => d.id !== id));
    }
  };

  const handleSave = (dealToSave: Deal) => {
    let updatedDeals;
    if (editingId) {
      updatedDeals = deals.map(d => d.id === editingId ? dealToSave : d);
    } else {
      updatedDeals = [...deals, dealToSave];
    }
    setDeals(updatedDeals);
    setIsModalOpen(false);
    setEditingId(null);
  };

  const filteredDeals = useMemo(() => deals.filter(deal =>
    deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  ), [deals, searchTerm]);

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
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-orange-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500'
                }
                w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all
              `}
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-orange-600 text-white px-3 py-2 md:px-4 md:py-2.5 text-[12px] md:text-sm rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md shadow-orange-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Create Deal</span>
          </button>
        </div>
      </div>

      <DealsTable
        data={filteredDeals}
        isDarkMode={isDarkMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <DealsForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        deal={currentDeal}
        isDarkMode={isDarkMode}
        editingId={editingId}
      />

      <DealsViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        deal={currentDeal}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default DealsView;
