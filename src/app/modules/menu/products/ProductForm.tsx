import React, { useState, useEffect } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { ReusableModal } from '../../../../components/ReusableModal';
import { SearchableDropdown } from '../../../../components/SearchableDropdown';
import { Product, ProductVariant, ProductAddOn } from './types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product;
  isDarkMode: boolean;
  editingId: string | null;
}

// Sub-category mapping for each category
const SUBCATEGORY_MAP: Record<string, string[]> = {
  'Pizza': ['Thin Crust', 'Thick Crust', 'Stuffed Crust', 'Pan Pizza', 'Woodfire'],
  'Burgers': ['Classic', 'Premium', 'Specialty', 'Signature', 'Chicken'],
  'Drinks': ['Cold Beverages', 'Hot Beverages', 'Soft Drinks', 'Energy Drinks', 'Juices'],
  'Sides': ['Fries', 'Salads', 'Appetizers', 'Sauce & Condiments', 'Breads'],
  'Desserts': ['Cakes', 'Ice Cream', 'Pastries', 'Cookies', 'Brownies']
};

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSave,
  product: initialProduct,
  isDarkMode,
  editingId
}) => {
  const [currentProduct, setCurrentProduct] = useState<Product>(initialProduct);

  useEffect(() => {
    setCurrentProduct({
      ...initialProduct,
      barCode: initialProduct.barCode || '',
      genericName: initialProduct.genericName || '',
      pctCode: initialProduct.pctCode || '',
      racks: initialProduct.racks || '',
      summary: initialProduct.summary || '',
      detailDescription: initialProduct.detailDescription || '',
      showInMobileApp: initialProduct.showInMobileApp ?? true,
      showInWebApp: initialProduct.showInWebApp ?? true,
      mobileImage: initialProduct.mobileImage || '',
      webImage: initialProduct.webImage || '',
      variants: initialProduct.variants || [],
      addOns: initialProduct.addOns || [],
    });
  }, [initialProduct]);

  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-orange-500 hover:border-orange-500/50'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500 hover:border-orange-500/50'
    } focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all`;

  const handleSave = () => {
    if (!currentProduct.name.trim()) {
      alert('Product name is required');
      return;
    }
    onSave(currentProduct);
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
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

          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> */}
            {/* <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Bar Code
              </label>
              <input
                type="text"
                value={currentProduct.barCode}
                onChange={(e) => setCurrentProduct({ ...currentProduct, barCode: e.target.value })}
                className={inputClass}
                placeholder="Bar Code"
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
                placeholder="Generic Name"
              />
            </div> */}
            {/* <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                PCT Code
              </label>
              <input
                type="text"
                value={currentProduct.pctCode}
                onChange={(e) => setCurrentProduct({ ...currentProduct, pctCode: e.target.value })}
                className={inputClass}
                placeholder="PCT Code"
              />
            </div> */}
            {/* <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Racks
              </label>
              <input
                type="text"
                value={currentProduct.racks}
                onChange={(e) => setCurrentProduct({ ...currentProduct, racks: e.target.value })}
                className={inputClass}
                placeholder="Racks"
              />
            </div> */}
          {/* </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchableDropdown
              label="Category"
              options={[
                { value: 'Pizza', label: 'Pizza' },
                { value: 'Burgers', label: 'Burgers' },
                { value: 'Drinks', label: 'Drinks' },
                { value: 'Sides', label: 'Sides' },
                { value: 'Desserts', label: 'Desserts' }
              ]}
              value={currentProduct.category}
              onChange={(value: string) => setCurrentProduct({ ...currentProduct, category: value, subCategory: '' })}
              placeholder="Select Category"
              isDarkMode={isDarkMode}
            />

            <SearchableDropdown
              label="Sub Category"
              options={(
                SUBCATEGORY_MAP[currentProduct.category] || []
              ).map(sub => ({ value: sub, label: sub }))}
              value={currentProduct.subCategory}
              onChange={(value: string) => setCurrentProduct({ ...currentProduct, subCategory: value })}
              placeholder="Select sub category"
              isDarkMode={isDarkMode}
            />

            <SearchableDropdown
              label="Supplier"
              options={[
                { value: 'MIANS', label: 'MIANS' },
                { value: 'TALHA FOOD', label: 'TALHA FOOD' },
                { value: 'KHADAM', label: 'KHADAM' }
              ]}
              value={currentProduct.supplier}
              onChange={(value: string) => setCurrentProduct({ ...currentProduct, supplier: value })}
              placeholder="Select Supplier"
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <SearchableDropdown
              label="Product Type"
              options={[
                { value: 'Menu', label: 'Menu' },
                { value: 'Inventory', label: 'Inventory' },
                { value: 'Raw Material', label: 'Raw Material' }
              ]}
              value={currentProduct.productType}
              onChange={(value: string) => setCurrentProduct({ ...currentProduct, productType: value })}
              placeholder="Select Product Type"
              isDarkMode={isDarkMode}
            />

            <SearchableDropdown
              label="Assigned Branches"
              options={[
                { value: 'Main Branch', label: 'Main Branch' },
                { value: 'All Branches', label: 'All Branches' },
                { value: 'North Branch', label: 'North Branch' },
                { value: 'South Branch', label: 'South Branch' },
                { value: 'East Branch', label: 'East Branch' },
                { value: 'West Branch', label: 'West Branch' }
              ]}
              value={currentProduct.assignedBranches}
              onChange={(value: string) => setCurrentProduct({ ...currentProduct, assignedBranches: value })}
              placeholder="Select Branch"
              isDarkMode={isDarkMode}
            />
          </div>

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

            <SearchableDropdown
              label="Status"
              options={[
                { value: 'true', label: 'Available' },
                { value: 'false', label: 'Out of Stock' }
              ]}
              value={currentProduct.available ? 'true' : 'false'}
              onChange={(value: string) => setCurrentProduct({ ...currentProduct, available: value === 'true' })}
              placeholder="Select Status"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <div className={`pb-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Product Image
            </h3>
          </div>

          <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDarkMode
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
              id="product-image-upload-ref"
            />
            <label htmlFor="product-image-upload-ref" className="cursor-pointer flex flex-col items-center gap-3">
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
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
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
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
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
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
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
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
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
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${variant.options[size.toLowerCase() as 'small' | 'medium' | 'large']
                          ? 'bg-orange-500 text-white'
                          : isDarkMode
                            ? 'bg-slate-700 text-slate-300 hover:bg-orange-500/20 hover:text-orange-400'
                            : 'bg-slate-200 text-slate-700 hover:bg-orange-100 hover:text-orange-600'
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
              className={`w-full px-4 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${isDarkMode
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
                    className={`px-3 py-2 rounded-lg border text-sm ${isDarkMode
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
                    className={`px-3 py-2 rounded-lg border text-sm ${isDarkMode
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
              className={`w-full px-4 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium transition-colors ${isDarkMode
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
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${isDarkMode
                ? 'bg-slate-700 hover:bg-orange-500/20 hover:border-orange-500 text-white border border-transparent'
                : 'bg-slate-100 hover:bg-orange-50 hover:border-orange-500 text-slate-700 border border-transparent'
                }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-all shadow-md"
          >
            {editingId ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default ProductForm;
