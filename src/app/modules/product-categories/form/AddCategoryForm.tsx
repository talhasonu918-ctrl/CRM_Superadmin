import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import { Category } from '../types';
import { getThemeColors } from '../../../../theme/colors';

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
  const { control, handleSubmit } = useForm<Partial<Category>>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        {/* Category Name */}
        <div>
          <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Category Name *
          </label>
          <Controller
            name="categoryName"
            control={control}
            rules={{ required: 'Category name is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter category name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  } ${
                    fieldState.error ? 'border-red-500' : ''
                  }`}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Sub Categories */}
        <div>
          <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Sub Categories *
          </label>
          <Controller
            name="subCategories"
            control={control}
            rules={{ required: 'Sub categories are required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter sub categories (comma separated)"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  } ${
                    fieldState.error ? 'border-red-500' : ''
                  }`}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
            isDarkMode 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
        >
          Add Category
        </button>
      </div>
    </form>
  );
};
