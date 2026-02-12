import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Upload } from 'lucide-react';
import { ReusableModal } from '../../../components/ReusableModal';
import { createColumnHelper } from '@tanstack/react-table';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import InfiniteTable from '../../../components/InfiniteTable';

interface MenuProductsViewProps {
  isDarkMode: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  display: string;
  instructions: string;
  options: {
    small: boolean;
    medium: boolean;
    large: boolean;
  };
}

interface ProductAddOn {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  barCode: string;
  genericName: string;
  description: string;
  showOnPos: boolean;
  pctCode: string;
  category: string;
  subCategory: string;
  racks: string;
  supplier: string;
  manufacturer: string;
  productType: string;
  assignedBranches: string;
  isAutoReady: boolean;
  price: number;
  image: string;
  available: boolean;
  rating: number;
  stock: number;
  // Mobile/Web Configuration
  summary: string;
  detailDescription: string;
  showInMobileApp: boolean;
  showInWebApp: boolean;
  mobileImage: string;
  webImage: string;
  // Product Variants
  variants: ProductVariant[];
  // Product Add-Ons
  addOns: ProductAddOn[];
}

const STORAGE_KEY = 'menu_products';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'BBQ Beef Brisket Pizza',
    barCode: 'BBQ001',
    genericName: 'Beef Pizza',
    description: 'Delicious BBQ beef brisket with cheese',
    showOnPos: true,
    pctCode: 'PCT001',
    category: 'Pizza',
    subCategory: 'Beef Pizza',
    racks: 'Rack A1',
    supplier: 'MIANS',
    manufacturer: 'TALHA FOOD',
    productType: 'Menu',
    assignedBranches: 'Main Branch',
    isAutoReady: false,
    price: 24.5,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop',
    available: true,
    rating: 4.9,
    stock: 45,
    summary: 'Best BBQ Pizza in town',
    detailDescription: 'Loaded with tender BBQ beef brisket and premium cheese',
    showInMobileApp: true,
    showInWebApp: true,
    mobileImage: '',
    webImage: '',
    variants: [
      {
        id: 'v1',
        name: 'PIZZA',
        display: 'Select Size',
        instructions: '',
        options: { small: true, medium: true, large: true }
      }
    ],
    addOns: []
  },
  {
    id: '2',
    name: 'Zesty Jalapeno Burger',
    barCode: 'BRG001',
    genericName: 'Jalapeno Burger',
    description: 'Spicy burger with jalapenos',
    showOnPos: true,
    pctCode: 'PCT002',
    category: 'Burgers',
    subCategory: 'Spicy Burgers',
    racks: 'Rack B2',
    supplier: 'KHADAM',
    manufacturer: 'KHADAM',
    productType: 'Menu',
    assignedBranches: 'All Branches',
    isAutoReady: true,
    price: 16.0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop',
    available: true,
    rating: 4.8,
    stock: 20,
    summary: 'Spicy and delicious',
    detailDescription: 'Perfect blend of spices with fresh jalapenos',
    showInMobileApp: true,
    showInWebApp: false,
    mobileImage: '',
    webImage: '',
    variants: [],
    addOns: []
  },
];

