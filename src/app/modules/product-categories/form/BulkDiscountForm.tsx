import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Percent, ChevronDown } from 'lucide-react';
import { getThemeColors } from '../../../../theme/colors';

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  discount?: number;
}

interface BulkDiscountFormProps {
  onSubmit: (selectedProducts: string[], discount: number) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

export const BulkDiscountForm: React.FC<BulkDiscountFormProps> = ({
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {

  const theme = getThemeColors(isDarkMode);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [discount, setDiscount] = useState<number>(0);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const [categorySearch, setCategorySearch] = useState('');
  const [subSearch, setSubSearch] = useState('');

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
      if (subRef.current && !subRef.current.contains(event.target as Node)) {
        setSubOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load products
  useEffect(() => {
    const productsStr = localStorage.getItem('products_list');
    if (productsStr) {
      const parsed = JSON.parse(productsStr);
      const formatted = parsed.map((p: any) => ({
        id: p.id,
        name: p.name || 'Unnamed Product',
        category: p.category || '',
        subCategory: p.subCategory || '',
        discount: p.discount || 0,
      }));
      setProducts(formatted);
    }
  }, []);

  // Categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  }, [products]);

  const subCategories = useMemo(() => {
    if (selectedCategory) {
      return Array.from(new Set(
        products
          .filter(p => p.category === selectedCategory)
          .map(p => p.subCategory)
          .filter(Boolean)
      ));
    }
    return Array.from(new Set(products.map(p => p.subCategory).filter(Boolean)));
  }, [products, selectedCategory]);

  const filteredCategories = categories.filter(c =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredSubCategories = subCategories.filter(s =>
    s.toLowerCase().includes(subSearch.toLowerCase())
  );

  const filteredProducts = products.filter(p => {
    const catMatch = !selectedCategory || p.category === selectedCategory;
    const subMatch = !selectedSubCategory || p.subCategory === selectedSubCategory;
    return catMatch && subMatch;
  });

  const toggleProduct = (id: string) => {
    const newSet = new Set(selectedProducts);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedProducts(newSet);
  };

  const toggleAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.size === 0) {
      alert('Please select at least one product');
      return;
    }
    if (discount <= 0 || discount > 100) {
      alert('Discount must be between 1-100');
      return;
    }
    onSubmit(Array.from(selectedProducts), discount);
  };

  const inputStyle = `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
    isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white'
      : 'bg-white border-slate-300 text-slate-900'
  }`;

  const dropdownStyle = `absolute z-50 w-full mt-1 max-h-60 overflow-auto border rounded-lg shadow-lg ${
    isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white'
      : 'bg-white border-slate-300 text-slate-900'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* CATEGORY + SUBCATEGORY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* CATEGORY */}
        <div ref={categoryRef} className="relative">
          <label className="block text-sm font-medium mb-2">
            Category
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search category..."
              value={selectedCategory || categorySearch}
              onFocus={() => setCategoryOpen(true)}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setSelectedCategory('');
              }}
              className={inputStyle}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          {categoryOpen && (
            <div className={dropdownStyle}>
              <div
                onClick={() => {
                  setSelectedCategory('');
                  setCategorySearch('');
                  setSelectedSubCategory('');
                  setCategoryOpen(false);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-orange-500 hover:text-white"
              >
                All Categories
              </div>
              {filteredCategories.map(cat => (
                <div
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCategorySearch('');
                    setSelectedSubCategory('');
                    setCategoryOpen(false);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-orange-500 hover:text-white"
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUB CATEGORY */}
        <div ref={subRef} className="relative">
          <label className="block text-sm font-medium mb-2">
            Sub Category
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search subcategory..."
              value={selectedSubCategory || subSearch}
              onFocus={() => setSubOpen(true)}
              onChange={(e) => {
                setSubSearch(e.target.value);
                setSelectedSubCategory('');
              }}
              className={inputStyle}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          {subOpen && (
            <div className={dropdownStyle}>
              <div
                onClick={() => {
                  setSelectedSubCategory('');
                  setSubSearch('');
                  setSubOpen(false);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-orange-500 hover:text-white"
              >
                All Sub Categories
              </div>
              {filteredSubCategories.map(sub => (
                <div
                  key={sub}
                  onClick={() => {
                    setSelectedSubCategory(sub);
                    setSubSearch('');
                    setSubOpen(false);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-orange-500 hover:text-white"
                >
                  {sub}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DISCOUNT */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Discount %
        </label>
        <div className="relative">
          <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
          <input
            type="number"
            min="1"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className={`${inputStyle} pl-10`}
          />
        </div>
      </div>

      {/* PRODUCTS LIST */}
      <div>
        <div className="flex justify-between mb-3">
          <span className="text-sm font-medium">
            Products ({selectedProducts.size})
          </span>
          <button
            type="button"
            onClick={toggleAll}
            className="text-sm text-orange-500 font-medium"
          >
            {selectedProducts.size === filteredProducts.length
              ? 'Deselect All'
              : 'Select All'}
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto border rounded-lg divide-y">
          {filteredProducts.map(product => (
            <label
              key={product.id}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-orange-50"
            >
              <input
                type="checkbox"
                checked={selectedProducts.has(product.id)}
                onChange={() => toggleProduct(product.id)}
              />
              <div>
                <div className="text-sm font-medium">
                  {product.name}
                </div>
                <div className="text-xs text-slate-500">
                  {product.category} • {product.subCategory}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-orange-500 text-white rounded-lg"
        >
          Apply Discount
        </button>
      </div>

    </form>
  );
};
