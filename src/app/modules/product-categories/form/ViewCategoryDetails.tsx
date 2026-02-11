import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { getThemeColors } from '../../../../theme/colors';
import { Package, DollarSign, Settings, Info, Image as ImageIcon, Tag, Barcode, Calendar } from 'lucide-react';

interface ViewCategoryDetailsProps {
  category: Partial<Category>;
  isDarkMode?: boolean;
}

interface ProductDetails {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description?: string;
  detailDescription?: string;
  summary?: string;
  productImage?: string;
  mobileImage?: string;
  webImage?: string;
  barCode?: string;
  pctCode?: string;
  genericName?: string;
  manufacturer?: string;
  supplier?: string;
  productType?: string;
  racks?: string;
  createdAt?: string;
  updatedAt?: string;
  showInMobileApp?: boolean;
  showInWebApp?: boolean;
  showOnPos?: boolean;
  isAutoReady?: boolean;
  assignedBranches?: string[];
  variants?: Array<{
    id: string;
    name: string;
    displayName: string;
    instructions: string;
    minimumSelection: number;
    maximumSelection: number;
    options: Array<{ id: string; name: string }>;
  }>;
  variantPricing?: Array<{
    variantName: string;
    costPrice: number;
    retailPrice: number;
  }>;
  addons?: Array<{
    id: string;
    name: string;
    displayName: string;
    instructions: string;
    minimumSelection: number;
    maximumSelection: number;
    options: Array<{ id: string; name: string }>;
  }>;
  branchPricing?: Array<{
    branchId: string;
    branchName: string;
    costPrice: number;
    meanPrice: number;
    retailPrice: number;
    salePrice: number;
    discount: number;
    discountType: string;
    salesTax: number;
    salesTaxType: string;
    grossMargin: number;
  }>;
}

