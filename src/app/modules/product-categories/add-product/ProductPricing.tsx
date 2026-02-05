import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ProductFormData, BranchPricing, VariantPricing } from '../product-types';

interface ProductPricingProps {
  formData: ProductFormData;
  onUpdateFormData: (data: Partial<ProductFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export const ProductPricing: React.FC<ProductPricingProps> = ({
  formData,
  onUpdateFormData,
  onNext,
  onBack,
  isDarkMode,
}) => {
  const [expandedBranch, setExpandedBranch] = React.useState<string | null>('Main Branch');
  const [errors, setErrors] = React.useState<string>('');

  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
    isDarkMode
      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
  }`;

  // Initialize branch pricing if not exists
  React.useEffect(() => {
    if (!formData.branchPricing || formData.branchPricing.length === 0) {
      onUpdateFormData({
        branchPricing: [{
          branchId: '1',
          branchName: 'Main Branch',
          costPrice: 0,
          meanPrice: 0,
          retailPrice: 0,
          salePrice: 0,
          discount: 0,
          discountType: 'Value',
          salesTax: 0,
          salesTaxType: 'Value',
          grossMargin: 0,
        }],
      });
    }

    // Initialize variant pricing from variants
    if (formData.variants && formData.variants.length > 0 && (!formData.variantPricing || formData.variantPricing.length === 0)) {
      const variantPricing: VariantPricing[] = [];
      formData.variants.forEach(variant => {
        variant.options.forEach(option => {
          variantPricing.push({
            variantName: option.name,
            costPrice: 0,
            retailPrice: 0,
          });
        });
      });
      onUpdateFormData({ variantPricing });
    }
  }, []);

  const updateBranchPricing = (branchName: string, field: string, value: any) => {
    const updated = (formData.branchPricing || []).map(branch =>
      branch.branchName === branchName ? { ...branch, [field]: value } : branch
    );
    onUpdateFormData({ branchPricing: updated });
  };

  const updateVariantPricing = (variantName: string, field: string, value: number) => {
    const updated = (formData.variantPricing || []).map(variant =>
      variant.variantName === variantName ? { ...variant, [field]: value } : variant
    );
    onUpdateFormData({ variantPricing: updated });
  };

  const currentBranchPricing = (formData.branchPricing || []).find(b => b.branchName === expandedBranch) || (formData.branchPricing || [])[0];

  const validateAndProceed = () => {
    const branchPricing = formData.branchPricing || [];
    
    if (branchPricing.length === 0) {
      setErrors('Please add pricing information');
      return;
    }
    
    const hasValidPricing = branchPricing.some(
      (branch) => branch.retailPrice > 0 || branch.costPrice > 0
    );
    
    if (!hasValidPricing) {
      setErrors('Please enter valid pricing (Retail Price or Cost Price must be greater than 0)');
      return;
    }
    
    setErrors('');
    onNext();
  };

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Pricing
      </h3>

      {/* Common Pricing (Collapsible) */}
      <div className={`rounded-xl border ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}>
        <button
          onClick={() => setExpandedBranch(expandedBranch === 'Main Branch' ? null : 'Main Branch')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {expandedBranch === 'Main Branch' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Main Branch
            </span>
          </div>
        </button>

        {expandedBranch === 'Main Branch' && currentBranchPricing && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800">
            {/* Gross Margin, Cost, Mean, Retail, Sale */}
            <div className={`rounded-lg p-4 mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Gross Margin
                  </label>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {currentBranchPricing.grossMargin.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Cost Price
                  </label>
                  <input
                    type="number"
                    value={currentBranchPricing.costPrice}
                    onChange={(e) => updateBranchPricing('Main Branch', 'costPrice', parseFloat(e.target.value) || 0)}
                    className={inputClass}
                  />
                </div>
                {/* <div>
                  <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Mean Price
                  </label>
                  <input
                    type="number"
                    value={currentBranchPricing.meanPrice}
                    onChange={(e) => updateBranchPricing('Main Branch', 'meanPrice', parseFloat(e.target.value) || 0)}
                    className={inputClass}
                  />
                </div> */}
                <div>
                  <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Retail Price
                  </label>
                  <input
                    type="number"
                    value={currentBranchPricing.retailPrice}
                    onChange={(e) => updateBranchPricing('Main Branch', 'retailPrice', parseFloat(e.target.value) || 0)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Discount Price
                  </label>
                  <input
                    type="number"
                    value={currentBranchPricing.salePrice}
                    onChange={(e) => updateBranchPricing('Main Branch', 'salePrice', parseFloat(e.target.value) || 0)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Discount and Sales Tax */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Discount
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={currentBranchPricing.discount}
                    onChange={(e) => updateBranchPricing('Main Branch', 'discount', parseFloat(e.target.value) || 0)}
                    className={inputClass}
                  />
                  <select
                    value={currentBranchPricing.discountType}
                    onChange={(e) => updateBranchPricing('Main Branch', 'discountType', e.target.value)}
                    className={inputClass}
                  >
                    <option>Value</option>
                    <option>Percentage</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Sales Tax
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={currentBranchPricing.salesTax}
                    onChange={(e) => updateBranchPricing('Main Branch', 'salesTax', parseFloat(e.target.value) || 0)}
                    className={inputClass}
                  />
                  <select
                    value={currentBranchPricing.salesTaxType}
                    onChange={(e) => updateBranchPricing('Main Branch', 'salesTaxType', e.target.value)}
                    className={inputClass}
                  >
                    <option>Value</option>
                    <option>Percentage</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Variant Pricing */}
      {formData.variantPricing && formData.variantPricing.length > 0 && (
        <div className={`rounded-xl border p-6 ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}>
          <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Variant Pricing
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <th className="px-4 py-3 text-sm font-semibold">Variant</th>
                  <th className="px-4 py-3 text-sm font-semibold">Cost Price</th>
                  <th className="px-4 py-3 text-sm font-semibold">Retail Price</th>
                </tr>
              </thead>
              <tbody>
                {formData.variantPricing.map((variant) => (
                  <tr key={variant.variantName} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium">{variant.variantName}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={variant.costPrice}
                        onChange={(e) => updateVariantPricing(variant.variantName, 'costPrice', parseFloat(e.target.value) || 0)}
                        className={inputClass}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={variant.retailPrice}
                        onChange={(e) => updateVariantPricing(variant.variantName, 'retailPrice', parseFloat(e.target.value) || 0)}
                        className={inputClass}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors && (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{errors}</p>
        </div>
      )}

      {/* Navigation */}
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
          onClick={validateAndProceed}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Next: Summary
        </button>
      </div>
    </div>
  );
};
