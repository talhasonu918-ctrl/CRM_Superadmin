import React, { useState } from 'react';
import { ReusableModal } from '../../../../components/ReusableModal';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
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
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [errors, setErrors] = useState({ name: '', phone: '', address: '' });

  const handleSubmit = () => {
    // Validate inputs
    const newErrors = { name: '', phone: '', address: '' };

    if (!customerName.trim()) {
      newErrors.name = 'Customer name is required';
    }
    if (customerPhone.trim() && !/^\+?[0-9\s-]{10,}$/.test(customerPhone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);

    // Only proceed if no errors
    if (!newErrors.name && !newErrors.phone && !newErrors.address) {
      onAddCustomer({
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setErrors({ name: '', phone: '', address: '' });
    onClose();
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Customer"
      isDarkMode={isDarkMode}
      size="lg"
    >
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-textSecondary">
            Customer Name <span className="text-error">*</span>
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
              ? 'border-error focus:ring-error/20'
              : 'border-border focus:ring-primary/20'
              } bg-surface text-textPrimary placeholder-textSecondary/50`}
          />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-textSecondary">
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
              ? 'border-error focus:ring-error/20'
              : 'border-border focus:ring-primary/20'
              } bg-surface text-textPrimary placeholder-textSecondary/50`}
          />
          {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-textSecondary">
            Delivery Address
          </label>
          <textarea
            value={customerAddress}
            onChange={(e) => {
              setCustomerAddress(e.target.value);
              if (errors.address) setErrors({ ...errors, address: '' });
            }}
            placeholder="House 123, Street 5, Model Town, Okara"
            rows={2}
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-sm transition-all resize-none ${errors.address
              ? 'border-error focus:ring-error/20'
              : 'border-border focus:ring-primary/20'
              } bg-surface text-textPrimary placeholder-textSecondary/50`}
          />
          {errors.address && <p className="text-error text-xs mt-1">{errors.address}</p>}
        </div>
        <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
          <button
            onClick={handleClose}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all font-medium text-sm bg-background border border-border text-textSecondary hover:bg-surface"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all font-medium text-sm bg-primary text-white hover:opacity-90"
          >
            Add Customer
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};
