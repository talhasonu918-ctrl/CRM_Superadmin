import React, { useState } from 'react';
import { ProductFormData } from '../product-types';
import { showToast } from '../utils/toastUtils';

interface ProductBasicInfoProps {
  formData: ProductFormData;
  onUpdateFormData: (data: Partial<ProductFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  formData,
  onUpdateFormData,
  onNext,
  isDarkMode,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndProceed = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Product Name is required';
    }
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ProductFormData) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size exceeds 5MB limit');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdateFormData({ [fieldName]: base64String });
        showToast('Image uploaded successfully!', '🖼️');
      };
      reader.readAsDataURL(file);
    }
  };
  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
    }`;

  const labelClass = `block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div className="space-y-6">
      {/* Product Basic Information Card */}
      <div className={`rounded-xl border p-6 ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Product Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Name */}
          <div>
            <label className={labelClass}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter the Product Name"
              value={formData.name || ''}
              onChange={(e) => {
                onUpdateFormData({ name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Bar Code */}
          {/* <div>
            <label className={labelClass}>Bar Code</label>
            <input
              type="text"
              placeholder="Enter bar code"
              value={formData.barCode || ''}
              onChange={(e) => onUpdateFormData({ barCode: e.target.value })}
              className={inputClass}
            />
          </div> */}

          {/* Generic Name */}
          {/* <div>
            <label className={labelClass}>Generic Name</label>
            <input
              type="text"
              placeholder="Enter generic name"
              value={formData.genericName || ''}
              onChange={(e) => onUpdateFormData({ genericName: e.target.value })}
              className={inputClass}
            />
          </div> */}

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              placeholder="Enter description"
              value={formData.description || ''}
              onChange={(e) => onUpdateFormData({ description: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* PCT Code */}
          {/* <div>
            <label className={labelClass}>PCT Code</label>
            <input
              type="text"
              placeholder="Enter PCT code"
              value={formData.pctCode || ''}
              onChange={(e) => onUpdateFormData({ pctCode: e.target.value })}
              className={inputClass}
            />
          </div> */}

          {/* Category */}
          <div>
            <label className={labelClass}>
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="PIZZA"
              value={formData.category || ''}
              onChange={(e) => {
                onUpdateFormData({ category: e.target.value });
                if (errors.category) {
                  setErrors({ ...errors, category: '' });
                }
              }}
              className={`${inputClass} ${errors.category ? 'border-red-500' : ''}`}
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Sub Category */}
          <div>
            <label className={labelClass}>Sub Category</label>
            <input
              type="text"
              placeholder="SPECIAL"
              value={formData.subCategory || ''}
              onChange={(e) => onUpdateFormData({ subCategory: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Racks */}
          {/* <div>
            <label className={labelClass}>Racks</label>
            <input
              type="text"
              placeholder="Racks"
              value={formData.racks || ''}
              onChange={(e) => onUpdateFormData({ racks: e.target.value })}
              className={inputClass}
            />
          </div> */}

          {/* Supplier */}
          {/* <div>
            <label className={labelClass}>Supplier</label>
            <input
              type="text"
              placeholder="Enter supplier"
              value={formData.supplier || ''}
              onChange={(e) => onUpdateFormData({ supplier: e.target.value })}
              className={inputClass}
            />
          </div> */}

          {/* Manufacturer */}
          <div>
            <label className={labelClass}>Manufacturer</label>
            <input
              type="text"
              placeholder="Enter manufacturer"
              value={formData.manufacturer || ''}
              onChange={(e) => onUpdateFormData({ manufacturer: e.target.value })}
              className={inputClass}
            />
          </div>
          {/* Product Type  at drop down on it  */}
          {/* <div>
            <label className={labelClass}>Product Type</label>
            <input
              type="text"
              placeholder="Menu"
              value={formData.productType || 'Menu'}
              onChange={(e) => onUpdateFormData({ productType: e.target.value })}
              className={inputClass}
            />
          </div> */}

          {/* Assigned Branches */}
          {/* <div>
            <label className={labelClass}>Assigned Branches</label>
            <input
              type="text"
              placeholder="Main Branch"
              value={formData.assignedBranches?.join(', ') || ''}
              onChange={(e) => onUpdateFormData({ assignedBranches: e.target.value.split(',').map(b => b.trim()) })}
              className={inputClass}
            />
          </div> */}
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-6 mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showOnPos || false}
              onChange={(e) => onUpdateFormData({ showOnPos: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Show on Pos
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAutoReady || false}
              onChange={(e) => onUpdateFormData({ isAutoReady: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Is Auto Ready
            </span>
          </label>
        </div>

        {/* Image Upload */}
        <div className="mt-6">
          <label className={labelClass}>Select Product Image</label>
          <div className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDarkMode
            ? 'border-slate-700 hover:border-purple-500 bg-slate-800'
            : 'border-slate-300 hover:border-purple-500 bg-slate-50'
            }`}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'productImage')}
              className="hidden"
              id="product-image-upload"
            />
            <label htmlFor="product-image-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2">
              {formData.productImage ? (
                <div className="relative w-full h-40">
                  <img
                    src={formData.productImage}
                    alt="Product Preview"
                    className="w-full h-full object-contain rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                    <span className="text-white text-xs">Click to change</span>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Click to upload product image
                  </span>
                </div>
              )}
            </label>
          </div>
          {formData.productImage && (
            <button
              onClick={() => onUpdateFormData({ productImage: '' })}
              className="mt-2 text-xs text-red-500 hover:text-red-600 underline"
            >
              Remove Image
            </button>
          )}
        </div>
      </div>
      {/* Mobile / Web Configuration */}
      <div className={`rounded-xl border p-6 ${isDarkMode ? 'bg-[#16191F] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Mobile / Web Configuration
        </h3>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Summary</label>
            <textarea
              placeholder="Our signature pizza loaded with premium..."
              value={formData.summary || ''}
              onChange={(e) => onUpdateFormData({ summary: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Detail Description</label>
            <textarea
              placeholder="Enter detailed description"
              value={formData.detailDescription || ''}
              onChange={(e) => onUpdateFormData({ detailDescription: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showInMobileApp || false}
                onChange={(e) => onUpdateFormData({ showInMobileApp: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Show in Mobile App
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showInWebApp || false}
                onChange={(e) => onUpdateFormData({ showInWebApp: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Show in Web App
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={validateAndProceed}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Next: Add-Ons
        </button>
      </div>
    </div>
  );
};
