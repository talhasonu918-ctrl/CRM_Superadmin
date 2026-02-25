'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Package, AlertTriangle, BarChart3, TrendingUp, RotateCcw, X, Upload, Image as ImageIcon, Trash2, Trophy, MoreVertical, Eye, Edit, Info } from 'lucide-react';
import { Modal } from '@/src/components/Modal';
import { mockInventory, InventoryItem } from '@/src/app/modules/pos/mockData';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { InventoryForm as InventoryFilterForm } from './form/InventoryForm';
import { InventoryTable } from './table/InventoryTable';

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
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-03-31');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');

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

  // Ensure items have dates and sales data for filtering (Auto-migration)
  useEffect(() => {
    const needsMigration = inventory.some(item => 
      !item.lastUpdated || 
      item.sales === undefined || 
      item.salesCount === undefined
    );

    if (inventory.length > 0 && needsMigration) {
      const updatedInventory = inventory.map(item => {
        const updated = { ...item };
        if (!item.lastUpdated) {
          const months = ['01', '02', '03'];
          const randomMonth = months[Math.floor(Math.random() * months.length)];
          const randomDay = Math.floor(Math.random() * 25) + 1;
          const formattedDay = randomDay < 10 ? `0${randomDay}` : randomDay;
          updated.lastUpdated = `2026-${randomMonth}-${formattedDay}`;
        }
        if (item.sales === undefined || item.sales === 0) {
          updated.sales = Math.floor(Math.random() * 5000) + 1000;
        }
        if (item.salesCount === undefined || item.salesCount === 0) {
          // Generate a varied sales count based on price or randomly
          updated.salesCount = item.price > 0 
            ? Math.max(1, Math.floor(updated.sales / (item.price * 0.8 / 10))) 
            : Math.floor(Math.random() * 50) + 10;
        }
        return updated;
      });
      setInventory(updatedInventory);
    }
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
    return inventory.filter((item: InventoryItem) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const itemDate = item.lastUpdated; // YYYY-MM-DD
      const start = startDate; // YYYY-MM-DD
      const end = endDate; // YYYY-MM-DD

      let matchesDate = true;
      if (start || end) {
        if (!itemDate) {
          matchesDate = false; 
        } else {
          // Reliable alphabetical string comparison for YYYY-MM-DD
          if (start && end) {
            matchesDate = itemDate >= start && itemDate <= end;
          } else if (start) {
            matchesDate = itemDate >= start;
          } else if (end) {
            matchesDate = itemDate <= end;
          }
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [search, inventory, startDate, endDate]);

  const stats = useMemo(() => {
    const total = filteredInventory.length;
    const active = filteredInventory.filter((item: InventoryItem) => item.status === 'In Stock').length;
    const outOfStock = filteredInventory.filter((item: InventoryItem) => item.status === 'Out of Stock').length;
    const returned = filteredInventory.filter((item: InventoryItem) => item.status === 'Low Stock').length;
    
    // Find top selling product from filtered list using weighted score (salesCount and sales)
    const topProduct = filteredInventory.length > 0 
      ? [...filteredInventory].sort((a, b) => {
          const scoreA = (a.salesCount || 0) * 1000 + (a.sales || 0);
          const scoreB = (b.salesCount || 0) * 1000 + (b.sales || 0);
          return scoreB - scoreA;
        })[0]
      : null;
    
    return { total, active, outOfStock, returned, topProduct };
  }, [filteredInventory]);

  const cardStyle = `rounded-xl border shadow-sm transition-all ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-100'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">Monitor, manage, and update all your product stock in one place</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <div className={`${cardStyle} p-4 sm:p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Total Product</div>
            <BarChart3 size={20} className="text-orange-500" />
          </div>
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.total} Items</div>
          <div className="text-xs text-slate-400 font-medium">Updated in last month</div>
        </div>

        <div className={`${cardStyle} p-4 sm:p-6 border-l-4 border-l-green-500`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Active Product</div>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.active} Items</div>
          <div className="text-xs text-slate-400 font-medium italic">Available in stock</div>
        </div>

        <div className={`${cardStyle} p-4 sm:p-6 border-l-4 border-l-rose-500`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Out of Stock</div>
            <AlertTriangle size={20} className="text-rose-500" />
          </div>
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.outOfStock} Items</div>
          <div className="text-xs text-slate-400 font-medium italic text-rose-400/80">Need to restock</div>
        </div>

        <div className={`${cardStyle} p-4 sm:p-6 border-l-4 border-l-blue-500`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Low Stock</div>
            <RotateCcw size={20} className="text-blue-500" />
          </div>
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.returned} Items</div>
          <div className="text-xs text-slate-400 font-medium italic">Compared to last month</div>
        </div>

        <div className={`${cardStyle} p-4 sm:p-6 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-500/5 to-transparent sm:col-span-2 lg:col-span-2 xl:col-span-1`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider line-clamp-1">Top Selling</div>
            <Trophy size={20} className="text-amber-500 animate-pulse" />
          </div>
          <div className={`text-base sm:text-lg font-bold mb-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {stats.topProduct?.name || 'N/A'}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-amber-500 flex items-center gap-1">
            <span>{stats.topProduct?.salesCount || 0} Sales</span>
            <span className="text-slate-400 font-normal">this month</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className={cardStyle}>
        <InventoryFilterForm
          isDarkMode={isDarkMode}
          search={search}
          onSearchChange={setSearch}
          onAddClick={openAddModal}
          filteredData={filteredInventory}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          viewType={viewType}
          onViewTypeChange={setViewType}
        />

        {viewType === 'list' ? (
          <InventoryTable
            isDarkMode={isDarkMode}
            data={filteredInventory}
            total={filteredInventory.length}
            itemName="inventory records"
            onView={handleView}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {filteredInventory.map((item) => (
              <div 
                key={item.id}
                className={`group relative rounded-xl border p-4 transition-all duration-300 hover:shadow-lg ${
                  isDarkMode ? 'bg-[#1C1F26] border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-primary/30'
                }`}
              >
                {/* Actions Menu */}
                <div className="absolute top-3 right-0.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleView(item)}
                    className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-600'}`}
                  >
                    <Info size={16} />
                  </button>
                  <button 
                    onClick={() => handleEdit(item)}
                    className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-600'}`}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => confirmDelete(item)}
                    className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white' : 'bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={32} className="text-slate-400" />
                    )}
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</h3>
                  <span className="text-xs text-slate-400 mb-3">{item.category}</span>
                  
                  <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-left">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Stock</div>
                      <div className={`text-sm font-bold ${item.stock <= item.minStock ? 'text-rose-500' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {item.stock} Units
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Price</div>
                      <div className="text-sm font-bold text-primary">Rs. {item.price}</div>
                    </div>
                  </div>

                  <div className="mt-4 w-full">
                    <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border text-center ${
                      item.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      item.status === 'Low Stock' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
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
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 text-slate-900'
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
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 text-slate-900'
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
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 text-slate-900'
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
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 text-slate-900'
                }`}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium text-sm shadow-lg shadow-orange-500/20 hover:bg-primary/10 transition-all"
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
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {selectedItem && (
            <div className="space-y-6 text-slate-900 dark:text-white">
              <div className="flex justify-center">
                <div className={`w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden border-2 ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  {selectedItem.image ? (
                    <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} className="text-slate-400" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-6">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Product Name</div>
                  <div className="font-medium text-sm sm:text-base">{selectedItem.name}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</div>
                  <div className="font-medium text-sm sm:text-base">{selectedItem.category}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Price</div>
                  <div className="font-medium text-sm sm:text-base">Rs. {selectedItem.price}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</div>
                  <div className={`inline-block px-2 py-1 rounded text-[10px] sm:text-xs font-bold ${selectedItem.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' :
                      selectedItem.status === 'Low Stock' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-rose-500/10 text-rose-500'
                    }`}>
                    {selectedItem.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Stock</div>
                  <div className="font-medium text-sm sm:text-base">{selectedItem.stock}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Min. Stock</div>
                  <div className="font-medium text-sm sm:text-base">{selectedItem.minStock}</div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
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
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
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
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
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

export default InventoryManagementView;
