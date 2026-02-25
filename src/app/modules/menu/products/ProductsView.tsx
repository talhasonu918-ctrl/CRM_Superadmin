import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import { Product } from './types';
import { DeleteConfirmModal } from '../../../../components/DeleteConfirmModal';

interface ProductsViewProps {
  isDarkMode: boolean;
}

const INITIAL_PRODUCT: Product = {
  id: '',
  name: '',
  barCode: '',
  genericName: '',
  pctCode: '',
  racks: '',
  category: '',
  subCategory: '',
  price: 0,
  stock: 0,
  rating: 0,
  available: true,
  image: '',
  description: '',
  manufacturer: '',
  supplier: '',
  productType: '',
  assignedBranches: '',
  showOnPos: true,
  isAutoReady: false,
  summary: '',
  detailDescription: '',
  showInMobileApp: true,
  showInWebApp: true,
  mobileImage: '',
  webImage: '',
  variants: [],
  addOns: []
};

export const ProductsView: React.FC<ProductsViewProps> = ({ isDarkMode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product>(INITIAL_PRODUCT);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  // Load products from localStorage or use defaults
  useEffect(() => {
    const savedProducts = localStorage.getItem('crm_menu_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts: Product[] = [
        {
          id: '1',
          name: 'Classic Margherita Pizza',
          barCode: 'PIZZA-001',
          genericName: 'Italian Pizza',
          pctCode: '1234',
          racks: 'A1',
          category: 'Pizza',
          subCategory: 'Thin Crust',
          price: 12.99,
          stock: 50,
          rating: 4.8,
          available: true,
          image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1974&auto=format&fit=crop',
          description: 'Fresh mozzarella, tomato sauce, and basil',
          manufacturer: 'Homemade',
          supplier: 'Fresh Produce Co',
          productType: 'Menu',
          assignedBranches: 'All Branches',
          showOnPos: true,
          isAutoReady: true,
          summary: 'Delicious thin crust pizza with fresh basil.',
          detailDescription: 'Our signature thin crust topped with premium mozzarella and hand-picked basil leaves.',
          showInMobileApp: true,
          showInWebApp: true,
          mobileImage: '',
          webImage: '',
          variants: [
            { id: 'v1', name: 'PIZZA', display: 'Select Size', instructions: '', options: { small: true, medium: true, large: true } }
          ],
          addOns: [
            { id: 'a1', name: 'Extra Cheese', price: 2.00 },
            { id: 'a2', name: 'Olives', price: 1.50 }
          ]
        },
        {
          id: '2',
          name: 'Double Cheeseburger',
          barCode: 'BURGER-002',
          genericName: 'American Burger',
          pctCode: '5678',
          racks: 'B2',
          category: 'Burgers',
          subCategory: 'Classic',
          price: 9.50,
          stock: 30,
          rating: 4.5,
          available: true,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
          description: 'Two beef patties with melted cheddar',
          manufacturer: 'Premium Meats',
          supplier: 'TALHA FOOD',
          productType: 'Menu',
          assignedBranches: 'Main Branch',
          showOnPos: true,
          isAutoReady: false,
          summary: 'Hearty burger with double patties.',
          detailDescription: 'Juicy double beef patties flame-grilled to perfection.',
          showInMobileApp: true,
          showInWebApp: true,
          mobileImage: '',
          webImage: '',
          variants: [],
          addOns: []
        },
        {
          id: '3',
          name: 'Iced Latte',
          barCode: 'DRINK-003',
          genericName: 'Coffee Beverage',
          pctCode: '9012',
          racks: 'C3',
          category: 'Drinks',
          subCategory: 'Cold Beverages',
          price: 4.50,
          stock: 100,
          rating: 4.2,
          available: false,
          image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop',
          description: 'Espresso with cold milk and ice',
          manufacturer: 'Coffee Roasters',
          supplier: 'MIANS',
          productType: 'Menu',
          assignedBranches: 'All Branches',
          showOnPos: true,
          isAutoReady: true,
          summary: 'Refreshing iced coffee drink.',
          detailDescription: 'Double shot of espresso mixed with creamy milk over ice.',
          showInMobileApp: false,
          showInWebApp: true,
          mobileImage: '',
          webImage: '',
          variants: [],
          addOns: []
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('crm_menu_products', JSON.stringify(defaultProducts));
    }
  }, []);

  const saveToStorage = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('crm_menu_products', JSON.stringify(updatedProducts));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setCurrentProduct(INITIAL_PRODUCT);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.id) {
      const updatedProducts = products.filter(p => p.id !== deleteModal.id);
      saveToStorage(updatedProducts);
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const handleSaveProduct = (product: Product) => {
    if (editingId) {
      const updatedProducts = products.map(p =>
        p.id === editingId ? { ...product, id: editingId } : p
      );
      saveToStorage(updatedProducts);
    } else {
      const newProduct = {
        ...product,
        id: Math.random().toString(36).substr(2, 9)
      };
      saveToStorage([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Menu Products
          </h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage your restaurant's dish catalog and inventory items
          </p>
        </div>
        <div className="flex items-center gap-3 flex-1 md:flex-none justify-end">
          <div className="relative flex-1 md:w-72">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-bg-primary/10 hover:border-bg-primary/10/50'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-bg-primary/10 hover:border-bg-primary/10/50'
                } focus:outline-none focus:ring-2 focus:ring-bg-primary/10/50 shadow-sm`}
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary/10 text-white rounded-lg font-semibold text-sm transition-all shadow-md shadow-bg-primary/10/20 active:scale-95 gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      {/* <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}> */}
        {/* <div className="flex flex-col md:flex-row gap-4"> */}
          {/* <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search products by name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-bg-primary/10 hover:border-bg-primary/10/50'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-bg-primary/10 hover:border-bg-primary/10/50'
                } focus:outline-none focus:ring-2 focus:ring-bg-primary/10/50`}
            />
          </div> */}
          {/* <button className={`inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all gap-2 ${isDarkMode
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-bg-primary/10 hover:text-bg-primary/10'
              : 'bg-white border-slate-200 text-slate-600 hover:border-bg-primary/10 hover:text-bg-primary/10'
            }`}>
            <Filter className="w-4 h-4" />
            Filters
          </button> */}
        {/* </div> */}
      {/* </div> */}

      {/* Main Table Section */}
      <ProductTable
        data={filteredProducts}
        isDarkMode={isDarkMode}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Form Modal */}
      <ProductForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={currentProduct}
        isDarkMode={isDarkMode}
        editingId={editingId}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
