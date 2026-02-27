'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Package, Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  Download,
  AlertCircle,
  PackageCheck,
  PackageX,
  Boxes,
  Upload,
  RefreshCw
} from 'lucide-react';
import { notify } from '../../../../utils/toast';
import { useTheme } from '../../../../contexts/ThemeContext';
import { InventoryProduct, INITIAL_INVENTORY_PRODUCTS } from '../../pos/mockData';
import { InventoryProductTable } from './table/inventoryproducts.Table';
import { InventoryProductForm } from './form/inventoryproducts.Form';
import { GridView } from '../../../../components/GridView';
import { ExportButton } from '../../../../components/ExportButton';
import { BulkUpdateModal } from './components/BulkUpdateModal';
import { ImportProductModal } from './components/ImportProductModal';

const STORAGE_KEY = 'crm_inventory_products';

const InventoryProductsView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode: propIsDarkMode }) => {
  const { isDarkMode: contextIsDarkMode } = useTheme();
  const isDarkMode = propIsDarkMode ?? contextIsDarkMode;

  // State Management
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const emptyProduct: InventoryProduct = {
    id: '',
    name: '',
    manufacturerName: '',
    barcode: '',
    category: 'Inventory',
    subCategory: 'Inventory',
    rack: '-',
    supplier: '-',
    costPrice: 0,
    meanPrice: 0,
    retailPrice: 0,
    salePrice: 0,
    grossMargin: 0,
    saleTax: 0,
    discount: 0,
    genericName: '-',
    procurementClass: 'Inventory',
    status: 'Active',
  };

  const [currentProduct, setCurrentProduct] = useState<InventoryProduct>(emptyProduct);

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts(INITIAL_INVENTORY_PRODUCTS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY_PRODUCTS));
      } catch (e) {
        console.warn('Initial storage failed: ', e);
      }
    }
  }, []);

  // Safe Save Helper
  const safeSaveToLocalStorage = (data: InventoryProduct[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setProducts(data);
      return true;
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') {
        notify.error('Storage limit exceeded! Try using smaller images or deleting some products.');
      } else {
        notify.error('Failed to save data to local storage.');
      }
      console.error('Storage Error:', error);
      return false;
    }
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product: InventoryProduct) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p: InventoryProduct) => p.category)));
    return ['All', ...cats];
  }, [products]);

  // Actions
  const handleSave = (product: InventoryProduct) => {
    let updated: InventoryProduct[];
    if (editingId) {
      updated = products.map((p: InventoryProduct) => p.id === editingId ? { ...product, id: editingId } : p);
    } else {
      const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
      updated = [newProduct, ...products];
    }

    if (safeSaveToLocalStorage(updated)) {
      setIsModalOpen(false);
      setEditingId(null);
      setCurrentProduct(emptyProduct);
      notify.success(editingId ? 'Product updated successfully' : 'Product created successfully');
    }
  };

  const handleDelete = (id: string) => {
    const updated = products.filter((p: InventoryProduct) => p.id !== id);
    if (safeSaveToLocalStorage(updated)) {
      notify.success('Product deleted successfully');
    }
  };

  const handleEdit = (product: InventoryProduct) => {
    setCurrentProduct(product);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleBulkUpdate = (updates: { category?: string; status?: string }) => {
    const targetIds = new Set(filteredProducts.map((p: InventoryProduct) => p.id));
    const updated = products.map((p: InventoryProduct) => {
      if (targetIds.has(p.id)) {
        return {
          ...p,
          ...(updates.category && { category: updates.category }),
          ...(updates.status && { status: updates.status as any }),
        };
      }
      return p;
    });
    if (safeSaveToLocalStorage(updated)) {
      notify.success(`Successfully updated ${targetIds.size} products`);
    }
  };

  const handleImport = (data: any[]) => {
    console.log('Importing dummy data...');
    // Real implementation would parse 'data' and append to products
  };

  const exportHeaders = [
    'ID', 'Name', 'Manufacturer', 'Barcode', 'Category', 'Sub Category',
    'Rack', 'Supplier', 'Cost Price', 'Mean Price', 'Retail Price',
    'Sale Price', 'Gross Margin', 'Sale Tax', 'Discount', 'Generic Name',
    'Procurement Class', 'Status'
  ];

  const exportData = filteredProducts.map((p: InventoryProduct) => [
    p.id,
    p.name,
    p.manufacturerName,
    p.barcode,
    p.category,
    p.subCategory,
    p.rack,
    p.supplier,
    p.costPrice,
    p.meanPrice,
    p.retailPrice,
    p.salePrice,
    p.grossMargin,
    p.saleTax,
    p.discount,
    p.genericName,
    p.procurementClass,
    p.status
  ]);

  const primaryButtonClass = "px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20 active:scale-95 whitespace-nowrap flex items-center gap-2";

  return (
    <div className={`p-2 sm:p-3 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 lg:mb-4">
        <h2 className={`text-lg sm:text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Products</h2>
        <div className="flex items-center justify-end gap-3 flex-wrap w-full md:w-auto">
          <ExportButton
            headers={exportHeaders}
            data={exportData}
            fileName="inventory-products"
            isDarkMode={isDarkMode}
            onlyExcel={true}
          />
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className={primaryButtonClass}
          >
            <RefreshCw size={16} /> Bulk Update
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className={primaryButtonClass}
          >
            <Upload size={16} /> Import Product
          </button>
          <button
            onClick={() => {
              setCurrentProduct(emptyProduct);
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className={primaryButtonClass}
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Main Header & Search */}
      <div className={`p-4 rounded-xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 mb-4 ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* <h2 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Products</h2> */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded border text-sm outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-600 placeholder-slate-400'
                }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center p-1 rounded  ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-slate-400'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-slate-400'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="overflow-x-auto custom-scrollbar">
        {filteredProducts.length === 0 ? (
          <div className={`p-20 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center ${isDarkMode ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-slate-50/50'}`}>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Products Found</h3>
            <p className="text-slate-500 max-w-xs">We couldn't find any inventory products matching your current filters.</p>
          </div>
        ) : (
          viewMode === 'list' ? (
            <InventoryProductTable
              products={filteredProducts}
              isDarkMode={isDarkMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <GridView
              items={filteredProducts as any}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isDarkMode={isDarkMode}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              renderCustomCard={(product: InventoryProduct) => (
                <div
                  key={product.id}
                  className={`relative group p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${isDarkMode
                    ? 'bg-slate-900 border-slate-800 hover:border-primary/50'
                    : 'bg-white border-slate-100 shadow-sm hover:border-primary/30'
                    }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Package size={24} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${product.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500'
                      }`}>
                      {product.status}
                    </span>
                  </div>

                  <h4 className={`text-base font-black mb-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {product.name}
                  </h4>
                  <p className={`text-xs font-medium mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {product.manufacturerName}
                  </p>

                  <div className="space-y-2 mb-6 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Barcode:</span>
                      <span className={`font-mono font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{product.barcode}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Retail Price:</span>
                      <span className="font-black text-primary">${product.retailPrice}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Generic:</span>
                      <span className="font-medium">{product.genericName}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className={`px-3 py-2 rounded-xl border text-xs font-black transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-red-400 hover:bg-red-500/10' : 'bg-slate-50 border-slate-100 text-red-500 hover:bg-red-50'
                        }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            />
          )
        )}
      </div>

      {/* Form Modal */}
      <InventoryProductForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={currentProduct}
        isDarkMode={isDarkMode}
        editingId={editingId}
      />

      {/* Bulk Update Modal */}
      <BulkUpdateModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onUpdate={handleBulkUpdate}
        affectedCount={filteredProducts.length}
        categories={categories}
        isDarkMode={isDarkMode}
      />

      {/* Import Modal */}
      <ImportProductModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default InventoryProductsView;


