import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Tag, Calendar, User, ChevronDown, ChevronUp, PlusCircle, MinusCircle, X as XMarkIcon } from 'lucide-react';
import { ReusableModal } from '../../../components/ReusableModal';
import InfiniteTable from '../../../components/InfiniteTable';
import { useInfiniteTable } from '../../../hooks/useInfiniteTable';
import { ColumnDef } from '@tanstack/react-table';

interface DealsViewProps {
  isDarkMode: boolean;
}

interface ProductSelection {
  productId: string;
  name: string;
  priceContribution: number;
  allowAddOns: boolean;
  sequence: number;
}

interface SelectionSection {
  id: string;
  name: string;
  instructions: string;
  priceContribution: number;
  minSelection: number;
  maxSelection: number;
  items: ProductSelection[];
}

interface Deal {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  mainBranch: string;
  status: 'Active' | 'Inactive';
  showInPOSOnly: boolean;
  orderTypes: string[];
  isTimeSpecific: boolean;
  showOnMobile: boolean;
  showOnWeb: boolean;
  image?: string;
  products: ProductSelection[];
  selectionSections: SelectionSection[];
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [currentDeal, setCurrentDeal] = useState<Deal>({
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
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setDeals(parsed);
          console.log('Loaded deals from localStorage:', parsed.length, 'deals');
        } else {
          console.log('Invalid data structure in localStorage, starting fresh');
          setDeals([]);
        }
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
        setDeals([]);
      }
    } else {
      console.log('No data in localStorage, starting fresh');
      setDeals([]);
    }
  }, []);

  // Save to localStorage whenever deals change
  useEffect(() => {
    // Only save if deals array has been initialized (not the initial empty state)
    if (deals.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
      console.log('Auto-saved deals to localStorage:', deals.length, 'deals');
    }
  }, [deals]);

  const inputClass = `w-full px-4 py-2 rounded-lg border ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
    } focus:outline-none focus:ring-2 focus:ring-orange-500`;

  const handleAdd = () => {
    setEditingId(null);
    const newDeal = {
      id: Date.now().toString(),
      name: '',
      displayName: '',
      description: '',
      price: 0,
      category: '',
      subCategory: '',
      mainBranch: '',
      status: 'Active' as const,
      showInPOSOnly: false,
      orderTypes: [] as string[],
      isTimeSpecific: false,
      showOnMobile: false,
      showOnWeb: false,
      products: [] as ProductSelection[],
      selectionSections: [] as SelectionSection[],
    };
    setCurrentDeal(newDeal);
    setIsModalOpen(true);
    console.log('Opening modal for new deal with ID:', newDeal.id);
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
    // Validate required fields
    if (!currentDeal.name.trim()) {
      alert('Please enter a deal name');
      return;
    }
    if (!currentDeal.displayName.trim()) {
      alert('Please enter a display name');
      return;
    }
    if (currentDeal.price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Ensure the deal has a proper ID
    const dealToSave = {
      ...currentDeal,
      id: currentDeal.id || Date.now().toString(),
    };

    let updatedDeals;
    if (editingId) {
      updatedDeals = deals.map(d => d.id === editingId ? dealToSave : d);
      console.log('Updating existing deal:', dealToSave);
    } else {
      updatedDeals = [...deals, dealToSave];
      console.log('Adding new deal:', dealToSave);
    }

    // Update state first
    setDeals(updatedDeals);
    console.log('Updated deals array:', updatedDeals);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
      console.log('Successfully saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    // Close modal and reset form
    setIsModalOpen(false);
    setCurrentDeal({
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
    });
    setEditingId(null);

    // Force a small delay to ensure state update
    setTimeout(() => {
      console.log('Current deals count:', updatedDeals.length);
    }, 100);
  };

  const columns = useMemo<ColumnDef<Deal>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Deal Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-orange-500/10">
            {row.original.image ? (
              <img 
                src={row.original.image} 
                alt={row.original.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Tag className="w-5 h-5 text-orange-500" />
            )}
          </div>
          <div>
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{row.original.name}</div>
            <div className="text-xs text-slate-500 line-clamp-1">{row.original.displayName}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <span className="font-bold text-orange-500">₹{(row.original.price ?? 0).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.original.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit(row.original)} className="p-1.5 hover:bg-orange-500/10 rounded transition-colors">
            <Edit3 className="w-4 h-4 text-orange-500" />
          </button>
          <button onClick={() => handleDelete(row.original.id)} className="p-1.5 hover:bg-red-500/10 rounded transition-colors">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ),
    },
  ], [isDarkMode, handleEdit, handleDelete]);

  const filteredDeals = useMemo(() => deals.filter(deal =>
    deal.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [deals, searchTerm]);

  const { table, isLoading: isTableLoading } = useInfiniteTable<Deal>({
    columns,
    data: filteredDeals,
    pageSize: 10,
  });

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

      {/* Deals Table */}
      <div className={`rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} overflow-hidden shadow-sm`}>
        <InfiniteTable
          table={table}
          isLoading={isTableLoading}
          isDarkMode={isDarkMode}
          total={filteredDeals.length}
          noDataMessage="No deals found. Create your first deal!"
        />
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Deal" : "New Deal"}
        size="xl"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Name</label>
              <input type="text" value={currentDeal.name} onChange={e => setCurrentDeal({ ...currentDeal, name: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Display Name</label>
              <input type="text" value={currentDeal.displayName} onChange={e => setCurrentDeal({ ...currentDeal, displayName: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Description</label>
              <input type="text" value={currentDeal.description} onChange={e => setCurrentDeal({ ...currentDeal, description: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Price</label>
              <input type="number" value={currentDeal.price} onChange={e => setCurrentDeal({ ...currentDeal, price: Number(e.target.value) })} className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Category</label>
              <input type="text" value={currentDeal.category} onChange={e => setCurrentDeal({ ...currentDeal, category: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sub Category</label>
              <input type="text" value={currentDeal.subCategory} onChange={e => setCurrentDeal({ ...currentDeal, subCategory: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Main Branch</label>
              <input type="text" value={currentDeal.mainBranch} onChange={e => setCurrentDeal({ ...currentDeal, mainBranch: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</label>
              <select value={currentDeal.status} onChange={e => setCurrentDeal({ ...currentDeal, status: e.target.value as any })} className={inputClass}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Show In POS Only</label>
              <select value={currentDeal.showInPOSOnly ? 'Yes' : 'No'} onChange={e => setCurrentDeal({ ...currentDeal, showInPOSOnly: e.target.value === 'Yes' })} className={inputClass}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className={`block text-xs font-black uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select Order Types</label>
              <input type="text" placeholder="e.g. Dine In, Take Away" value={currentDeal.orderTypes.join(', ')} onChange={e => setCurrentDeal({ ...currentDeal, orderTypes: e.target.value.split(',').map(s => s.trim()) })} className={inputClass} />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={currentDeal.isTimeSpecific} onChange={e => setCurrentDeal({ ...currentDeal, isTimeSpecific: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Is Time Specific</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={currentDeal.showOnMobile} onChange={e => setCurrentDeal({ ...currentDeal, showOnMobile: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show on Mobile App</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={currentDeal.showOnWeb} onChange={e => setCurrentDeal({ ...currentDeal, showOnWeb: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show on Web App</span>
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor="dealImage" className="cursor-pointer">
                <input 
                  id="dealImage"
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setCurrentDeal({ ...currentDeal, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" 
                />
              </label>
              {currentDeal.image && (
                <div className="flex items-center gap-2">
                  <img src={currentDeal.image} alt="Deal preview" className="w-8 h-8 rounded object-cover" />
                  <span className="text-xs text-green-600">✓ Image selected</span>
                </div>
              )}
            </div>
          </div>

          <hr className={isDarkMode ? 'border-slate-700' : 'border-slate-200'} />

          {/* Products Section */}
          <div className="space-y-4">
            <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Products <PlusCircle size={14} className="cursor-pointer text-orange-500" onClick={() => setCurrentDeal({ ...currentDeal, products: [...currentDeal.products, { productId: '', name: '', priceContribution: 0, allowAddOns: false, sequence: currentDeal.products.length + 1 }] })} />
            </h3>
            <div className="space-y-3">
              {currentDeal.products.map((p, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-end group animate-in slide-in-from-left-2 duration-300">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold mb-1 opacity-60">Sequence</label>
                    <input type="text" readOnly value={p.sequence} className={`${inputClass} !py-1 !px-2 bg-slate-100/50 dark:bg-slate-800/50`} />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-[10px] font-bold mb-1 opacity-60">Select Product</label>
                    <div className="relative">
                      <input type="text" value={p.name} onChange={e => {
                        const newProducts = [...currentDeal.products];
                        newProducts[idx].name = e.target.value;
                        setCurrentDeal({ ...currentDeal, products: newProducts });
                      }} className={inputClass} placeholder="Search product..." />
                      <XMarkIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold mb-1 opacity-60">Price Contribution</label>
                    <input type="number" value={p.priceContribution} onChange={e => {
                      const newProducts = [...currentDeal.products];
                      newProducts[idx].priceContribution = Number(e.target.value);
                      setCurrentDeal({ ...currentDeal, products: newProducts });
                    }} className={inputClass} />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold mb-1 opacity-60">Allow AddOns</label>
                    <select value={p.allowAddOns ? 'Yes' : 'No'} onChange={e => {
                      const newProducts = [...currentDeal.products];
                      newProducts[idx].allowAddOns = e.target.value === 'Yes';
                      setCurrentDeal({ ...currentDeal, products: newProducts });
                    }} className={inputClass}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="col-span-1 pb-1 text-center">
                    <Trash2 size={16} className="text-red-400 hover:text-red-600 cursor-pointer transition-colors" onClick={() => setCurrentDeal({ ...currentDeal, products: currentDeal.products.filter((_, i) => i !== idx) })} />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setCurrentDeal({ ...currentDeal, products: [...currentDeal.products, { productId: '', name: '', priceContribution: 0, allowAddOns: false, sequence: currentDeal.products.length + 1 }] })}
                className="p-1.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <hr className={isDarkMode ? 'border-slate-700' : 'border-slate-200'} />

          {/* Selection Sections */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`px-6 py-2 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Back
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};
