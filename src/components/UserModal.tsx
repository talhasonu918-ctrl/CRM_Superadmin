import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Modal,
  Button,
  Title,
  ActionIcon,
} from 'rizzui';
import { XMarkIcon } from '@heroicons/react/20/solid';
import Select from 'react-select';
import { User } from '../hooks/useInfiniteTable';
import { ImageUpload } from './ImageUpload';
import { getThemeColors } from '../theme/colors';

interface UserModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  initialData?: Partial<User>;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => void;
  onModeChange?: (newMode: 'add' | 'edit' | 'view') => void;
  isDarkMode?: boolean;
}

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];
const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Suspended', value: 'Suspended' },
];
const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Staff', value: 'Staff' },
  { label: 'Driver', value: 'Driver' },
];

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  mode,
  initialData = {},
  onClose,
  onSubmit,
  onModeChange,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const isView = mode === 'view';
  const { control, handleSubmit, reset } = useForm<Partial<User>>({
    defaultValues: initialData,
  });

  React.useEffect(() => {
    reset(initialData);
  }, [initialData, isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={`m-auto px-7 pt-6 pb-8 rounded-lg w-full ${theme.neutral.background}`}>
        <div className="mb-7 flex items-center justify-between">
          <Title as="h3">
            {mode === 'add' ? 'Add User' : mode === 'edit' ? 'Update User' : 'View User'}
          </Title>
          <ActionIcon size="sm" variant="text" onClick={onClose}>
            <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
          </ActionIcon>
        </div>
        {mode === 'view' ? (
          <div>
            <div className="text-center mb-6">
              <img
                src={initialData.avatar || '/default-avatar.png'}
                alt="Profile Picture"
                className={`w-32 h-32 rounded-full mx-auto cursor-pointer border-2 ${theme.border.input}`}
                onClick={() => onModeChange?.('edit')}
              />
              <p className={`text-sm mt-2 ${theme.text.tertiary}`}>Click to edit</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text.primary}`}>First Name</label>
                  <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary}`}>{initialData.firstName || ''}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.text.primary}`}>Last Name</label>
                  <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary}`}>{initialData.lastName || ''}</p>
                </div>
                <div className='flex gap-5 col-span-3'>
                    <div>
                  <label className={`block text-sm font-medium ${theme.text.primary}`}>Email</label>
                  <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary}`}>{initialData.email || ''}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.text.primary}`}>Contact</label>
                  <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary}`}>{initialData.contact || ''}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.text.primary}`}>Gender</label>
                  <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary}`}>{initialData.gender || ''}</p>
                </div>
                </div>
               
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className={`border h-10 rounded-lg ${theme.button.secondary}`}>
                Close
              </Button>
              <Button type="button" onClick={() => onModeChange?.('edit')} className={`h-10 rounded-lg ${theme.button.primary}`}>
                Edit
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-y-6 gap-x-5">
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
                      disabled={isView}
                      placeholder="First Name"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${fieldState.error ? theme.status.error.border : `${theme.border.input} focus:border-orange-500`}`}
                    />
                    {fieldState.error && <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
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
                      disabled={isView}
                      placeholder="Last Name"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${fieldState.error ? theme.status.error.border : `${theme.border.input} focus:border-orange-500`}`}
                    />
                    {fieldState.error && <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
            
          <div className='flex col-span-3 gap-4'>
              <div>
              <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Email *</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      {...field}
                      disabled={isView}
                      placeholder="Email"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${fieldState.error ? theme.status.error.border : `${theme.border.input} focus:border-orange-500`}`}
                    />
                    {fieldState.error && <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
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
                      disabled={isView}
                      placeholder="Contact"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${fieldState.error ? theme.status.error.border : `${theme.border.input} focus:border-orange-500`}`}
                    />
                    {fieldState.error && <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Gender *</label>
              <Controller
                name="gender"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      isDisabled={isView}
                      options={genderOptions}
                      value={genderOptions.find(opt => opt.value === field.value)}
                      onChange={opt => field.onChange(opt?.value)}
                      classNamePrefix="custom-select"
                      placeholder="Gender"
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: fieldState.error ? '2px solid #ef4444' : '2px solid #d1d5db',
                          borderRadius: '0.5rem',
                          padding: '0.25rem',
                          '&:hover': { borderColor: '#f97316' },
                          '&:focus-within': { borderColor: '#f97316', boxShadow: '0 0 0 1px #f97316' },
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected ? '#f97316' : state.isFocused ? '#fed7aa' : 'white',
                          color: state.isSelected ? 'white' : 'black',
                        }),
                      }}
                    />
                    {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
          </div>
          
          
            <div className="col-span-2 ">
              <ImageUpload
                name="avatar"
                control={control}
                disabled={isView}
                label="Profile Picture"
                isDarkMode={isDarkMode}
              />
            </div>
          
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className={`border h-10 rounded-lg ${theme.button.secondary}`}>
              Cancel
            </Button>
            {!isView && (
              <Button type="submit" size="lg" className={`h-10 rounded-lg ${theme.button.primary}`}>
                {mode === 'add' ? 'Add' : 'Update'}
              </Button>
            )}
          </div>
        </form>
        )}
      </div>
    </Modal>
  );
};
