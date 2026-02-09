import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Select } from 'rizzui';
import { PracticeSetting } from '../types';
import { getThemeColors } from '../../../../../theme/colors';
import { ChevronDown, X } from 'lucide-react';

interface PracticeSettingFormProps {
  initialData?: Partial<PracticeSetting>;
  onSubmit: (data: Partial<PracticeSetting>) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
  isDarkMode?: boolean;
}

const timezoneOptions = [
  { label: 'EST (Eastern Standard Time)', value: 'EST' },
  { label: 'CST (Central Standard Time)', value: 'CST' },
  { label: 'PST (Pacific Standard Time)', value: 'PST' },
  { label: 'MST (Mountain Standard Time)', value: 'MST' },
  { label: 'IST (Indian Standard Time)', value: 'IST' },
  { label: 'GMT (Greenwich Mean Time)', value: 'GMT' },
];

const currencyOptions = [
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'GBP - British Pound', value: 'GBP' },
  { label: 'INR - Indian Rupee', value: 'INR' },
  { label: 'CAD - Canadian Dollar', value: 'CAD' },
];

const localeOptions = [
  { label: 'en-US - English (United States)', value: 'en-US' },
  { label: 'en-GB - English (United Kingdom)', value: 'en-GB' },
  { label: 'en-IN - English (India)', value: 'en-IN' },
  { label: 'es-ES - Spanish (Spain)', value: 'es-ES' },
  { label: 'fr-FR - French (France)', value: 'fr-FR' },
];

const billingCycleOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
];


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

  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
      // Set initial logo preview if exists
      if (initialData.logo && typeof initialData.logo === 'string') {
        setLogoPreview(initialData.logo);
      }
    }
  }, [initialData, reset]);

  const handleLogoChange = (file: File | null, onChange: (value: any) => void) => {
    if (file) {
      onChange(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange(null);
      setLogoPreview(null);
    }
  };

  const inputClass = (hasError?: boolean) => `w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${hasError ? theme.status.error.border : `${theme.border.input} focus:border-orange-500`
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <div>
        <h3 className={`text-base font-semibold mb-4 pb-2 border-b ${theme.text.primary} ${theme.border.main}`}>
          Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-5">
          {/* Organization Name */}
          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Organization Name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="practiceName"
              control={control}
              rules={{ required: 'Organization name is required' }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    placeholder="Enter organization name"
                    className={inputClass(!!fieldState.error)}
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Logo Upload */}
          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Organization Logo
            </label>
            <Controller
              name="logo"
              control={control}
              render={({ field: { onChange, value, ...field }, fieldState }) => (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        {...field}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoChange(e.target.files?.[0] || null, onChange)}
                        className={inputClass(!!fieldState.error)}
                      />
                    </div>
                    {logoPreview && (
                      <div className={`flex-shrink-0 w-24 h-24 border rounded-lg overflow-hidden ${theme.border.main}`}>
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Currency */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Currency <span className="text-red-500">*</span>
            </label>
            <Controller
              name="currency"
              control={control}
              rules={{ required: 'Currency is required' }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={currencyOptions}
                    placeholder="Select currency"
                    className="text-sm"
                    inPortal={false}
                    selectClassName={`!h-11 !border ${theme.border.input} rounded-lg focus:!border-orange-500 [&_svg.chevron]:aria-expanded:rotate-180`}
                    optionClassName={`hover:bg-orange-500/20 transition-colors rounded-lg`}
                    dropdownClassName="!w-full !h-auto !max-h-[260px]"
                    suffix={
                      <div className="flex items-center gap-2 pr-1">
                        {field.value && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange('');
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                          </button>
                        )}
                        <ChevronDown size={18} className="text-gray-400 transition-transform duration-200 chevron" />
                      </div>
                    }
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
              Timezone <span className="text-red-500">*</span>
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
                    placeholder="Select timezone"
                    className="text-sm w-full max-w-sm"
                    inPortal={false}
                    selectClassName={`!h-11 !border ${theme.border.input} rounded-lg focus:!border-orange-500 [&_svg.chevron]:aria-expanded:rotate-180`}
                    optionClassName={`hover:bg-orange-500/20 transition-colors rounded-lg`}
                    dropdownClassName="!w-full !h-auto !max-h-[260px]"
                    suffix={
                      <div className="flex items-center gap-2 pr-1">
                        {field.value && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange('');
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                          </button>
                        )}
                        <ChevronDown size={18} className="text-gray-400 transition-transform duration-200 chevron" />
                      </div>
                    }
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Locale */}
          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Locale <span className="text-red-500">*</span>
            </label>
            <Controller
              name="locale"
              control={control}
              rules={{ required: 'Locale is required' }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={localeOptions}
                    placeholder="Select locale (e.g., en-US)"
                    className="text-sm w-full max-w-sm"
                    inPortal={false}
                    selectClassName={`!h-11 !border ${theme.border.input} rounded-lg focus:!border-orange-500 [&_svg.chevron]:aria-expanded:rotate-180`}
                    optionClassName={`hover:bg-orange-500/20 transition-colors rounded-lg`}
                    dropdownClassName="!w-full !h-auto !max-h-[260px]"
                    suffix={
                      <div className="flex items-center gap-2 pr-1">
                        {field.value && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange('');
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                          </button>
                        )}
                        <ChevronDown size={18} className="text-gray-400 transition-transform duration-200 chevron" />
                      </div>
                    }
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Subscription Details Section */}
      <div>
        <h3 className={`text-base font-semibold mb-4 pb-2 border-b ${theme.text.primary} ${theme.border.main}`}>
          Subscription Details
        </h3>
        <div className="grid grid-cols-2 gap-5">
          {/* Plan Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Plan Name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="planName"
              control={control}
              rules={{ required: 'Plan name is required' }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    placeholder="e.g., Premium, Enterprise"
                    className={inputClass(!!fieldState.error)}
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Billing Cycle */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Billing Cycle <span className="text-red-500">*</span>
            </label>
            <Controller
              name="billingCycle"
              control={control}
              rules={{ required: 'Billing cycle is required' }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={billingCycleOptions}
                    placeholder="Select billing cycle"
                    className="text-sm w-full max-w-sm"
                    inPortal={false}
                    selectClassName={`!h-11 !border ${theme.border.input} rounded-lg focus:!border-orange-500 [&_svg.chevron]:aria-expanded:rotate-180`}
                    optionClassName={`hover:bg-orange-500/20 transition-colors rounded-lg`}
                    dropdownClassName="!w-full !h-auto !max-h-[260px]"
                    suffix={
                      <div className="flex items-center gap-2 pr-1">
                        {field.value && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange('');
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                          </button>
                        )}
                        <ChevronDown size={18} className="text-gray-400 transition-transform duration-200 chevron" />
                      </div>
                    }
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Start Date <span className="text-red-500">*</span>
            </label>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start date is required' }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="date"
                    className={inputClass(!!fieldState.error)}
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* End Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              End Date <span className="text-red-500">*</span>
            </label>
            <Controller
              name="endDate"
              control={control}
              rules={{ required: 'End date is required' }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="date"
                    className={inputClass(!!fieldState.error)}
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Business Settings Section */}
      <div>
        <h3 className={`text-base font-semibold mb-4 pb-2 border-b ${theme.text.primary} ${theme.border.main}`}>
          Business Settings
        </h3>
        <div className="grid grid-cols-2 gap-5">
          {/* Default Tax Percentage */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Default Tax (%) <span className="text-red-500">*</span>
            </label>
            <Controller
              name="defaultTaxPercentage"
              control={control}
              rules={{
                required: 'Tax percentage is required',
                min: { value: 0, message: 'Must be at least 0' },
                max: { value: 100, message: 'Must be at most 100' },
              }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="e.g., 18.00"
                    className={inputClass(!!fieldState.error)}
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Service Charge Percentage */}
          <div>
            <label className={`block text-xs font-medium mb-2 ${theme.text.tertiary}`}>
              Service Charge (%) <span className="text-red-500">*</span>
            </label>
            <Controller
              name="serviceChargePercentage"
              control={control}
              rules={{
                required: 'Service charge is required',
                min: { value: 0, message: 'Must be at least 0' },
                max: { value: 100, message: 'Must be at most 100' },
              }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="e.g., 10.00"
                    className={inputClass(!!fieldState.error)}
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Minimum Order Value */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Minimum Order Value <span className="text-red-500">*</span>
            </label>
            <Controller
              name="minimumOrderValue"
              control={control}
              rules={{
                required: 'Minimum order value is required',
                min: { value: 0, message: 'Must be at least 0' },
              }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="e.g., 100.00"
                    className={inputClass(!!fieldState.error)}
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Base Delivery Charges */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
              Base Delivery Charges <span className="text-red-500">*</span>
            </label>
            <Controller
              name="baseDeliveryCharges"
              control={control}
              rules={{
                required: 'Base delivery charges is required',
                min: { value: 0, message: 'Must be at least 0' },
              }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="e.g., 50.00"
                    className={inputClass(!!fieldState.error)}
                  />
                  {fieldState.error && (
                    <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t" style={{ borderColor: theme.border.main }}>
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
