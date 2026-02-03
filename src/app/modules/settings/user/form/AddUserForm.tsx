import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import Select from 'react-select';
import { User } from '../../../../../hooks/useInfiniteTable';
import { ImageUpload } from '../../../../../components/ImageUpload';
import { getThemeColors } from '../../../../../theme/colors';

interface AddUserFormProps {
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];



export const AddUserForm: React.FC<AddUserFormProps> = ({
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const { control, handleSubmit } = useForm<Partial<User>>();

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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    fieldState.error
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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    fieldState.error
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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    fieldState.error
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

        {/* Contact */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Contact *</label>
          <Controller
            name="contact"
            control={control}
            rules={{ required: 'Contact is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter contact number"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    fieldState.error
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
                <Select
                  {...field}
                  options={genderOptions}
                  value={genderOptions.find((opt) => opt.value === field.value)}
                  onChange={(opt) => field.onChange(opt?.value)}
                  classNamePrefix="custom-select"
                  placeholder="Select gender"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: fieldState.error ? '2px solid #ef4444' : '2px solid #d1d5db',
                      borderRadius: '0.5rem',
                      padding: '0.25rem',
                      '&:hover': { borderColor: '#f97316' },
                      '&:focus-within': {
                        borderColor: '#f97316',
                        boxShadow: '0 0 0 1px #f97316',
                      },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#f97316'
                        : state.isFocused
                        ? '#fed7aa'
                        : 'white',
                      color: state.isSelected ? 'white' : 'black',
                    }),
                  }}
                />
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
          Add User
        </Button>
      </div>
    </form>
  );
};
