import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Package, AlertTriangle, Plus, Search, Download, BarChart3, TrendingUp, RotateCcw, X, Upload, Image as ImageIcon, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../../components/Modal';
import InfiniteTable from '../../components/InfiniteTable';
import { useReactTable, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';
import { mockInventory, InventoryItem } from './pos/mockData';
import { SearchableDropdown } from '../../components/SearchableDropdown';

const columnHelper = createColumnHelper<InventoryItem>();

// Categories for dropdown
const CATEGORIES = [
  { value: 'Pizza', label: 'Pizza' },
  { value: 'Burger', label: 'Burger' },
  { value: 'Wings', label: 'Wings' },
  { value: 'Fries & Sides', label: 'Fries & Sides' },
  { value: 'Drinks', label: 'Drinks' },
  { value: 'Broast', label: 'Broast' },
  { value: 'Rolls & Wraps', label: 'Rolls & Wraps' },
  { value: 'Deals', label: 'Deals' },
  { value: 'Pasta', label: 'Pasta' },
];

export const InventoryManagementView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Initialize inventory from localStorage or mock data
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('inventory');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return mockInventory;
  });

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    stock: '',
    minStock: '',
    price: '',
    image: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      category: '',
      stock: '',
      minStock: '',
      price: '',
      image: ''
    });
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      stock: item.stock.toString(),
      minStock: item.minStock.toString(),
      price: item.price.toString(),
      image: item.image || ''
    });
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedItem) {
      setInventory(prev => prev.filter(item => item.id !== selectedItem.id));
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price) return;

    const stockVal = parseInt(formData.stock) || 0;
    const minStockVal = parseInt(formData.minStock) || 0;
    const status = stockVal > minStockVal ? 'In Stock' : stockVal === 0 ? 'Out of Stock' : 'Low Stock';

    if (formData.id) {
      // Edit existing
      setInventory(prev => prev.map(item =>
        item.id === formData.id ? {
          ...item,
          name: formData.name,
          category: formData.category,
          stock: stockVal,
          minStock: minStockVal,
          price: parseFloat(formData.price) || 0,
          image: formData.image,
          status: status
        } : item
      ));
    } else {
      // Add new
      const newItem: InventoryItem = {
        id: `INV-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        stock: stockVal,
        minStock: minStockVal,
        price: parseFloat(formData.price) || 0,
        sales: 0,
        image: formData.image,
        status: status
      };
      setInventory(prev => [newItem, ...prev]);
    }

    setIsModalOpen(false);
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter((item: InventoryItem) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, inventory]);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      id: 'product',
      header: 'Product',
      cell: (info) => {
        const item = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <Package size={20} className="text-slate-400" />
              )}
            </div>
            <span className="font-medium text-sm">{info.getValue()}</span>
          </div>
        );
      },
      size: 250,
    }),
    columnHelper.accessor('category', {
      id: 'category',
      header: 'Category',
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      size: 150,
    }),
    columnHelper.accessor('stock', {
      id: 'stock',
      header: 'Stock',
      cell: (info) => <span className="text-sm font-medium">{info.getValue()}</span>,
      size: 80,
    }),
    columnHelper.accessor('minStock', {
      id: 'minStock',
      header: 'Min. Stock',
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      size: 100,
    }),
    columnHelper.accessor('price', {
      id: 'price',
      header: 'Price',
      cell: (info) => <span className="text-sm">Rs. {info.getValue()}</span>,
      size: 100,
    }),
    columnHelper.accessor('sales', {
      id: 'sales',
      header: 'Sales',
      cell: (info) => <span className="text-sm">Rs. {info.getValue().toLocaleString()}</span>,
      size: 100,
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as 'In Stock' | 'Low Stock' | 'Out of Stock';
        const statusStyles: Record<'In Stock' | 'Low Stock' | 'Out of Stock', string> = {
          'In Stock': 'bg-emerald-500/10 text-emerald-500',
          'Low Stock': 'bg-orange-500/10 text-orange-500',
          'Out of Stock': 'bg-rose-500/10 text-rose-500'
        };
        return (
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${statusStyles[status]}`}>
            {status}
          </span>
        );
      },
      size: 120,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const [isOpen, setIsOpen] = useState(false);
        const dropdownRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setIsOpen(false);
            }
          };
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        return (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
              className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isOpen ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
            >
              <MoreVertical size={16} className="text-slate-400" />
            </button>

            {isOpen && (
              <div className={`absolute right-0 mt-2 w-32 rounded-lg shadow-xl border z-50 overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                }`}>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); handleView(info.row.original); }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors`}
                >
                  <Eye size={14} className="text-slate-400" /> View
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); handleEdit(info.row.original); }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors`}
                >
                  <Edit size={14} className="text-slate-400" /> Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); confirmDelete(info.row.original); }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-rose-50 text-rose-500 dark:hover:bg-rose-900/20 transition-colors`}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        );
      },
      size: 80,
    }),
  ], [isDarkMode, inventory]);

  const table = useReactTable({
    data: filteredInventory,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const stats = useMemo(() => {
    const total = inventory.length;
    const active = inventory.filter((item: InventoryItem) => item.status === 'In Stock').length;
    const outOfStock = inventory.filter((item: InventoryItem) => item.status === 'Out of Stock').length;
    const returned = inventory.filter((item: InventoryItem) => item.status === 'Low Stock').length;
    return { total, active, outOfStock, returned };
  }, [inventory]);

  const cardStyle = `rounded-xl border shadow-sm transition-all ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-slate-400 text-sm mt-1">Monitor, manage, and update all your product stock in one place</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${cardStyle} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-xs font-semibold">Total Product</div>
            <BarChart3 size={20} className="text-orange-500" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.total} Items</div>
          <div className="text-xs text-slate-400">Updated in last month</div>
        </div>

        <div className={`${cardStyle} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-xs font-semibold">Active Product</div>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.active} Items</div>
          <div className="text-xs text-slate-400">Available in stock</div>
        </div>

        <div className={`${cardStyle} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-xs font-semibold">Out of Stock</div>
            <AlertTriangle size={20} className="text-rose-500" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.outOfStock} Items</div>
          <div className="text-xs text-slate-400">Need to restock</div>
        </div>

        <div className={`${cardStyle} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-xs font-semibold">Low Stock Products</div>
            <RotateCcw size={20} className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.returned} Items</div>
          <div className="text-xs text-slate-400">Compared to last month</div>
        </div>
      </div>

      {/* Table Section */}
      <div className={cardStyle}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-lg font-bold">Product List</div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all min-w-[240px] ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500'
                    }`}
                />
              </div>
              <button className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <Download size={16} /> Export
              </button>
              <button
                onClick={openAddModal}
                className="bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>
        </div>

        <InfiniteTable
          table={table}
          isDarkMode={isDarkMode}
          noDataMessage="No products found. Add your first product to get started."
        />
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? "Edit Product" : "Add New Product"}
        isDarkMode={isDarkMode}
      >
        <div className="space-y-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold">{formData.id ? "Edit Product" : "Add New Product"}</h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Image Upload */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer w-32 h-32">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`w-full h-full rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer overflow-hidden ${formData.image ? 'border-transparent' :
                    isDarkMode ? 'border-slate-700 hover:border-slate-600 bg-slate-800' : 'border-slate-200 hover:border-orange-500 bg-slate-50'
                  }`}
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="text-white" size={24} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`p-3 rounded-full mb-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <ImageIcon size={24} className="text-slate-400" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Upload Image</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Chicken Tikka Pizza"
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500'
                }`}
            />
          </div>

          <div>
            <SearchableDropdown
              label="Category"
              options={CATEGORIES}
              value={formData.category}
              onChange={handleCategoryChange}
              placeholder="Select category"
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Current Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500'
                  }`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Min. Stock</label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleInputChange}
                placeholder="0"
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500'
                  }`}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500'
                }`}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
            >
              {formData.id ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Product Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Product Details"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold">Product Details</h3>
            <button
              onClick={() => setIsViewModalOpen(false)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {selectedItem && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className={`w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden border-2 ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  {selectedItem.image ? (
                    <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} className="text-slate-400" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Product Name</div>
                  <div className="font-medium">{selectedItem.name}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</div>
                  <div className="font-medium">{selectedItem.category}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price</div>
                  <div className="font-medium">Rs. {selectedItem.price}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</div>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${selectedItem.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' :
                      selectedItem.status === 'Low Stock' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-rose-500/10 text-rose-500'
                    }`}>
                    {selectedItem.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Stock</div>
                  <div className="font-medium">{selectedItem.stock}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Min. Stock</div>
                  <div className="font-medium">{selectedItem.minStock}</div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                }`}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-rose-500 flex items-center gap-2">
              <Trash2 size={24} /> Delete Product
            </h3>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">"{selectedItem?.name}"</span>?
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-lg font-medium text-sm shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
