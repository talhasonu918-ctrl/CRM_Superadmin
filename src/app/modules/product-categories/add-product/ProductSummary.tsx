import React from 'react';
import { Check } from 'lucide-react';
import { ProductFormData } from '../product-types';

interface ProductSummaryProps {
  formData: ProductFormData;
  onUpdateFormData: (data: Partial<ProductFormData>) => void;
  onBack: () => void;
  onSave: () => void;
  isDarkMode: boolean;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({
  formData,
  onBack,
  onSave,
  isDarkMode,
}) => {
  const cardClass = `rounded-xl border p-6 ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`;
  const labelClass = `text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`;
  const valueClass = `text-sm font-medium mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <Check size={20} className="text-white" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Summary
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Review your product details before saving
          </p>
        </div>
      </div>

      {/* Product Basic Information */}
      <div className={cardClass}>
        <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Product Basic Information
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <div className={labelClass}>Name</div>
            <div className={valueClass}>{formData.name || 'N/A'}</div>
          </div>
          <div>
            <div className={labelClass}>Bar Code</div>
            <div className={valueClass}>{formData.barCode || 'N/A'}</div>
          </div>
          <div>
            <div className={labelClass}>Generic Name</div>
            <div className={valueClass}>{formData.genericName || 'N/A'}</div>
          </div>
          <div>
            <div className={labelClass}>Description</div>
            <div className={valueClass}>{formData.description || 'N/A'}</div>
          </div>
          <div>
            <div className={labelClass}>Category</div>
            <div className={valueClass}>{formData.category || 'N/A'}</div>
          </div>
          <div>
            <div className={labelClass}>Sub Category</div>
            <div className={valueClass}>{formData.subCategory || 'N/A'}</div>
          </div>
          <div>
            <div className={labelClass}>Product Type</div>
            <div className={valueClass}>{formData.productType || 'N/A'}</div>
          </div>
          <div>
            <div className={labelClass}>Assigned Branches</div>
            <div className={valueClass}>{formData.assignedBranches?.join(', ') || 'N/A'}</div>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.showOnPos} disabled className="w-4 h-4 rounded" />
            <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show on Pos</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isAutoReady} disabled className="w-4 h-4 rounded" />
            <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Is Auto Ready</span>
          </div>
        </div>
      </div>

      {/* Mobile / Web Configuration */}
      <div className={cardClass}>
        <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Mobile / Web Configuration
        </h4>
        <div className="space-y-3">
          <div>
            <div className={labelClass}>Summary</div>
            <div className={valueClass}>{formData.summary || 'N/A'}</div>
          </div>
          <div>
            <div className={labelClass}>Detail Description</div>
            <div className={valueClass}>{formData.detailDescription || 'N/A'}</div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.showInMobileApp} disabled className="w-4 h-4 rounded" />
              <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show in Mobile App</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.showInWebApp} disabled className="w-4 h-4 rounded" />
              <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show in Web App</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Variants */}
      {formData.variants && formData.variants.length > 0 && (
        <div className={cardClass}>
          <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Product Variants ({formData.variants.length})
          </h4>
          <div className="space-y-3">
            {formData.variants.map((variant) => (
              <div key={variant.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="font-semibold">{variant.name || variant.displayName}</div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {variant.options.map(opt => (
                    <span
                      key={opt.id}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {opt.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Add-Ons */}
      {formData.addons && formData.addons.length > 0 && (
        <div className={cardClass}>
          <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Product Add-Ons ({formData.addons.length})
          </h4>
          <div className="space-y-3">
            {formData.addons.map((addon) => (
              <div key={addon.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="font-semibold">{addon.name}</div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {addon.options.length} options
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      {formData.branchPricing && formData.branchPricing.length > 0 && (
        <div className={cardClass}>
          <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Pricing
          </h4>
          {formData.branchPricing.map((pricing) => (
            <div key={pricing.branchId} className="grid grid-cols-3 gap-4">
              <div>
                <div className={labelClass}>Cost Price</div>
                <div className={valueClass}>{pricing.costPrice}</div>
              </div>
              <div>
                <div className={labelClass}>Retail Price</div>
                <div className={valueClass}>{pricing.retailPrice}</div>
              </div>
              <div>
                <div className={labelClass}>Sale Price</div>
                <div className={valueClass}>{pricing.salePrice}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
            isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Back
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-purple-500/30"
        >
          Save Product
        </button>
      </div>
    </div>
  );
};
