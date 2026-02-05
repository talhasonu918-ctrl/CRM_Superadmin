import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import Select from 'react-select';
import { PracticeSetting } from '../types';
import { getThemeColors, primaryColors, statusColors, neutralColors } from '../../../../../theme/colors';

interface PracticeSettingFormProps {
  initialData?: Partial<PracticeSetting>;
  onSubmit: (data: Partial<PracticeSetting>) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
  isDarkMode?: boolean;
}

const timezoneOptions = [
  { label: 'EST (Eastern Standard Time)', value: 'EST (Eastern Standard Time)' },
  { label: 'CST (Central Standard Time)', value: 'CST (Central Standard Time)' },
  { label: 'PST (Pacific Standard Time)', value: 'PST (Pacific Standard Time)' },
  { label: 'MST (Mountain Standard Time)', value: 'MST (Mountain Standard Time)' },
];

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

export const PracticeSettingForm: React.FC<PracticeSettingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const { control, handleSubmit, reset } = useForm<Partial<PracticeSetting>>({
    defaultValues: initialData || {},
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-y-5 gap-x-5">
        {/* Practice Name */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Practice Name
          </label>
          <Controller
            name="practiceName"
            control={control}
            rules={{ required: 'Practice name is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter practice name"
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${fieldState.error
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

        {/* Contact Email */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Contact Email
          </label>
          <Controller
            name="contactEmail"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="email"
                  placeholder="admin@example.com"
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${fieldState.error
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
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Phone Number
          </label>
          <Controller
            name="phoneNumber"
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
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${fieldState.error
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

        {/* Timezone */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Timezone
          </label>
          <Controller
            name="timezone"
            control={control}
            rules={{ required: 'Timezone is required' }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  {...field}
                  options={timezoneOptions}
                  value={timezoneOptions.find((opt) => opt.value === field.value)}
                  onChange={(opt) => field.onChange(opt?.value)}
                  classNamePrefix="custom-select"
                  placeholder="Select timezone"
                  className="text-sm"
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
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors resize-none ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${fieldState.error
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
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className={`${theme.button.secondary} h-10 rounded-lg px-8`}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className={`${theme.button.primary} h-10 text-white rounded-lg px-8`}
        >
          {isEditMode ? 'Update Settings' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
