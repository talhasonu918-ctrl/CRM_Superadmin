import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Select } from 'rizzui';
import { User } from '../../../../../hooks/useInfiniteTable';
import { ImageUpload } from '../../../../../components/ImageUpload';
import { getThemeColors } from '../../../../../theme/colors';
import { ChevronDown, X } from 'lucide-react';

interface EditUserFormProps {
  initialData: Partial<User>;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}






export const EditUserForm: React.FC<EditUserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const { control, handleSubmit, reset } = useForm<Partial<User>>({
    defaultValues: initialData,
  });

  React.useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-y-5 gap-x-5">
        {/* First Name */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>First Name *</label>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter first name"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error
                    ? theme.status.error.border
                    : `${theme.border.input} focus:border-orange-500`
                    }`}
                />
                {fieldState.error && (
                  <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Last Name *</label>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter last name"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error
                    ? theme.status.error.border
                    : `${theme.border.input} focus:border-orange-500`
                    }`}
                />
                {fieldState.error && (
                  <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Email */}
        <div className="col-span-2">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Email *</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Invalid email address',
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="email"
                  placeholder="Enter email address"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error
                    ? theme.status.error.border
                    : `${theme.border.input} focus:border-orange-500`
                    }`}
                />
                {fieldState.error && (
                  <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Phone No */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Phone No *</label>
          <Controller
            name="contact"
            control={control}
            rules={{ required: 'Phone number is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter phone number"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error
                    ? theme.status.error.border
                    : `${theme.border.input} focus:border-orange-500`
                    }`}
                />
                {fieldState.error && (
                  <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* CNIC */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>CNIC *</label>
          <Controller
            name="cnic"
            control={control}
            rules={{ required: 'CNIC is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter CNIC"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error
                    ? theme.status.error.border
                    : `${theme.border.input} focus:border-orange-500`
                    }`}
                />
                {fieldState.error && (
                  <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Gender */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Gender *</label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'Gender is required' }}
            render={({ field, fieldState }) => (
              <>
                {/* <Select
                  options={genderOptions}
                  placeholder="Select gender"
                  {...field}
                  inPortal={false}
                  className="w-full max-w-xs"
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
                /> */}
                {fieldState.error && (
                  <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>



        {/* Profile Picture */}
        <div className="col-span-2">
          <ImageUpload
            name="avatar"
            control={control}
            label="Profile Picture"
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={`border h-10 rounded-lg ${theme.button.secondary}`}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          className={`h-10 rounded-lg ${theme.button.primary}`}
        >
          Update User
        </Button>
      </div>
    </form>
  );
};
