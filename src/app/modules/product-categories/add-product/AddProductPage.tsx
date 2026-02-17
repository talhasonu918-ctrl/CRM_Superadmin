import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Check } from 'lucide-react';
import { ProductFormData } from '../product-types';
import { ProductBasicInfo, ProductAddons, ProductVariants, ProductPricing, ProductSummary } from './index';
import notify from '../../../../utils/toast';
import { useCompany } from '@/src/contexts/CompanyContext';
import { ROUTES } from '@/src/const/constants';

interface AddProductPageProps {
  isDarkMode: boolean;
}

const STORAGE_KEY = 'product_form_data';

const tabs = [
  { id: 0, label: 'Product Info', component: ProductBasicInfo },
  { id: 1, label: 'Add-Ons', component: ProductAddons },
  { id: 2, label: 'Variants', component: ProductVariants },
  { id: 3, label: 'Pricing', component: ProductPricing },
  { id: 4, label: 'Summary', component: ProductSummary },
];

export const AddProductPage: React.FC<AddProductPageProps> = ({ isDarkMode }) => {
  const router = useRouter();
  const { company } = useCompany();
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    subCategory: '',
    productType: 'Menu',
    assignedBranches: ['Main Branch'],
    showOnPos: true,
    isAutoReady: false,
    showInMobileApp: false,
    showInWebApp: false,
    variants: [],
    addons: [],
    branchPricing: [],
    variantPricing: [],
    currentTab: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data);
        setCurrentTab(data.currentTab || 0);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    const dataToSave = { ...formData, currentTab };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, currentTab]);

  const handleUpdateFormData = (updates: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateCurrentTab = (): { isValid: boolean; message: string } => {
    switch (currentTab) {
      case 0: // Product Info
        if (!formData.name?.trim()) {
          return { isValid: false, message: 'Product Name is required' };
        }
        if (!formData.category?.trim()) {
          return { isValid: false, message: 'Category is required' };
        }
        return { isValid: true, message: '' };

      case 3: // Pricing
        const branchPricing = formData.branchPricing || [];
        if (branchPricing.length === 0) {
          return { isValid: false, message: 'Please add pricing information' };
        }

        const hasValidPricing = branchPricing.some(
          (branch) => branch.retailPrice > 0 || branch.costPrice > 0
        );

        if (!hasValidPricing) {
          return { isValid: false, message: 'Please enter valid pricing (Retail Price or Cost Price must be greater than 0)' };
        }
        return { isValid: true, message: '' };

      default:
        return { isValid: true, message: '' };
    }
  };

  const handleNext = () => {
    const validation = validateCurrentTab();

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handleBack = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    } else {
      router.push(company ? ROUTES.PRODUCT_CATEGORIES(company) : '/product-categories');
    }
  };

  const handleSaveProduct = () => {
    // Save to products list in localStorage
    const productsKey = 'products_list';
    const existingProducts = JSON.parse(localStorage.getItem(productsKey) || '[]');

    const newProduct = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      updatedAt: new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    };

    existingProducts.push(newProduct);
    localStorage.setItem(productsKey, JSON.stringify(existingProducts));

    notify.success('Product added successfully!', { icon: '🎉' });

    // Clear form data
    localStorage.removeItem(STORAGE_KEY);

    // Trigger refresh event for table
    window.dispatchEvent(new Event('refreshCategories'));

    // Small delay before redirect to ensure event fires
    setTimeout(() => {
      router.push(company ? ROUTES.PRODUCT_CATEGORIES(company) : '/product-categories');
    }, 100);
  };

  const CurrentTabComponent = tabs[currentTab].component;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {formData.name || 'Add New Product'}
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Create and manage product details, variants and pricing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(index)}
                className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${currentTab === index
                  ? isDarkMode
                    ? 'text-orange-400'
                    : 'text-orange-500'
                  : isDarkMode
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <div className="flex items-center gap-2">
                  {index < currentTab && (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  {tab.label}
                </div>
                {currentTab === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <CurrentTabComponent
          formData={formData}
          onUpdateFormData={handleUpdateFormData}
          onNext={handleNext}
          onBack={handleBack}
          onSave={handleSaveProduct}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};
