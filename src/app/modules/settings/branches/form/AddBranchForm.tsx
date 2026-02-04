import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import Select from 'react-select';
import { Branch } from '../types';
import { getThemeColors } from '../../../../../theme/colors';

interface AddBranchFormProps {
  onSubmit: (data: Partial<Branch>) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
];

const getSelectStyles = (hasError?: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'inherit',
    border: hasError 
      ? '2px solid #ef4444' 
      : state.isFocused 
        ? '2px solid #f97316' 
        : '2px solid #d1d5db',
    borderRadius: '0.5rem',
    padding: '0.25rem',
    boxShadow: state.isFocused ? '0 0 0 1px #f97316' : 'none',
    '&:hover': {
      borderColor: '#f97316',
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: 'inherit',
    border: '1px solid #d1d5db',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#f97316'
      : state.isFocused
        ? '#fed7aa'
        : 'transparent',
    color: state.isSelected ? 'white' : 'inherit',
    cursor: 'pointer',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'inherit',
  }),
  input: (base: any) => ({
    ...base,
    color: 'inherit',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#9ca3af',
  }),
});

export const AddBranchForm: React.FC<AddBranchFormProps> = ({
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const { control, handleSubmit } = useForm<Partial<Branch>>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-y-5 gap-x-5">
        {/* Branch Name */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${theme.text.tertiary}`}>
            Branch Name
          </label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Branch name is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter branch name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${
                    fieldState.error
                      ? theme.status.error.border
                      : `${theme.border.input} focus:border-orange-500`
                  }`}
                />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Manager User ID */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${theme.text.tertiary}`}>
            Manager User ID
          </label>
          <Controller
            name="managerUserId"
            control={control}
            rules={{}}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter manager user ID"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${
                    fieldState.error
                      ? theme.status.error.border
                      : `${theme.border.input} focus:border-orange-500`
                  }`}
                />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${theme.text.tertiary}`}>
            Phone Number
          </label>
          <Controller
            name="phone"
            control={control}
            rules={{ 
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                message: 'Invalid phone number format',
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${
                    fieldState.error
                      ? theme.status.error.border
                      : `${theme.border.input} focus:border-orange-500`
                  }`}
                />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Status */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${theme.text.tertiary}`}>
            Status
          </label>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  {...field}
                  options={statusOptions}
                  value={statusOptions.find((opt) => opt.value === field.value)}
                  onChange={(opt) => field.onChange(opt?.value)}
                  classNamePrefix="custom-select"
                  placeholder="Select status"
                  className="dark:text-white"
                  styles={getSelectStyles(!!fieldState.error)}
                />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label className={`block text-sm font-semibold mb-2 ${theme.text.tertiary}`}>
            Address
          </label>
          <Controller
            name="address"
            control={control}
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState }) => (
              <>
                <textarea
                  {...field}
                  placeholder="Enter full address"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} resize-none ${
                    fieldState.error
                      ? theme.status.error.border
                      : `${theme.border.input} focus:border-orange-500`
                  }`}
                />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* City */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${theme.text.tertiary}`}>
            City
          </label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
                <input
                {...field}
                placeholder="City"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Country */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${theme.text.tertiary}`}>
            Country
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
                <input
                {...field}
                placeholder="Country"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Email */}
        <div>
          <label className={`block text-[10px] font-extrabold uppercase tracking-widest mb-2 ${theme.text.tertiary}`}>
            Email
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="email@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Timezone */}
        <div>
          <label className={`block text-[10px] font-extrabold uppercase tracking-widest mb-2 ${theme.text.tertiary}`}>
            Timezone
          </label>
          <Controller
            name="timezone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Timezone (e.g. America/New_York)"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Lat */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${theme.text.tertiary}`}>
            Lat
          </label>
          <Controller
            name="lat"
            control={control}
            render={({ field }) => (
                <input
                {...field}
                type="number"
                step="any"
                placeholder="Latitude"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Lng */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${theme.text.tertiary}`}>
            Lng
          </label>
          <Controller
            name="lng"
            control={control}
            render={({ field }) => (
                <input
                {...field}
                type="number"
                step="any"
                placeholder="Longitude"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          className={`${theme.button.primary} h-10 text-white rounded-lg px-8`}
        >
          Add Branch
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={`${theme.button.secondary} h-10 rounded-lg px-8`}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
