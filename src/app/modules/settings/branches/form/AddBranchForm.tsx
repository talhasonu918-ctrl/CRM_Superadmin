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

// Define the option type explicitly
type StatusOption = { label: string; value: Branch['status'] };

const statusOptions: readonly StatusOption[] = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
] as const;

const getSelectStyles = (hasError?: boolean, theme?: any, isDarkMode?: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: isDarkMode ? theme?.neutral?.background : 'inherit',
    border: hasError
      ? `1px solid ${theme?.status?.error?.border || '#ef4444'}`
      : state.isFocused
        ? `1px solid ${theme?.border?.focus || '#f97316'}`
        : `1px solid ${theme?.border?.input || '#d1d5db'}`,
    borderRadius: '0.5rem',
    padding: '0.25rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: state.isFocused ? (theme?.border?.focus || '#f97316') : (theme?.border?.input || '#d1d5db'),
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: isDarkMode ? theme?.neutral?.backgroundSecondary : 'inherit',
    border: `1px solid ${theme?.border?.input || '#d1d5db'}`,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? theme?.primary?.main || '#f97316'
      : state.isFocused
        ? theme?.primary?.light || '#fed7aa'
        : 'transparent',
    color: state.isSelected ? theme?.text?.onPrimary || 'white' : theme?.text?.primary || 'inherit',
    cursor: 'pointer',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: theme?.text?.primary || 'inherit',
  }),
  input: (base: any) => ({
    ...base,
    color: theme?.text?.primary || 'inherit',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: theme?.text?.tertiary || '#94a3b8',
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
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
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
                  placeholder="Branch name"
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
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
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Manager ID
          </label>
          <Controller
            name="managerUserId"
            control={control}
            rules={{}}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Manager user ID"
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
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
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
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
                  placeholder="Phone number"
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
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
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Status
          </label>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field, fieldState }) => (
              <>
                <Select<StatusOption>
                  {...field}
                  options={statusOptions}
                  onChange={(opt) => field.onChange(opt?.value)}
                  value={statusOptions.find((opt) => opt.value === field.value)}
                  classNamePrefix="custom-select"
                  placeholder="Select status"
                  className={`w-full text-sm focus:ring-none focus:outline-none ${isDarkMode ? 'dark:text-white' : ''}`}
                  styles={getSelectStyles(!!fieldState.error, theme, isDarkMode)}
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
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
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
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} resize-none ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
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
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            City
          </label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="City"
                className={`w-full px-4 py-3 border  text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Country */}
        <div>
          <label className={`block text-sm  font-medium mb-2 ${theme.text.tertiary}`}>
            Country
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Country"
                className={`w-full px-4 py-3 border  text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Email */}
        <div>
          <label className={`block text-sm  font-medium mb-2 ${theme.text.tertiary}`}>
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
                className={`w-full px-4 py-3 border  text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Timezone */}
        <div>
          <label className={`block text-sm  font-medium mb-2 ${theme.text.tertiary}`}>
            Timezone
          </label>
          <Controller
            name="timezone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Timezone (e.g. America/New_York)"
                className={`w-full px-4 py-3 border  text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Lat */}
        <div>
          <label className={`block text-sm  font-medium mb-2 ${theme.text.tertiary}`}>
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
                className={`w-full px-4 py-3 border  text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>

        {/* Lng */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
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
                className={`w-full px-4 py-3 border  text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
              />
            )}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={`${theme.button.secondary} h-10 rounded-lg px-8`}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className={`${theme.button.primary} h-10 text-white rounded-lg px-8`}
        >
          Add Branch
        </Button>
      </div>
    </form>
  );
};
