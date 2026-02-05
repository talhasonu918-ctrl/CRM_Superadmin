import React, { useState } from 'react';
import { Modal } from '../../../../components/Modal';
import { getThemeColors } from '../../../../theme/colors';

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  isDarkMode?: boolean;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
  isDarkMode = false
}) => {
  const theme = getThemeColors(isDarkMode);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [errors, setErrors] = useState({ name: '', phone: '' });

  const handleSubmit = () => {
    // Validate inputs
    const newErrors = { name: '', phone: '' };

    if (!customerName.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (customerPhone.trim() && !/^\+?[0-9\s-]{10,}$/.test(customerPhone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);

    // Only proceed if no errors
    if (!newErrors.name && !newErrors.phone) {
      onAddCustomer({
        name: customerName,
        phone: customerPhone,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setCustomerName('');
    setCustomerPhone('');
    setErrors({ name: '', phone: '' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Customer"
      isDarkMode={isDarkMode}
    >
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.secondary}`}>
            Customer Name <span className={theme.status.error.main}>*</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter customer name"
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-sm transition-all ${errors.name
              ? `${theme.status.error.border} focus:ring-red-500`
              : `${theme.border.input} ${theme.primary.focus} ${theme.primary.ring}`
              } ${theme.input.background} ${theme.input.text} ${theme.input.placeholder}`}
          />
          {errors.name && <p className={`${theme.status.error.main} text-xs mt-1`}>{errors.name}</p>}
        </div>
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.secondary}`}>
            Phone Number
          </label>
          <input
            type="text"
            value={customerPhone}
            onChange={(e) => {
              setCustomerPhone(e.target.value);
              if (errors.phone) setErrors({ ...errors, phone: '' });
            }}
            placeholder="+92 300 1234567"
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-sm transition-all ${errors.phone
              ? `${theme.status.error.border} focus:ring-red-500`
              : `${theme.border.input} ${theme.primary.focus} ${theme.primary.ring}`
              } ${theme.input.background} ${theme.input.text} ${theme.input.placeholder}`}
          />
          {errors.phone && <p className={`${theme.status.error.main} text-xs mt-1`}>{errors.phone}</p>}
        </div>
        <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
          <button
            onClick={handleClose}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all font-medium text-sm ${theme.button.secondary}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all font-medium text-sm ${theme.button.primary}`}
          >
            Add Customer
          </button>
        </div>
      </div>
    </Modal>
  );
};
