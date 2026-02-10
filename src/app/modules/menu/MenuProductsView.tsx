import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Package, DollarSign, Star } from 'lucide-react';
import { ReusableModal } from '../../../components/ReusableModal';

interface MenuProductsViewProps {
  isDarkMode: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  rating: number;
  stock: number;
}

const STORAGE_KEY = 'menu_products';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'BBQ Beef Brisket Pizza',
    category: 'Pizza',
    price: 24.5,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop',
    available: true,
    rating: 4.9,
    stock: 45
  },
  {
    id: '2',
    name: 'Zesty Jalapeno Burger',
    category: 'Burgers',
    price: 16.0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop',
    available: true,
    rating: 4.8,
    stock: 20
  },
  {
    id: '3',
    name: 'Classic Strawberry Shake',
    category: 'Drinks',
    price: 8.5,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=300&auto=format&fit=crop',
    available: false,
    rating: 4.7,
    stock: 0
  },
  {
    id: '4',
    name: 'Truffle Parmesan Fries',
    category: 'Sides',
    price: 9.0,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=300&auto=format&fit=crop',
    available: true,
    rating: 4.6,
    stock: 120
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
    category: '',
    price: 0,
    image: '',
    available: true,
    rating: 0,
    stock: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
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

  const inputClass = `w-full px-4 py-2 rounded-lg border ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
    } focus:outline-none focus:ring-2 focus:ring-orange-500`;

  const handleAdd = () => {
    setEditingId(null);
    setCurrentProduct({
      id: Date.now().toString(),
      name: '',
      category: '',
      price: 0,
      image: '',
      available: true,
      rating: 0,
      stock: 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setCurrentProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? currentProduct : p));
    } else {
      setProducts([...products, currentProduct]);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-lg md:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Menu Products
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage all menu items and their details
          </p>
        </div>

        <div className="flex items-center gap-3 ml-1.5 md:ml-0 ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
    type="text"
    placeholder="Search products..."
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
            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 md:px-4 md:py-2 text-[12px] md:text-sm rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 md:p-0">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`rounded-xl border overflow-hidden ${isDarkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
              } hover:shadow-lg transition-shadow`}
          >
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${product.available
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}
                >
                  {product.available ? 'Available' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {product.name}
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {product.category}
                </p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-orange-500" />
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {product.rating}
                  </span>
                </div>
              </div>

              <div className={`text-xs mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Stock: {product.stock} units
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 p-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Product" : "Add New Product"}
        size="lg"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Product Name
            </label>
            <input
              type="text"
              value={currentProduct.name}
              onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              className={inputClass}
              placeholder="e.g. BBQ Beef Brisket Pizza"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Category
              </label>
              <input
                type="text"
                value={currentProduct.category}
                onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                className={inputClass}
                placeholder="e.g. Pizza"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={currentProduct.price}
                onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Product Image
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDarkMode
              ? 'border-slate-700 hover:border-orange-500 bg-slate-800'
              : 'border-slate-300 hover:border-orange-500 bg-slate-50'
              }`}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert('File size exceeds 5MB limit');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result as string;
                      setCurrentProduct({ ...currentProduct, image: base64String });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="product-image-upload"
              />
              <label htmlFor="product-image-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2">
                {currentProduct.image ? (
                  <div className="relative w-full h-32">
                    <img
                      src={currentProduct.image}
                      alt="Product Preview"
                      className="w-full h-full object-contain rounded-md"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                      <span className="text-white text-xs">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6">
                    <Package className={`mx-auto mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} size={24} />
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Click to upload product image
                    </span>
                  </div>
                )}
              </label>
            </div>
            {currentProduct.image && (
              <button
                type="button"
                onClick={() => setCurrentProduct({ ...currentProduct, image: '' })}
                className="mt-2 text-xs text-red-500 hover:text-red-600 underline"
              >
                Remove Image
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Stock
              </label>
              <input
                type="number"
                value={currentProduct.stock}
                onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
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
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
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

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-md font-medium ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-1 md:px-4 md:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm md:text-md font-medium"
            >
              Save Variant
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};
