import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { mockProducts, categories, mockTables } from '../mockData';
import { Search, ShoppingCart, Plus, Minus, X, DollarSign, UserPlus, Trash2 } from 'lucide-react';
import { AddCustomerModal } from './AddCustomerModal';
import { getThemeColors } from '../../../../theme/colors';
import { sendToKitchen } from '../../../../utils/kitchenDisplay';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

interface POSViewProps {
  isDarkMode?: boolean;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Waiter {
  id: string;
  name: string;
}

export const POSView: React.FC<POSViewProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedWaiter, setSelectedWaiter] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [orderType, setOrderType] = useState<'DineIn' | 'TakeAway' | 'Delivery'>('DineIn');

  // Editable fields
  const [serviceChargePercent, setServiceChargePercent] = useState('');
  const [serviceChargeAmount, setServiceChargeAmount] = useState('');
  const [taxPercent, setTaxPercent] = useState('16');
  const [taxAmount, setTaxAmount] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cashback, setCashback] = useState(0);
  const [kotNote, setKotNote] = useState('');

  // Mock data for waiters and customers
  const [waiters] = useState<Waiter[]>([
    { id: 'w1', name: 'Ahmed Ali' },
    { id: 'w2', name: 'Sara Khan' },
    { id: 'w3', name: 'Hassan Raza' },
    { id: 'w4', name: 'Fatima Sheikh' },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'c1', name: 'Walk-in Customer', phone: '' },
    { id: 'c2', name: 'John Doe', phone: '+92 300 1234567' },
    { id: 'c3', name: 'Ali Ahmed', phone: '+92 321 9876543' },
  ]);

  // Get available tables
  const availableTables = mockTables.filter(table => table.status === 'available');

  // React Select options
  const tableOptions = availableTables.map(table => ({
    value: table.id,
    label: `${table.number} - ${table.capacity} seats`
  }));

  const waiterOptions = waiters.map(waiter => ({
    value: waiter.id,
    label: waiter.name
  }));

  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: customer.name
  }));

  const paymentModeOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'UPI', label: 'UPI' },
    { value: 'Bank Transfer', label: 'Bank Transfer' }
  ];

  const handleAddCustomer = (customerData: { name: string; phone: string }) => {
    const newCustomer: Customer = {
      id: `c${customers.length + 1}`,
      name: customerData.name,
      phone: customerData.phone,
    };
    setCustomers([...customers, newCustomer]);
    setSelectedCustomer(newCustomer.id);
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const calculateTotals = () => {
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Convert string values to numbers, defaulting to 0 if empty
    const serviceChargePercentNum = serviceChargePercent ? parseFloat(serviceChargePercent) : 0;
    const serviceChargeAmountNum = serviceChargeAmount ? parseFloat(serviceChargeAmount) : 0;
    const taxPercentNum = taxPercent ? parseFloat(taxPercent) : 0;
    const taxAmountNum = taxAmount ? parseFloat(taxAmount) : 0;
    const discountPercentNum = discountPercent ? parseFloat(discountPercent) : 0;
    const discountAmountNum = discountAmount ? parseFloat(discountAmount) : 0;
    const paymentAmountNum = paymentAmount ? parseFloat(paymentAmount) : 0;

    // Calculate service charge
    const calculatedServiceCharge = serviceChargePercentNum > 0
      ? (subtotal * serviceChargePercentNum) / 100
      : serviceChargeAmountNum;

    // Calculate discount
    const calculatedDiscount = discountPercentNum > 0
      ? (subtotal * discountPercentNum) / 100
      : discountAmountNum;

    // Calculate tax on subtotal + service charge - discount
    const taxableAmount = subtotal + calculatedServiceCharge - calculatedDiscount;
    const calculatedTax = taxPercentNum > 0
      ? (taxableAmount * taxPercentNum) / 100
      : taxAmountNum;

    const total = subtotal + calculatedServiceCharge - calculatedDiscount + calculatedTax;
    const calculatedCashback = paymentAmountNum > total ? paymentAmountNum - total : 0;

    return {
      itemsCount,
      subtotal,
      serviceCharge: calculatedServiceCharge,
      discount: calculatedDiscount,
      tax: calculatedTax,
      total,
      cashback: calculatedCashback
    };
  };

  const handleSendToKitchen = () => {
    if (cart.length === 0) {
      toast.error('Please add items to cart before sending to kitchen', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }

    const selectedTableData = availableTables.find(t => t.id === selectedTable?.value);
    const selectedWaiterData = waiters.find(w => w.id === selectedWaiter?.value);
    const selectedCustomerData = customers.find(c => c.id === selectedCustomer?.value);

    const orderNumber = `# ${Math.floor(Math.random() * 900) + 100}`;
    const tableNumber = orderType === 'DineIn' && selectedTableData
      ? selectedTableData.number
      : `${orderType === 'TakeAway' ? 'TKA' : 'DEL'}-${Math.floor(Math.random() * 900 + 100)}`;

    sendToKitchen({
      orderNumber,
      tableNumber,
      orderType: orderType,
      waiterName: selectedWaiterData?.name || 'POS System',
      customerName: selectedCustomerData?.name,
      customerPhone: selectedCustomerData?.phone,
      items: cart.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        name: item.product.name,
        quantity: item.quantity,
        completed: false,
      })),
    });

    // Show success toast
    toast.success(`Order ${orderNumber} sent to Kitchen Display!`, {
      duration: 3000,
      position: 'top-right',
    });

    // Optional: Clear cart after sending
    // setCart([]);
  };

  const totals = calculateTotals();

  return (
    <div className={`flex flex-col lg:flex-row gap-4 lg:gap-0 ${theme.neutral.background}`}>
      {/* Left Section - Products */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pr-0">

        {/* Search */}
        <div className="relative mb-3 lg:mb-4 mt-2 lg:mt-3 px-2 flex-shrink-0">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
          <input
            type="text"
            placeholder="Search Product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none focus:ring-2 ${theme.primary.ring} transition-all ${theme.input.background} ${theme.border.input} ${theme.input.text}`}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-2 mb-3 lg:mb-4 overflow-x-auto scrollbar-hidden pb-2 flex-shrink-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 lg:px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex-shrink-0 text-sm ${selectedCategory === category
                  ? `${theme.primary.main} text-white`
                  : `${theme.neutral.card} ${theme.text.tertiary} ${theme.neutral.hover}`
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-thin overflow-x-hidden pb-4 pr-2 max-h-[400px] lg:max-h-[450px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 px-2 lg:gap-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className={`p-2 lg:p-3 rounded-lg border transition-all hover:shadow-lg ${theme.neutral.card} ${theme.border.secondary} hover:${theme.primary.border}`}
              >
                <div className={`aspect-square rounded-lg mb-2 flex items-center justify-center ${isDarkMode ? theme.neutral.card : theme.neutral.backgroundSecondary}`}>
                  <ShoppingCart className={theme.text.muted} size={24} />
                </div>
                <h3 className={`text-xs font-semibold mb-1 line-clamp-2 ${theme.text.primary}`}>
                  {product.name}
                </h3>
                <p className={`font-bold text-xs ${theme.primary.text}`}>
                  {product.price > 0 ? `₹${product.price.toFixed(2)}` : '₹0.00'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Cart */}
      <div className={`w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col border rounded-md max-h-[600px] lg:max-h-[450px] ${theme.border.main} ${theme.neutral.card} overflow-y-auto scrollbar-hidden`}>
        <div className="p-3 lg:p-4 flex flex-col h-full ">
          <h2 className={`text-lg lg:text-xl font-bold mb-3 lg:mb-4 flex items-center gap-2 flex-shrink-0 ${theme.text.primary}`}>
            <ShoppingCart size={20} className={`${theme.primary.text} lg:w-6 lg:h-6`} />
            {orderType === 'DineIn' ? 'DINE IN' : orderType === 'TakeAway' ? 'TAKE AWAY' : 'DELIVERY'}
          </h2>

          {/* Order Type Selector */}
          <div className="grid grid-cols-3 gap-2 mb-3 flex-shrink-0 ">
            <button
              onClick={() => setOrderType('DineIn')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${orderType === 'DineIn'
                  ? `${theme.primary.main} text-white`
                  : `${theme.neutral.card} ${theme.text.secondary} ${theme.primary.lightHover}`
                }`}
            >
              Dine In
            </button>
            <button
              onClick={() => setOrderType('TakeAway')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${orderType === 'TakeAway'
                  ? `${theme.primary.main} text-white`
                  : `${theme.neutral.card} ${theme.text.secondary} ${theme.primary.lightHover}`
                }`}
            >
              Take Away
            </button>
            <button
              onClick={() => setOrderType('Delivery')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${orderType === 'Delivery'
                  ? `${theme.primary.main} text-white`
                  : `${theme.neutral.card} ${theme.text.secondary} ${theme.primary.lightHover}`
                }`}
            >
              Delivery
            </button>
          </div>

          {/* Select Dropdowns */}
          <div className="space-y-2 lg:space-y-3 mb-3 lg:mb-4 flex-shrink-0">
            {orderType === 'DineIn' && (
              <div>
                <label className={`block text-xs font-medium mb-1 ${theme.text.secondary}`}>Table</label>
                <Select
                  value={selectedTable}
                  onChange={setSelectedTable}
                  options={tableOptions}
                  placeholder="Select Table"
                  className="text-sm"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: isDarkMode ? theme.raw.mode.background.card : '#ffffff',
                      borderColor: state.isFocused
                        ? theme.raw.primary[500]
                        : isDarkMode ? theme.raw.mode.border.secondary : '#d1d5db',
                      borderRadius: '0.5rem',
                      minHeight: '2.5rem',
                      boxShadow: state.isFocused ? `0 0 0 1px ${theme.raw.primary[500]}` : 'none',
                      '&:hover': {
                        borderColor: theme.raw.primary[500]
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? theme.raw.mode.background.card : '#ffffff',
                      border: `1px solid ${isDarkMode ? theme.raw.mode.border.secondary : '#d1d5db'}`,
                      borderRadius: '0.5rem'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? theme.raw.primary[500]
                        : state.isFocused
                          ? (isDarkMode ? theme.raw.mode.background.tertiary : '#f3f4f6')
                          : 'transparent',
                      color: state.isSelected
                        ? '#ffffff'
                        : isDarkMode ? theme.raw.mode.text.primary : '#111827',
                      '&:hover': {
                        backgroundColor: state.isSelected ? theme.raw.primary[500] : (isDarkMode ? theme.raw.mode.background.tertiary : '#f3f4f6')
                      }
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: isDarkMode ? theme.raw.mode.text.primary : '#111827'
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: isDarkMode ? theme.raw.mode.text.muted : '#6b7280'
                    }),
                    input: (base) => ({
                      ...base,
                      color: isDarkMode ? theme.raw.mode.text.primary : '#111827'
                    })
                  }}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${theme.text.secondary}`}>Waiter</label>
                <Select
                  value={selectedWaiter}
                  onChange={setSelectedWaiter}
                  options={waiterOptions}
                  placeholder="Select Waiter"
                  className="text-sm"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: isDarkMode ? theme.raw.mode.background.card : '#ffffff',
                      borderColor: state.isFocused
                        ? theme.raw.primary[500]
                        : isDarkMode ? theme.raw.mode.border.secondary : '#d1d5db',
                      borderRadius: '0.5rem',
                      minHeight: '2.5rem',
                      boxShadow: state.isFocused ? `0 0 0 1px ${theme.raw.primary[500]}` : 'none',
                      '&:hover': {
                        borderColor: theme.raw.primary[500]
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? theme.raw.mode.background.card : '#ffffff',
                      border: `1px solid ${isDarkMode ? theme.raw.mode.border.secondary : '#d1d5db'}`,
                      borderRadius: '0.5rem'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? theme.raw.primary[500]
                        : state.isFocused
                          ? (isDarkMode ? theme.raw.mode.background.tertiary : '#f3f4f6')
                          : 'transparent',
                      color: state.isSelected
                        ? '#ffffff'
                        : isDarkMode ? theme.raw.mode.text.primary : '#111827',
                      '&:hover': {
                        backgroundColor: state.isSelected ? theme.raw.primary[500] : (isDarkMode ? theme.raw.mode.background.tertiary : '#f3f4f6')
                      }
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: isDarkMode ? theme.raw.mode.text.primary : '#111827'
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: isDarkMode ? theme.raw.mode.text.muted : '#6b7280'
                    }),
                    input: (base) => ({
                      ...base,
                      color: isDarkMode ? theme.raw.mode.text.primary : '#111827'
                    })
                  }}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${theme.text.secondary}`}>Customer</label>
                <div className="relative">
                  <Select
                    value={selectedCustomer}
                    onChange={setSelectedCustomer}
                    options={customerOptions}
                    placeholder="Select Customer"
                    className="text-sm"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: isDarkMode ? theme.raw.mode.background.card : '#ffffff',
                        borderColor: state.isFocused
                          ? theme.raw.primary[500]
                          : isDarkMode ? theme.raw.mode.border.secondary : '#d1d5db',
                        borderRadius: '0.5rem',
                        minHeight: '2.5rem',
                        boxShadow: state.isFocused ? `0 0 0 1px ${theme.raw.primary[500]}` : 'none',
                        '&:hover': {
                          borderColor: theme.raw.primary[500]
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: isDarkMode ? theme.raw.mode.background.card : '#ffffff',
                        border: `1px solid ${isDarkMode ? theme.raw.mode.border.secondary : '#d1d5db'}`,
                        borderRadius: '0.5rem'
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? theme.raw.primary[500]
                          : state.isFocused
                            ? (isDarkMode ? theme.raw.mode.background.tertiary : '#f3f4f6')
                            : 'transparent',
                        color: state.isSelected
                          ? '#ffffff'
                          : isDarkMode ? theme.raw.mode.text.primary : '#111827',
                        '&:hover': {
                          backgroundColor: state.isSelected ? theme.raw.primary[500] : (isDarkMode ? theme.raw.mode.background.tertiary : '#f3f4f6')
                        }
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: isDarkMode ? theme.raw.mode.text.primary : '#111827'
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: isDarkMode ? theme.raw.mode.text.muted : '#6b7280'
                      }),
                      input: (base) => ({
                        ...base,
                        color: isDarkMode ? theme.raw.mode.text.primary : '#111827'
                      })
                    }}
                  />
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className={`absolute right-1  top-1/2 -translate-y-1/2 p-1 rounded ${theme.button.primary} transition-colors z-10`}
                    title="Add Customer"
                  >
                    <UserPlus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Modal */}
          <AddCustomerModal
            isOpen={showCustomerModal}
            onClose={() => setShowCustomerModal(false)}
            onAddCustomer={handleAddCustomer}
            isDarkMode={isDarkMode}
          />

          {/* Cart Header */}
          <div className={`grid grid-cols-4 gap-1 lg:gap-2 pb-2 border-b ${theme.border.secondary} mb-2 text-[10px] lg:text-xs font-semibold flex-shrink-0`}>
            <div className={theme.text.tertiary}>Items</div>
            <div className={`text-center ${theme.text.tertiary}`}>Quantity</div>
            <div className={`text-center ${theme.text.tertiary}`}>Disc</div>
            <div className={`text-right ${theme.text.tertiary}`}>Price</div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-3 lg:mb-4 scrollbar-hidden min-h-[100px]">
            {cart.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full ${theme.text.muted}`}>
                <ShoppingCart size={36} className="lg:w-12 lg:h-12 mb-2 opacity-50" />
                <p className="text-xs lg:text-sm">No Products in Cart</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className={`grid grid-cols-4 gap-1 lg:gap-2 py-2 lg:py-3 border-b ${theme.border.secondary} items-center`}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className={`p-0.5 hover:${theme.status.error.hover} rounded transition-colors`}
                      title="Remove item"
                    >
                      <X size={12} className={theme.status.error.main} />
                    </button>
                    <div className={`text-[10px] lg:text-xs ${theme.text.primary} truncate`}>{item.product.name}</div>
                  </div>
                  <div className="flex items-center justify-center gap-0.5 lg:gap-1">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded ${isDarkMode ? theme.neutral.card : theme.neutral.backgroundSecondary} hover:${theme.primary.main} hover:text-white transition-colors`}>
                      <Minus size={10} className="lg:w-3 lg:h-3" />
                    </button>
                    <span className={`w-6 lg:w-8 text-center text-xs lg:text-sm font-medium ${theme.text.primary}`}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded ${isDarkMode ? theme.neutral.card : theme.neutral.backgroundSecondary} hover:${theme.primary.main} hover:text-white transition-colors`}>
                      <Plus size={10} className="lg:w-3 lg:h-3" />
                    </button>
                  </div>
                  <div className={`text-center text-[10px] lg:text-xs ${theme.text.tertiary}`}>
                    <input
                      type="number"
                      className={`w-12 text-center bg-transparent border-0 outline-none ${theme.text.tertiary}`}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className={`text-right text-xs lg:text-sm font-semibold ${theme.text.primary}`}>
                    {(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          <div className={`space-y-2 pb-3 lg:pb-4 border-t ${theme.border.secondary} pt-3 lg:pt-4 flex-shrink-0`}>
            <div className="flex justify-between text-xs lg:text-sm">
              <span className={theme.text.tertiary}>Items Count: {totals.itemsCount}</span>
              <span className={`font-semibold ${theme.text.primary}`}>Subtotal: ₹{totals.subtotal.toFixed(2)}</span>
            </div>

            {/* Service Charge */}
            <div className="grid grid-cols-2 gap-2 text-[10px] lg:text-xs">
              <div>
                <label className={`${theme.text.tertiary} block mb-1`}>Sr Ch %</label>
                <input
                  type="number"
                  value={serviceChargePercent}
                  onChange={(e) => setServiceChargePercent(e.target.value)}
                  className={`w-full px-2 py-1 rounded border text-xs ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className={`${theme.text.tertiary} block mb-1`}>Sr Ch Amount</label>
                <input
                  type="number"
                  value={serviceChargeAmount}
                  onChange={(e) => setServiceChargeAmount(e.target.value)}
                  className={`w-full px-2 py-1 rounded border text-xs ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Tax */}
            <div className="grid grid-cols-2 gap-2 text-[10px] lg:text-xs">
              <div>
                <label className={`${theme.text.tertiary} block mb-1`}>Tax %</label>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  className={`w-full px-2 py-1 rounded border text-xs ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                  placeholder="16"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className={`${theme.text.tertiary} block mb-1`}>Tax Amount</label>
                <input
                  type="number"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                  className={`w-full px-2 py-1 rounded border text-xs ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Discount */}
            <div className="grid grid-cols-2 gap-2 text-[10px] lg:text-xs">
              <div>
                <label className={`${theme.text.tertiary} block mb-1`}>Dis %</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className={`w-full px-2 py-1 rounded border text-xs ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className={`${theme.text.tertiary} block mb-1`}>Dis Amount</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className={`w-full px-2 py-1 rounded border text-xs ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Calculated Values Display */}
            <div className={`text-xs space-y-1 pt-2 border-t ${theme.border.secondary}`}>
              <div className="flex justify-between">
                <span className={theme.text.tertiary}>Service Charge:</span>
                <span className={theme.text.primary}>₹{totals.serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.text.tertiary}>Tax:</span>
                <span className={theme.text.primary}>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.text.tertiary}>Discount:</span>
                <span className={theme.text.primary}>-₹{totals.discount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className={`${theme.primary.dark} text-white p-3 lg:p-4 rounded-lg mb-3 lg:mb-4 flex justify-between items-center flex-shrink-0`}>
            <span className="text-sm lg:text-base font-semibold">Grand Total</span>
            <span className="text-xl lg:text-2xl font-bold">PKR {totals.total.toFixed(2)}</span>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-1 gap-3 mb-3 lg:mb-4 text-xs lg:text-sm flex-shrink-0">
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme.text.secondary}`}>Payment Mode</label>
              <Select
                value={paymentModeOptions.find(option => option.value === paymentMode)}
                onChange={(option) => setPaymentMode(option?.value || 'Cash')}
                options={paymentModeOptions}
                className="text-sm"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: isDarkMode ? theme.raw.mode.background.card : '#ffffff',
                    borderColor: state.isFocused
                      ? theme.raw.primary[500]
                      : isDarkMode ? theme.raw.mode.border.secondary : '#d1d5db',
                    borderRadius: '0.5rem',
                    minHeight: '2.5rem',
                    boxShadow: state.isFocused ? `0 0 0 1px ${theme.raw.primary[500]}` : 'none',
                    '&:hover': {
                      borderColor: theme.raw.primary[500]
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: isDarkMode ? theme.raw.mode.background.card : '#ffffff',
                    border: `1px solid ${isDarkMode ? theme.raw.mode.border.secondary : '#d1d5db'}`,
                    borderRadius: '0.5rem'
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? theme.raw.primary[500]
                      : state.isFocused
                        ? (isDarkMode ? theme.raw.mode.background.tertiary : '#f3f4f6')
                        : 'transparent',
                    color: state.isSelected
                      ? '#ffffff'
                      : isDarkMode ? theme.raw.mode.text.primary : '#111827',
                    '&:hover': {
                      backgroundColor: state.isSelected ? theme.raw.primary[500] : (isDarkMode ? theme.raw.mode.background.tertiary : '#f3f4f6')
                    }
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: isDarkMode ? theme.raw.mode.text.primary : '#111827'
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: isDarkMode ? theme.raw.mode.text.muted : '#6b7280'
                  }),
                  input: (base) => ({
                    ...base,
                    color: isDarkMode ? theme.raw.mode.text.primary : '#111827'
                  })
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-xs font-medium mb-1 ${theme.text.secondary}`}>Payment Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className={`w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border text-sm outline-none focus:ring-2 ${theme.primary.ring} transition-all ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${theme.text.secondary}`}>Cashback</label>
                <input
                  type="number"
                  value={totals.cashback.toFixed(2)}
                  readOnly
                  className={`w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border text-sm outline-none ${theme.input.background} ${theme.border.input} ${theme.input.text}`}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* KOT Note */}
          <div className="flex-shrink-0">
            <label className={`block text-xs font-medium mb-1 ${theme.text.secondary}`}>KOT Note</label>
            <textarea
              value={kotNote}
              onChange={(e) => setKotNote(e.target.value)}
              placeholder="KOT Note"
              className={`w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border resize-none text-xs lg:text-sm flex-shrink-0 ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
              rows={2}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 lg:gap-2 flex-shrink-0">
            <button
              onClick={handleSendToKitchen}
              className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium truncate ${theme.button.secondary}`}
            >
              Send To Kitchen
            </button>
            <button className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium ${theme.button.primary}`}>
              Save
            </button>
            <button className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium truncate ${theme.button.secondary}`}>
              KOT Print
            </button>
            <button className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium truncate ${theme.button.secondary}`}>
              KDS Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