export const ViewCategoryDetails: React.FC<ViewCategoryDetailsProps> = ({
  category,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const [activeTab, setActiveTab] = useState(0);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

  useEffect(() => {
    // Load full product details from localStorage
    if (typeof window !== 'undefined' && category.id) {
      const productsStr = localStorage.getItem('products_list');
      if (productsStr) {
        try {
          const products = JSON.parse(productsStr);
          const product = products.find((p: any) => p.id === category.id);
          if (product) {
            setProductDetails(product);
          }
        } catch (error) {
          console.error('Failed to load product details:', error);
        }
      }
    }
  }, [category.id]);

  const tabs = [
    { id: 0, label: 'Overview', icon: Info },
    { id: 1, label: 'Pricing', icon: DollarSign },
    { id: 2, label: 'Variants', icon: Settings },
    { id: 3, label: 'Add-ons', icon: Package },
  ];

  const DetailRow = ({ label, value }: { label: string; value: string | number | boolean | undefined }) => (
    <div className="py-2.5 border-b last:border-b-0" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
      <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {label}
      </div>
      <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
        {value !== undefined && value !== null ? String(value) : 'N/A'}
      </div>
    </div>
  );

  const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
    <div className={`flex items-center gap-2 text-sm font-bold mb-3 pb-2 border-b ${isDarkMode ? 'text-slate-200 border-slate-700' : 'text-slate-800 border-slate-200'}`}>
      {Icon && <Icon size={16} className={isDarkMode ? 'text-orange-400' : 'text-orange-500'} />}
      {children}
    </div>
  );

  const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' }) => {
    const colors = {
      default: isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700',
      success: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700',
      warning: isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[variant]}`}>
        {children}
      </span>
    );
  };

  if (!productDetails) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Product Images */}
      {(productDetails.productImage || productDetails.mobileImage || productDetails.webImage) && (
        <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} p-4`}>
          <SectionTitle icon={ImageIcon}>Product Images</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            {productDetails.productImage && (
              <div>
                <p className={`text-xs mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Product Image</p>
                <img
                  src={productDetails.productImage}
                  alt="Product"
                  className="w-full h-24 object-cover rounded-lg border"
                  style={{ borderColor: isDarkMode ? '#334155' : '#e2e8f0' }}
                />
              </div>
            )}
            {productDetails.mobileImage && (
              <div>
                <p className={`text-xs mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Mobile Image</p>
                <img
                  src={productDetails.mobileImage}
                  alt="Mobile"
                  className="w-full h-24 object-cover rounded-lg border"
                  style={{ borderColor: isDarkMode ? '#334155' : '#e2e8f0' }}
                />
              </div>
            )}
            {productDetails.webImage && (
              <div>
                <p className={`text-xs mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Web Image</p>
                <img
                  src={productDetails.webImage}
                  alt="Web"
                  className="w-full h-24 object-cover rounded-lg border"
                  style={{ borderColor: isDarkMode ? '#334155' : '#e2e8f0' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b " style={{ borderColor: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-2 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id
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
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {/* Overview Tab */}
        {activeTab === 0 && (
          <div className="space-y-4">
            {/* Basic Information */}
            <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <SectionTitle icon={Info}>Basic Information</SectionTitle>
              <div className="grid grid-cols-2 gap-x-4">
                <DetailRow label="Product ID" value={productDetails.id} />
                <DetailRow label="Product Name" value={productDetails.name} />
                <DetailRow label="Category" value={productDetails.category} />
                <DetailRow label="Sub Category" value={productDetails.subCategory} />
                {/* <DetailRow label="Generic Name" value={productDetails.genericName} /> */}
                {/* <DetailRow label="Product Type" value={productDetails.productType} /> */}
              </div>
            </div>

            {/* Descriptions */}
            <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <SectionTitle>Descriptions</SectionTitle>
              <DetailRow label="Summary" value={productDetails.summary} />
              <DetailRow label="Description" value={productDetails.description} />
              <DetailRow label="Detailed Description" value={productDetails.detailDescription} />
            </div>

            {/* Codes & Identifiers */}
            {/* <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <SectionTitle icon={Barcode}>Codes & Identifiers</SectionTitle>
              <div className="grid grid-cols-2 gap-x-4">
                <DetailRow label="Barcode" value={productDetails.barCode} />
                <DetailRow label="PCT Code" value={productDetails.pctCode} />
              </div>
            </div> */}

            {/* Supplier Information */}
            <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <SectionTitle icon={Package}>Supplier & Storage</SectionTitle>
              <div className="grid grid-cols-2 gap-x-4">
                <DetailRow label="Manufacturer" value={productDetails.manufacturer} />
                <DetailRow label="Supplier" value={productDetails.supplier} />
                {/* <DetailRow label="Rack Location" value={productDetails.racks} /> */}
              </div>
            </div>

            {/* Visibility Settings */}
            <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <SectionTitle>Visibility & Settings</SectionTitle>
              <div className="flex flex-wrap gap-2 mb-3">
                {productDetails.showInMobileApp && <Badge variant="success">Mobile App</Badge>}
                {productDetails.showInWebApp && <Badge variant="success">Web App</Badge>}
                {productDetails.showOnPos && <Badge variant="success">POS</Badge>}
                {productDetails.isAutoReady && <Badge variant="warning">Auto Ready</Badge>}
              </div>
              {productDetails.assignedBranches && productDetails.assignedBranches.length > 0 && (
                <div>
                  <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Assigned Branches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {productDetails.assignedBranches.map((branch, idx) => (
                      <Badge key={idx}>{branch}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <SectionTitle icon={Calendar}>Timestamps</SectionTitle>
              <div className="grid grid-cols-2 gap-x-4">
                <DetailRow label="Created At" value={productDetails.createdAt} />
                <DetailRow label="Updated At" value={productDetails.updatedAt} />
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 1 && (
          <div className="space-y-4">
            {/* Variant Pricing */}
            {productDetails.variantPricing && productDetails.variantPricing.length > 0 && (
              <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <SectionTitle icon={Tag}>Variant Pricing</SectionTitle>
                <div className="space-y-3">
                  {productDetails.variantPricing.map((variant, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white'}`}
                      style={{ border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                          {variant.variantName}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Cost Price:</span>
                          <span className={`ml-2 font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            ${variant.costPrice}
                          </span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Retail Price:</span>
                          <span className={`ml-2 font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                            ${variant.retailPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Branch Pricing */}
            {productDetails.branchPricing && productDetails.branchPricing.length > 0 && (
              <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <SectionTitle icon={DollarSign}>Branch Pricing</SectionTitle>
                <div className="space-y-3">
                  {productDetails.branchPricing.map((branch, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white'}`}
                      style={{ border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                          {branch.branchName}
                        </span>
                        <Badge>ID: {branch.branchId}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Cost Price:</span>
                          <span className={`ml-2 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            ${branch.costPrice}
                          </span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Mean Price:</span>
                          <span className={`ml-2 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            ${branch.meanPrice}
                          </span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Retail Price:</span>
                          <span className={`ml-2 font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                            ${branch.retailPrice}
                          </span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Sale Price:</span>
                          <span className={`ml-2 font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            ${branch.salePrice}
                          </span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Discount:</span>
                          <span className={`ml-2 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {branch.discount}% ({branch.discountType})
                          </span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Sales Tax:</span>
                          <span className={`ml-2 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {branch.salesTax}% ({branch.salesTaxType})
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Gross Margin:</span>
                          <span className={`ml-2 font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {branch.grossMargin}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Variants Tab */}
        {activeTab === 2 && (
          <div className="space-y-4">
            {productDetails.variants && productDetails.variants.length > 0 ? (
              productDetails.variants.map((variant, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`font-bold text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                        {variant.name}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {variant.displayName}
                      </p>
                    </div>
                    <Badge>ID: {variant.id}</Badge>
                  </div>

                  {variant.instructions && (
                    <div className="mb-3">
                      <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Instructions
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {variant.instructions}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Min Selection
                      </p>
                      <Badge variant="warning">{variant.minimumSelection}</Badge>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Max Selection
                      </p>
                      <Badge variant="success">{variant.maximumSelection}</Badge>
                    </div>
                  </div>

                  {variant.options && variant.options.length > 0 && (
                    <div>
                      <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Options ({variant.options.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option, optIdx) => (
                          <Badge key={optIdx}>{option.name}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>No variants available</p>
              </div>
            )}
          </div>
        )}

        {/* Add-ons Tab */}
        {activeTab === 3 && (
          <div className="space-y-4">
            {productDetails.addons && productDetails.addons.length > 0 ? (
              productDetails.addons.map((addon, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`font-bold text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                        {addon.name}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {addon.displayName}
                      </p>
                    </div>
                    <Badge>ID: {addon.id}</Badge>
                  </div>

                  {addon.instructions && (
                    <div className="mb-3">
                      <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Instructions
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {addon.instructions}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Min Selection
                      </p>
                      <Badge variant="warning">{addon.minimumSelection}</Badge>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Max Selection
                      </p>
                      <Badge variant="success">{addon.maximumSelection}</Badge>
                    </div>
                  </div>

                  {addon.options && addon.options.length > 0 && (
                    <div>
                      <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Options ({addon.options.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {addon.options.map((option, optIdx) => (
                          <Badge key={optIdx}>{option.name}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>No add-ons available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