export const MenuProductsView: React.FC<MenuProductsViewProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: '',
    name: '',
    barCode: '',
    genericName: '',
    description: '',
    showOnPos: true,
    pctCode: '',
    category: '',
    subCategory: '',
    racks: '',
    supplier: '',
    manufacturer: '',
    productType: 'Menu',
    assignedBranches: '',
    isAutoReady: false,
    price: 0,
    image: '',
    available: true,
    rating: 0,
    stock: 0,
    summary: '',
    detailDescription: '',
    showInMobileApp: true,
    showInWebApp: true,
    mobileImage: '',
    webImage: '',
    variants: [],
    addOns: [],
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedProducts = JSON.parse(stored);
        // Add default values for new fields to ensure backwards compatibility
        const productsWithDefaults = parsedProducts.map((product: any) => ({
          ...product,
          summary: product.summary || '',
          detailDescription: product.detailDescription || '',
          showInMobileApp: product.showInMobileApp ?? true,
          showInWebApp: product.showInWebApp ?? true,
          mobileImage: product.mobileImage || '',
          webImage: product.webImage || '',
          variants: product.variants || [],
          addOns: product.addOns || [],
        }));
        setProducts(productsWithDefaults);
      } catch (e) {
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  const columnHelper = createColumnHelper<Product>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Product Name',
        cell: (info) => (
          <div className="flex items-center gap-3">
            {info.row.original.image && (
              <img
                src={info.row.original.image}
                alt={info.getValue()}
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            <div>
              <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {info.getValue()}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {info.row.original.barCode}
              </div>
            </div>
          </div>
        ),
        size: 250,
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <div>
            <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {info.getValue()}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {info.row.original.subCategory}
            </div>
          </div>
        ),
        size: 150,
      }),
      columnHelper.accessor('supplier', {
        header: 'Supplier',
        cell: (info) => (
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {info.getValue()}
          </span>
        ),
        size: 120,
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => (
          <span className={`font-semibold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            ${info.getValue().toFixed(2)}
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor('stock', {
        header: 'Stock',
        cell: (info) => (
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {info.getValue()} units
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor('available', {
        header: 'Status',
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              info.getValue()
                ? 'bg-green-500/10 text-green-500'
                : 'bg-red-500/10 text-red-500'
            }`}
          >
            {info.getValue() ? 'Available' : 'Out of Stock'}
          </span>
        ),
        size: 120,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(info.row.original)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-slate-700 text-slate-300'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
        size: 100,
      }),
    ],
    [isDarkMode]
  );

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const table = useReactTable({
    data: filteredProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm ${
    isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-orange-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500'
  } focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all`;

  const handleAdd = () => {
    setEditingId(null);
    setCurrentProduct({
      id: Date.now().toString(),
      name: '',
      barCode: '',
      genericName: '',
      description: '',
      showOnPos: true,
      pctCode: '',
      category: '',
      subCategory: '',
      racks: '',
      supplier: '',
      manufacturer: '',
      productType: 'Menu',
      assignedBranches: '',
      isAutoReady: false,
      price: 0,
      image: '',
      available: true,
      rating: 0,
      stock: 0,
      summary: '',
      detailDescription: '',
      showInMobileApp: true,
      showInWebApp: true,
      mobileImage: '',
      webImage: '',
      variants: [],
      addOns: [],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setCurrentProduct({
      ...product,
      // Ensure new fields have default values for backwards compatibility
      summary: product.summary || '',
      detailDescription: product.detailDescription || '',
      showInMobileApp: product.showInMobileApp ?? true,
      showInWebApp: product.showInWebApp ?? true,
      mobileImage: product.mobileImage || '',
      webImage: product.webImage || '',
      variants: product.variants || [],
      addOns: product.addOns || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!currentProduct.name.trim()) {
      alert('Product name is required');
      return;
    }
    
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? currentProduct : p));
    } else {
      setProducts([...products, currentProduct]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Menu Products
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage all menu items and their details
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2.5 rounded-lg border text-sm ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              } w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 text-sm rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`rounded-xl border shadow-sm overflow-hidden ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <InfiniteTable
          table={table}
          isDarkMode={isDarkMode}
          total={filteredProducts.length}
          noDataMessage="No products found. Click 'Add Product' to create your first product."
        />
      </div>

      {/* Modal */}
      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Product" : "Add New Product"}
        size="xl"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-6">
          {/* Product Basic Information Section */}
          <div className="space-y-4">
            <div className={`pb-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Product Basic Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., BBQ Beef Brisket Pizza"
                />
              </div>
              
              {/* <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Bar Code
                </label>
                <input
                  type="text"
                  value={currentProduct.barCode}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, barCode: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., BBQ001"
                />
              </div> */}

              {/* <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Generic Name
                </label>
                <input
                  type="text"
                  value={currentProduct.genericName}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, genericName: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., Beef Pizza"
                />
              </div> */}

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description
                </label>
                <input
                  type="text"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  className={inputClass}
                  placeholder="Enter product description"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  PCT Code
                </label>
                <input
                  type="text"
                  value={currentProduct.pctCode}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, pctCode: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., PCT001"
                />
              </div> */}

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Category
                </label>
                <select
                  value={currentProduct.category}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select Category</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Sides">Sides</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Sub Category
                </label>
                <input
                  type="text"
                  value={currentProduct.subCategory}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, subCategory: e.target.value })}
                  className={inputClass}
                  placeholder="Enter sub category"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Racks
                </label>
                <input
                  type="text"
                  value={currentProduct.racks}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, racks: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., Rack A1"
                />
              </div> */}

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Supplier
                </label>
                <select
                  value={currentProduct.supplier}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, supplier: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select Supplier</option>
                  <option value="MIANS">MIANS</option>
                  <option value="TALHA FOOD">TALHA FOOD</option>
                  <option value="KHADAM">KHADAM</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={currentProduct.manufacturer}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, manufacturer: e.target.value })}
                  className={inputClass}
                  placeholder="Enter manufacturer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Product Type
                </label>
                <select
                  value={currentProduct.productType}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, productType: e.target.value })}
                  className={inputClass}
                >
                  <option value="Menu">Menu</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Raw Material">Raw Material</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Assigned Branches
                </label>
                <input
                  type="text"
                  value={currentProduct.assignedBranches}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, assignedBranches: e.target.value })}
                  className={inputClass}
                  placeholder="Enter branch assignments"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentProduct.showOnPos}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, showOnPos: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 focus:ring-2"
                />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Show on POS
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentProduct.isAutoReady}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, isAutoReady: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 focus:ring-2"
                />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Is Auto Ready
                </span>
              </label>
            </div>
          </div>

          {/* Pricing & Stock Section */}
          <div className="space-y-4">
            <div className={`pb-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Pricing & Stock
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) || 0 })}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Stock
                </label>
                <input
                  type="number"
                  value={currentProduct.stock}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) || 0 })}
                  className={inputClass}
                  placeholder="0"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={currentProduct.rating}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, rating: parseFloat(e.target.value) || 0 })}
                  className={inputClass}
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Status
                </label>
                <select
                  value={currentProduct.available ? 'true' : 'false'}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, available: e.target.value === 'true' })}
                  className={inputClass}
                >
                  <option value="true">Available</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className={`pb-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Product Image
              </h3>
            </div>

            <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDarkMode
                ? 'border-slate-700 hover:border-orange-500 bg-slate-800/50'
                : 'border-slate-300 hover:border-orange-500 bg-slate-50'
            }`}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCurrentProduct({ ...currentProduct, image: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="product-image-upload"
              />
              <label htmlFor="product-image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                {currentProduct.image ? (
                  <div className="relative">
                    <img
                      src={currentProduct.image}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentProduct({ ...currentProduct, image: '' });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                      }`}>
                        <Upload className={`w-8 h-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      </div>
                    </div>
                    <div>
                      <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Click to upload product image
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Mobile / Web Configuration Section */}
          <div className="space-y-4">
            <div className={`pb-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Mobile / Web Configuration
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Summary
                </label>
                <input
                  type="text"
                  value={currentProduct.summary}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, summary: e.target.value })}
                  className={inputClass}
                  placeholder="Brief product summary"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Detail Description
                </label>
                <textarea
                  value={currentProduct.detailDescription}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, detailDescription: e.target.value })}
                  className={inputClass}
                  placeholder="Detailed product description"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProduct.showInMobileApp}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, showInMobileApp: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 focus:ring-2"
                  />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Show in Mobile App
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProduct.showInWebApp}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, showInWebApp: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 focus:ring-2"
                  />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Show in Web App
                  </span>
                </label>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Select Mobile Image
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Select Web Image
                </button>
              </div> */}
            </div>
          </div>

          {/* Product Variants Section */}
          <div className="space-y-4">
            <div className={`pb-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Product Variants
              </h3>
            </div>

            <div className="space-y-3">
              {currentProduct.variants.map((variant, index) => (
                <div key={variant.id} className={`p-4 rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Variant
                        </label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => {
                            const newVariants = [...currentProduct.variants];
                            newVariants[index].name = e.target.value;
                            setCurrentProduct({ ...currentProduct, variants: newVariants });
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isDarkMode
                              ? 'bg-slate-800 border-slate-700 text-white'
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                          placeholder="e.g., PIZZA"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Display
                        </label>
                        <input
                          type="text"
                          value={variant.display}
                          onChange={(e) => {
                            const newVariants = [...currentProduct.variants];
                            newVariants[index].display = e.target.value;
                            setCurrentProduct({ ...currentProduct, variants: newVariants });
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isDarkMode
                              ? 'bg-slate-800 border-slate-700 text-white'
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                          placeholder="e.g., Select Size"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentProduct({
                          ...currentProduct,
                          variants: currentProduct.variants.filter((_, i) => i !== index)
                        });
                      }}
                      className="ml-3 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Instructions
                    </label>
                    <input
                      type="text"
                      value={variant.instructions}
                      onChange={(e) => {
                        const newVariants = [...currentProduct.variants];
                        newVariants[index].instructions = e.target.value;
                        setCurrentProduct({ ...currentProduct, variants: newVariants });
                      }}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                      placeholder="Special instructions"
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Variant Options
                    </label>
                    <div className="flex gap-2">
                      {['SMALL', 'MEDIUM', 'LARGE'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            const newVariants = [...currentProduct.variants];
                            const sizeKey = size.toLowerCase() as 'small' | 'medium' | 'large';
                            newVariants[index].options[sizeKey] = !newVariants[index].options[sizeKey];
                            setCurrentProduct({ ...currentProduct, variants: newVariants });
                          }}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            variant.options[size.toLowerCase() as 'small' | 'medium' | 'large']
                              ? 'bg-orange-500 text-white'
                              : isDarkMode
                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setCurrentProduct({
                    ...currentProduct,
                    variants: [
                      ...currentProduct.variants,
                      {
                        id: `v${Date.now()}`,
                        name: '',
                        display: '',
                        instructions: '',
                        options: { small: false, medium: false, large: false }
                      }
                    ]
                  });
                }}
                className={`w-full px-4 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'border-slate-700 hover:border-orange-500 text-slate-400 hover:text-orange-500'
                    : 'border-slate-300 hover:border-orange-500 text-slate-600 hover:text-orange-500'
                }`}
              >
                + Add Variant
              </button>
            </div>
          </div>

          {/* Product Add-Ons Section */}
          <div className="space-y-4">
            <div className={`pb-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Product Add-Ons
              </h3>
            </div>

            <div className="space-y-3">
              {currentProduct.addOns.map((addOn, index) => (
                <div key={addOn.id} className={`p-3 rounded-lg border flex items-center gap-3 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={addOn.name}
                      onChange={(e) => {
                        const newAddOns = [...currentProduct.addOns];
                        newAddOns[index].name = e.target.value;
                        setCurrentProduct({ ...currentProduct, addOns: newAddOns });
                      }}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                      placeholder="Add-on name"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={addOn.price}
                      onChange={(e) => {
                        const newAddOns = [...currentProduct.addOns];
                        newAddOns[index].price = parseFloat(e.target.value) || 0;
                        setCurrentProduct({ ...currentProduct, addOns: newAddOns });
                      }}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                      placeholder="Price"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentProduct({
                        ...currentProduct,
                        addOns: currentProduct.addOns.filter((_, i) => i !== index)
                      });
                    }}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setCurrentProduct({
                    ...currentProduct,
                    addOns: [
                      ...currentProduct.addOns,
                      {
                        id: `a${Date.now()}`,
                        name: '',
                        price: 0
                      }
                    ]
                  });
                }}
                className={`w-full px-4 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'border-slate-700 hover:border-orange-500 text-slate-400 hover:text-orange-500'
                    : 'border-slate-300 hover:border-orange-500 text-slate-600 hover:text-orange-500'
                }`}
              >
                + Add Add-On
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium text-sm transition-all shadow-md"
            >
              {editingId ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};
