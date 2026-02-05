import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import { Category } from '../types';
import { getThemeColors } from '../../../../theme/colors';
import { Package, DollarSign, Settings, Info, Barcode, Image as ImageIcon } from 'lucide-react';

interface EditCategoryFormProps {
  initialData: Partial<Category>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

interface ProductFormData {
  name: string;
  category: string;
  subCategory: string;
  description?: string;
  detailDescription?: string;
  summary?: string;
  genericName?: string;
  productType?: string;
  barCode?: string;
  pctCode?: string;
  manufacturer?: string;
  supplier?: string;
  racks?: string;
  showInMobileApp?: boolean;
  showInWebApp?: boolean;
  showOnPos?: boolean;
  isAutoReady?: boolean;
  productImage?: string;
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const [activeTab, setActiveTab] = useState(0);
  const [productData, setProductData] = useState<any>(null);

  useEffect(() => {
    // Load full product details from localStorage
    if (typeof window !== 'undefined' && initialData.id) {
      const productsStr = localStorage.getItem('products_list');
      if (productsStr) {
        try {
          const products = JSON.parse(productsStr);
          const product = products.find((p: any) => p.id === initialData.id);
          if (product) {
            setProductData(product);
          }
        } catch (error) {
          console.error('Failed to load product details:', error);
        }
      }
    }
  }, [initialData.id]);

  const { control, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: productData || {
      name: initialData.categoryName || '',
      category: '',
      subCategory: initialData.subCategories || '',
      description: '',
      detailDescription: '',
      summary: '',
      genericName: '',
      productType: '',
      barCode: '',
      pctCode: '',
      manufacturer: '',
      supplier: '',
      racks: '',
      showInMobileApp: true,
      showInWebApp: true,
      showOnPos: true,
      isAutoReady: false,
      productImage: initialData.productImage || '',
    },
  });

  useEffect(() => {
    if (productData) {
      // Reset form with product data when loaded
      const formData: ProductFormData = {
        name: productData.name || '',
        category: productData.category || '',
        subCategory: productData.subCategory || '',
        description: productData.description || '',
        detailDescription: productData.detailDescription || '',
        summary: productData.summary || '',
        genericName: productData.genericName || '',
        productType: productData.productType || '',
        barCode: productData.barCode || '',
        pctCode: productData.pctCode || '',
        manufacturer: productData.manufacturer || '',
        supplier: productData.supplier || '',
        racks: productData.racks || '',
        showInMobileApp: productData.showInMobileApp ?? true,
        showInWebApp: productData.showInWebApp ?? true,
        showOnPos: productData.showOnPos ?? true,
        isAutoReady: productData.isAutoReady ?? false,
        productImage: productData.productImage || '',
      };
    }
  }, [productData]);

  const handleFormSubmit = (data: ProductFormData) => {
    // Merge form data with existing product data
    const updatedProduct = {
      ...productData,
      ...data,
      updatedAt: new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    };

    // Update localStorage
    if (typeof window !== 'undefined') {
      const productsStr = localStorage.getItem('products_list');
      if (productsStr) {
        try {
          const products = JSON.parse(productsStr);
          const index = products.findIndex((p: any) => p.id === initialData.id);
          if (index !== -1) {
            products[index] = updatedProduct;
            localStorage.setItem('products_list', JSON.stringify(products));
          }
        } catch (error) {
          console.error('Failed to update product:', error);
        }
      }
    }

    onSubmit(updatedProduct);
  };

  const tabs = [
    { id: 0, label: 'Basic Info', icon: Info },
    { id: 1, label: 'Details', icon: Package },
    { id: 2, label: 'Codes & Supplier', icon: Barcode },
    { id: 3, label: 'Settings', icon: Settings },
  ];

  const InputField = ({
    name,
    label,
    placeholder,
    required = false,
    type = 'text',
    multiline = false
  }: {
    name: any;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: string;
    multiline?: boolean;
  }) => (
    <div>
      <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={required ? { required: `${label} is required` } : {}}
        render={({ field, fieldState }) => (
          <>
            {multiline ? (
              <textarea
                {...field}
                placeholder={placeholder}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  } ${fieldState.error ? 'border-red-500' : ''
                  }`}
              />
            ) : (
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  } ${fieldState.error ? 'border-red-500' : ''
                  }`}
              />
            )}
            {fieldState.error && (
              <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );

  const CheckboxField = ({ name, label }: { name: any; label: string }) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            className="w-5 h-5 rounded border-2 text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            style={{
              accentColor: '#f97316'
            }}
          />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {label}
          </span>
        </label>
      )}
    />
  );

  if (!productData) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Loading product data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id
                ? isDarkMode
                  ? 'text-orange-400 border-b-2 border-orange-400'
                  : 'text-orange-600 border-b-2 border-orange-600'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-4 pr-2">
        {/* Basic Info Tab */}
        {activeTab === 0 && (
          <div className="space-y-4">
            <InputField
              name="name"
              label="Product Name"
              placeholder="Enter product name"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="category"
                label="Category"
                placeholder="e.g., PIZZA"
                required
              />
              <InputField
                name="subCategory"
                label="Sub Category"
                placeholder="e.g., BEST SELLER"
                required
              />
            </div>

            <InputField
              name="genericName"
              label="Generic Name"
              placeholder="Enter generic name"
            />

            <InputField
              name="productType"
              label="Product Type"
              placeholder="Enter product type"
            />

            <InputField
              name="productImage"
              label="Image URL"
              placeholder="Enter image URL"
            />
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <InputField
              name="summary"
              label="Summary"
              placeholder="Brief summary of the product"
              multiline
            />

            <InputField
              name="description"
              label="Description"
              placeholder="Product description"
              multiline
            />

            <InputField
              name="detailDescription"
              label="Detailed Description"
              placeholder="Detailed product description"
              multiline
            />
          </div>
        )}

        {/* Codes & Supplier Tab */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="barCode"
                label="Barcode"
                placeholder="Enter barcode"
              />
              <InputField
                name="pctCode"
                label="PCT Code"
                placeholder="Enter PCT code"
              />
            </div>

            <InputField
              name="manufacturer"
              label="Manufacturer"
              placeholder="Enter manufacturer name"
            />

            <InputField
              name="supplier"
              label="Supplier"
              placeholder="Enter supplier name"
            />

            <InputField
              name="racks"
              label="Rack Location"
              placeholder="Enter rack/storage location"
            />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <h4 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Visibility Settings
              </h4>
              <div className="space-y-3">
                <CheckboxField name="showInMobileApp" label="Show in Mobile App" />
                <CheckboxField name="showInWebApp" label="Show in Web App" />
                <CheckboxField name="showOnPos" label="Show on POS" />
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <h4 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Additional Settings
              </h4>
              <div className="space-y-3">
                <CheckboxField name="isAutoReady" label="Auto Ready" />
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${isDarkMode ? 'bg-orange-900/10 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                <strong>Note:</strong> Variant pricing, branch pricing, variants, and add-ons cannot be edited here.
                Please use the dedicated product management section for advanced configurations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${isDarkMode
            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/30"
        >
          Update Product
        </button>
      </div>
    </form>
  );
};
