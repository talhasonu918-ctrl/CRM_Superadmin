import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { Category } from '../types';
import { getThemeColors } from '../../../../theme/colors';
import { CustomSelect, CustomSelectOption } from '../../../../components/CustomSelect';

// Extend Category type for form fields
type CategoryFormFields = Partial<Category> & {
  showOnMobile?: boolean;
  showOnWeb?: boolean;
  showOnPOS?: boolean;
  preparationTime?: string;
  branches?: string;
};

const branchOptions: CustomSelectOption[] = [
  { value: 'Main Branch', label: 'Main Branch' },
  { value: 'Lahore Branch', label: 'Lahore Branch' },
  { value: 'Multan Brnach', label: 'Multan Brnach' },
  { value: 'Islamabad Branch', label: 'Islamabad Branch' },
];

interface AddCategoryFormProps {
  onSubmit: (data: Partial<Category>) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

export const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const { control, handleSubmit, register, setValue } = useForm<CategoryFormFields>();
  const [subCategories, setSubCategories] = useState<string[]>(['', '', '']);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Synchronize with activeBranch from localStorage
  React.useEffect(() => {
    const activeBranch = localStorage.getItem('activeBranch');
    if (activeBranch) {
      setValue('branches', activeBranch);
    }
  }, [setValue]);

  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, '']);
  };

  const handleRemoveSubCategory = (index: number) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  const handleSubCategoryChange = (index: number, value: string) => {
    const newSubCategories = [...subCategories];
    newSubCategories[index] = value;
    setSubCategories(newSubCategories);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onFormSubmit = (data: Partial<Category>) => {
    // Filter out empty subcategories
    const filteredSubCategories = subCategories.filter(sub => sub.trim() !== '');

    // Combine form data with subcategories
    const formData = {
      ...data,
      subCategories: filteredSubCategories.join(', '),
      productImage: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Category Section */}
      <div>
        <h3 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Name */}
          <div>
            <Controller
              name="categoryName"
              control={control}
              rules={{ required: 'Category name is required' }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    placeholder="Category Name"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all text-sm ${isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                      } ${fieldState.error ? 'border-red-500' : ''
                      }`}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Preparation Time */}
          <div>
            <input
              {...register('preparationTime')}
              placeholder="Preparation Time"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all text-sm ${isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
            />
          </div>

          {/* Select Branches - Searchable Dropdown */}
          <div className="text-sm">
            <Controller
              name="branches"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={branchOptions}
                  value={branchOptions.find(opt => opt.value === field.value)}
                  onChange={(option) => field.onChange(option?.value)}
                  placeholder="Select Branches"
                  isDarkMode={isDarkMode}
                />
              )}
            />
          </div>

          {/* HS Code */}
          {/* <div>
            <input
              {...register('hsCode')}
              placeholder="HS Code"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div> */}
        </div>

        {/* Checkboxes Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Show On Mobile App */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showOnMobile"
              {...register('showOnMobile' as const)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
            <label htmlFor="showOnMobile" className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Show On Mobile App
            </label>
          </div>

          {/* Show On Web App */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showOnWeb"
              {...register('showOnWeb' as const)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
            <label htmlFor="showOnWeb" className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Show On Web App
            </label>
          </div>

          {/* File Upload */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="fileUpload"
              className={`px-4 py-2 border rounded-md cursor-pointer text-sm transition-colors ${isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
            >
              Choose file
            </label>
            <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </span>
          </div>
        </div>

        {/* Show On POS - Separate Row */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="showOnPOS"
            {...register('showOnPOS' as const)}
            defaultChecked
            className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
          />
          <label htmlFor="showOnPOS" className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Show On POS
          </label>
        </div>
      </div>

      {/* Sub Category Section */}
      <div>
        <h3 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Sub Category
        </h3>

        <div className="space-y-3">
          {subCategories.map((subCat, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={subCat}
                onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                placeholder="SubCategory Name"
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all text-sm ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
              />
              <button
                type="button"
                onClick={() => handleRemoveSubCategory(index)}
                className={`p-2 rounded-md transition-colors ${isDarkMode
                  ? 'hover:bg-slate-700 text-red-600 hover:text-red-400'
                  : 'hover:bg-slate-100 text-red-600 hover:text-red-500'
                  }`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSubCategory}
          className={`mt-3 px-4 py-2 border rounded-md text-sm font-medium transition-colors ${isDarkMode
            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
        >
          Add SubCategory
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className={`px-6 py-2 rounded-md font-medium transition-colors text-sm ${isDarkMode
            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
            }`}
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors text-sm"
        >
          Save Category
        </button>
      </div>
    </form>
  );
};
