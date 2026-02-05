import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { mockProducts, categories, mockTables } from '../mockData';
import { Search, ShoppingCart, Plus, Minus, DollarSign, UserPlus } from 'lucide-react';
import { AddCustomerModal } from './AddCustomerModal';
import { getThemeColors } from '../../../../theme/colors';
import { sendToKitchen } from '../../../../utils/kitchenDisplay';
import toast, { Toaster } from 'react-hot-toast';
import { CustomSelect, CustomSelectOption } from '../../../../components/CustomSelect';
import useSound from 'use-sound';
import { useForm, useWatch } from 'react-hook-form';
import { SearchInput } from '../../../../components/SearchInput';

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
  phone: string;
  status: 'Available' | 'Working';
}

export const POSView: React.FC<POSViewProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<CustomSelectOption | null>(null);
  const [selectedWaiter, setSelectedWaiter] = useState<CustomSelectOption | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomSelectOption | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [orderType, setOrderType] = useState<'DineIn' | 'TakeAway' | 'Delivery'>('DineIn');

  // Form for search
  const { control } = useForm({
    defaultValues: {
      searchTerm: ''
    }
  });

  const searchQuery = useWatch({
    control,
    name: 'searchTerm',
    defaultValue: ''
  });

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

  // Sound for "Send to Kitchen"
  const [playBeep] = useSound('/sounds/soap.wav');

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mock data for waiters and customers
  const [waiters] = useState<Waiter[]>([
    { id: 'w1', name: 'Ahmed Ali', phone: '+91 98765 43210', status: 'Available' },
    { id: 'w2', name: 'Sara Khan', phone: '+91 98765 43211', status: 'Working' },
    { id: 'w3', name: 'Hassan Raza', phone: '+91 98765 43212', status: 'Available' },
    { id: 'w4', name: 'Fatima Sheikh', phone: '+91 98765 43213', status: 'Working' },
    { id: 'w5', name: 'Zainab Bibi', phone: '+91 98765 43214', status: 'Available' },
    { id: 'w6', name: 'Usman Ghani', phone: '+91 98765 43215', status: 'Working' },
    { id: 'w7', name: 'Ibrahim Lodi', phone: '+91 98765 43216', status: 'Available' },
    { id: 'w8', name: 'Sana Safinaz', phone: '+91 98765 43217', status: 'Working' },
    { id: 'w9', name: 'Ali Hamza', phone: '+91 98765 43218', status: 'Available' },
    { id: 'w10', name: 'Maria B', phone: '+91 98765 43219', status: 'Working' },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'c1', name: 'Walk-in Customer', phone: 'No phone number' },
    { id: 'c2', name: 'John Doe', phone: '+92 300 1234567' },
    { id: 'c3', name: 'Ali Ahmed', phone: '+92 321 9876543' },
    { id: 'c4', name: 'Sarah Wilson', phone: '+44 7700 900000' },
    { id: 'c5', name: 'Michael Chen', phone: '+1 202 555 0101' },
    { id: 'c6', name: 'Fatima Zahra', phone: '+971 50 123 4567' },
    { id: 'c7', name: 'Robert Brown', phone: '+61 412 345 678' },
    { id: 'c8', name: 'Yuki Tanaka', phone: '+81 90 1234 5678' },
    { id: 'c9', name: 'David Smith', phone: '+27 82 123 4567' },
    { id: 'c10', name: 'Elena Rossi', phone: '+39 333 123 4567' },
  ]);

  // Get available tables
  const availableTables = mockTables.filter(table => table.status === 'available');

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Auto-calculate amounts based on percentages
  useEffect(() => {
    const scPercent = parseFloat(serviceChargePercent) || 0;
    const taxPercentVal = parseFloat(taxPercent) || 0;
    const disPercent = parseFloat(discountPercent) || 0;

    const scAmount = (subtotal * scPercent) / 100;
    setServiceChargeAmount(scAmount > 0 ? scAmount.toFixed(2) : '');

    const disAmount = (subtotal * disPercent) / 100;
    setDiscountAmount(disAmount > 0 ? disAmount.toFixed(2) : '');

    // Taxable amount = Subtotal + Service Charge - Discount
    const taxableAmount = subtotal + scAmount - disAmount;
    const tAmount = (taxableAmount * taxPercentVal) / 100;
    setTaxAmount(tAmount > 0 ? tAmount.toFixed(2) : '');
  }, [subtotal, serviceChargePercent, taxPercent, discountPercent]);

  // Custom Select options
  const tableOptions: CustomSelectOption[] = availableTables.map(table => ({
    value: table.id,
    label: `${table.number}`,
    sublabel: `${table.capacity} Seats Available`,
    badge: table.capacity,
    badgeColor: isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
  }));

  const waiterOptions: CustomSelectOption[] = waiters
    .map(waiter => ({
      value: waiter.id,
      label: waiter.name,
      sublabel: waiter.phone,
      badge: waiter.status === 'Available' ? 'A' : 'W',
      badgeColor: waiter.status === 'Available'
        ? (isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600')
        : (isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600')
    }))
    .sort((a, b) => (a.badge === 'A' ? -1 : 1));

  const customerOptions: CustomSelectOption[] = customers.map(customer => ({
    value: customer.id,
    label: customer.name,
    sublabel: customer.phone || 'No phone number'
  }));

  const paymentModeOptions: CustomSelectOption[] = [
    { value: 'Cash', label: 'Cash', icon: <DollarSign size={14} className="text-green-500" /> },
    { value: 'Card', label: 'Card', icon: <DollarSign size={14} className="text-blue-500" /> },
    { value: 'UPI', label: 'UPI', icon: <DollarSign size={14} className="text-purple-500" /> },
    { value: 'Bank Transfer', label: 'Bank', icon: <DollarSign size={14} className="text-orange-500" /> }
  ];

  const handleAddCustomer = (customerData: { name: string; phone: string }) => {
    const newCustomer: Customer = {
      id: `c${customers.length + 1}`,
      name: customerData.name,
      phone: customerData.phone,
    };
    setCustomers([...customers, newCustomer]);
    setSelectedCustomer({
      value: newCustomer.id,
      label: newCustomer.name,
      sublabel: newCustomer.phone || 'No phone number'
    });
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
    setCart(prevCart => prevCart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const calculateTotals = () => {
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Use the values from state (already calculated by useEffect)
    const serviceChargeAmountNum = parseFloat(serviceChargeAmount) || 0;
    const taxAmountNum = parseFloat(taxAmount) || 0;
    const discountAmountNum = parseFloat(discountAmount) || 0;
    const paymentAmountNum = parseFloat(paymentAmount) || 0;

    const total = subtotal + serviceChargeAmountNum - discountAmountNum + taxAmountNum;
    const calculatedCashback = paymentAmountNum > total ? paymentAmountNum - total : 0;

    return {
      itemsCount,
      subtotal,
      serviceCharge: serviceChargeAmountNum,
      discount: discountAmountNum,
      tax: taxAmountNum,
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

    // Play beep sound
    playBeep();

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
    <>
      <div className={`flex flex-col lg:flex-row gap-4 lg:gap-0 ${theme.neutral.background} overflow-hidden ${isFullscreen ? 'h-full' : 'h-[460px]'}`}>
        {/* Left Section - Products */}
        <div className="flex-1 flex flex-col min-w-0 lg:pr-0 h-full overflow-hidden">

          {/* Search */}
          <div className="mb-3 lg:mb-4 mt-2 lg:mt-3 px-2 flex-shrink-0">
            <SearchInput
              control={control}
              placeholder="Search Product..."
              inputStyle={`w-full rounded-lg border outline-none focus:ring-2 ${theme.primary.ring} transition-all ${theme.input.background} ${theme.border.input} ${theme.input.text}`}
              isDarkMode={isDarkMode}
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
          <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-thin overflow-x-hidden pb-4 pr-2">
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
        <div className={`w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col border rounded-md ${isFullscreen ? 'h-full ' : 'h-[460px]'} ${theme.border.main} ${theme.neutral.card} overflow-y-auto custom-scrollbar scrollbar-thin`}>
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
                <CustomSelect
                  label="Table"
                  value={selectedTable}
                  onChange={setSelectedTable}
                  options={tableOptions}
                  placeholder="Select Table"
                  isDarkMode={isDarkMode}
                />
              )}
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                <CustomSelect
                  label="Waiter"
                  value={selectedWaiter}
                  onChange={setSelectedWaiter}
                  options={waiterOptions}
                  placeholder="Select Waiter"
                  isDarkMode={isDarkMode}
                />
                <div>

                  <div className="relative">
                    <CustomSelect
                      label="Customer"
                      value={selectedCustomer}
                      onChange={setSelectedCustomer}
                      options={customerOptions}
                      placeholder="Customer"
                      isDarkMode={isDarkMode}
                    />
                    <button
                      onClick={() => setShowCustomerModal(true)}
                      className={`absolute right-1  top-[calc(50%+10px)] -translate-y-1/2 p-1 rounded ${theme.button.primary} transition-colors z-10`}
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
            <div className={`grid grid-cols-2 gap-1 lg:gap-2 pb-2 border-b ${theme.border.secondary} mb-2 text-[10px] lg:text-xs font-semibold flex-shrink-0`}>
              <div className={theme.text.tertiary}>Items</div>
              <div className="flex justify-between">
                <div className={`text-center ${theme.text.tertiary}`}>Quantity</div>
                <div className={`text-right ${theme.text.tertiary}`}>Price</div>
              </div>
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
                  <div key={item.product.id} className={`grid grid-cols-2 gap-1 lg:gap-2 py-2 lg:py-3 border-b ${theme.border.secondary} items-center`}>
                    <div className="flex items-center gap-1">
                      <div className={`text-[10px] lg:text-xs ${theme.text.primary} break-words line-clamp-2 max-w-[120px] lg:max-w-none`} title={item.product.name}>
                        {item.product.name.length > 50 ? `${item.product.name.substring(0, 47)}...` : item.product.name}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center justify-center gap-0.5 lg:gap-1">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded ${isDarkMode ? theme.neutral.card : theme.neutral.backgroundSecondary} hover:${theme.primary.main} hover:text-white transition-colors`}>
                          <Minus size={10} className="lg:w-3 lg:h-3" />
                        </button>
                        <span className={`w-6 lg:w-8 text-center text-xs lg:text-sm font-medium ${theme.text.primary}`}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded ${isDarkMode ? theme.neutral.card : theme.neutral.backgroundSecondary} hover:${theme.primary.main} hover:text-white transition-colors`}>
                          <Plus size={10} className="lg:w-3 lg:h-3" />
                        </button>
                      </div>
                      <div className={`text-right text-xs lg:text-sm font-semibold ${theme.text.primary}`}>
                        {(item.product.price * item.quantity).toFixed(2)}
                      </div>
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
                    disabled
                    className={`w-full px-2 py-1 rounded border text-xs cursor-not-allowed opacity-75 ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                    placeholder="0.00"
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
                    disabled
                    className={`w-full px-2 py-1 rounded border text-xs cursor-not-allowed opacity-75 ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                    placeholder="0.00"
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
                    disabled
                    className={`w-full px-2 py-1 rounded border text-xs cursor-not-allowed opacity-75 ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
                    placeholder="0.00"
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
              <CustomSelect
                label="Payment Mode"
                value={paymentModeOptions.find(option => option.value === paymentMode)}
                onChange={(option: CustomSelectOption | null) => setPaymentMode(option ? String(option.value) : 'Cash')}
                options={paymentModeOptions}
                placeholder="Select Payment Mode"
                isDarkMode={isDarkMode}
              />
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
      <Toaster />
    </>
  );
};
