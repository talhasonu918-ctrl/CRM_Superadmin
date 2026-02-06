import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Rider } from '../types';
import { mockProducts, categories, mockTables, mockRiders } from '../mockData';
// ... import Eye
import { Search, ShoppingCart, Plus, Minus, DollarSign, UserPlus, Eye } from 'lucide-react';
import { CustomSelect, CustomSelectOption } from '../../../../components/CustomSelect';
import useSound from 'use-sound';
import { useForm, useWatch } from 'react-hook-form';
import { SearchInput } from '../../../../components/SearchInput';
import { tableStateManager } from '../../../../utils/tableStateManager';
import { AddCustomerModal } from './AddCustomerModal';
import { sendToKitchen } from '../../../../utils/kitchenDisplay';
import toast, { Toaster } from 'react-hot-toast';

interface POSViewProps {
  isDarkMode?: boolean;
  onViewRiderDetail?: (riderId: string) => void;
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
  floor: 'Ground' | 'First';
}

export const POSView: React.FC<POSViewProps> = ({ isDarkMode = false, onViewRiderDetail }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<CustomSelectOption | null>(null);
  const [selectedWaiter, setSelectedWaiter] = useState<CustomSelectOption | null>(null);
  const [selectedRider, setSelectedRider] = useState<CustomSelectOption | null>(null);
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

  // Get dynamic table state
  const [allTables, setAllTables] = useState(() => tableStateManager.getTables());
  const availableTables = useMemo(() => allTables.filter(table => table.status === 'available'), [allTables]);

  // Listen for table status updates from other components
  useEffect(() => {
    return tableStateManager.subscribe(() => {
      setAllTables(tableStateManager.getTables());
    });
  }, []);

  // Mock data for waiters and customers
  const [waiters] = useState<Waiter[]>([
    { id: 'w1', name: 'Ahmed Ali', phone: '+91 98765 43210', status: 'Available', floor: 'Ground' },
    { id: 'w2', name: 'Sara Khan', phone: '+91 98765 43211', status: 'Working', floor: 'First' },
    { id: 'w3', name: 'Hassan Raza', phone: '+91 98765 43212', status: 'Available', floor: 'Ground' },
    { id: 'w4', name: 'Fatima Sheikh', phone: '+91 98765 43213', status: 'Working', floor: 'First' },
    { id: 'w5', name: 'Zainab Bibi', phone: '+91 98765 43214', status: 'Available', floor: 'Ground' },
    { id: 'w6', name: 'Usman Ghani', phone: '+91 98765 43215', status: 'Working', floor: 'First' },
    { id: 'w7', name: 'Ibrahim Lodi', phone: '+91 98765 43216', status: 'Available', floor: 'Ground' },
    { id: 'w8', name: 'Sana Safinaz', phone: '+91 98765 43217', status: 'Working', floor: 'First' },
    { id: 'w9', name: 'Ali Hamza', phone: '+91 98765 43218', status: 'Available', floor: 'Ground' },
    { id: 'w10', name: 'Maria B', phone: '+91 98765 43219', status: 'Working', floor: 'First' },
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

  // Table Sync Logic
  useEffect(() => {
    const checkTableSync = () => {
      const savedTableJson = localStorage.getItem('nexus_pos_selected_table');
      if (savedTableJson) {
        try {
          const table = JSON.parse(savedTableJson);

          // Re-fetch ALL tables to ensure we have latest status
          const currentTables = tableStateManager.getTables();
          const targetTable = currentTables.find(t => t.id === table.id);

          // Only sync if the table is actually available
          if (targetTable && targetTable.status === 'available') {
            if (!selectedTable || selectedTable.value !== table.id) {
              setSelectedTable({
                value: table.id,
                label: `${table.number}`,
                sublabel: `${table.capacity} Seats Available`,
                badge: table.capacity,
                badgeColor: 'bg-primary/20 text-primary'
              });
            }
          } else if (targetTable && targetTable.status === 'occupied') {
            // If user jumped to an occupied table, clear selection or show warning
            if (selectedTable?.value === table.id) setSelectedTable(null);
            localStorage.removeItem('nexus_pos_selected_table');
          }
        } catch (e) {
          console.error('Error parsing synced table:', e);
        }
      }
    };

    checkTableSync(); // Initial check

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nexus_pos_selected_table' || e.key === 'nexus_tables_state') {
        checkTableSync();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedTable, isDarkMode]);

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
    badgeColor: 'bg-primary/20 text-primary'
  }));

  const waiterOptions: CustomSelectOption[] = waiters
    .map((waiter: Waiter) => ({
      value: waiter.id,
      label: waiter.name,
      sublabel: waiter.phone,
      badge: waiter.floor === 'Ground' ? 'G' : 'F',
      badgeColor: waiter.floor === 'Ground'
        ? 'bg-primary/10 text-primary'
        : 'bg-secondary/10 text-secondary'
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const riderOptions: CustomSelectOption[] = useMemo(() => {
    return mockRiders
      .sort((a, b) => {
        // 1. Status: Available first
        if (a.status === 'available' && b.status !== 'available') return -1;
        if (a.status !== 'available' && b.status === 'available') return 1;

        // 2. For Available: 0 orders first, then ascending order count
        if (a.status === 'available' && b.status === 'available') {
          if (a.currentOrders === 0 && b.currentOrders !== 0) return -1;
          if (a.currentOrders !== 0 && b.currentOrders === 0) return 1;
          return a.currentOrders - b.currentOrders;
        }

        // 3. Name fallback
        return a.name.localeCompare(b.name);
      })
      .map(rider => {
        let badgeText = '';
        let badgeColor = '';

        if (rider.status === 'available') {
          if (rider.currentOrders === 0) {
            badgeText = 'Available (Free)';
            badgeColor = 'bg-success/10 text-success';
          } else {
            badgeText = `Available (${rider.currentOrders} Orders)`;
            badgeColor = 'bg-warning/10 text-warning';
          }
        } else {
          badgeText = `${rider.status === 'busy' ? 'Busy' : rider.status} (${rider.currentOrders} Orders)`;
          badgeColor = 'bg-error/10 text-error';
        }

        return {
          value: rider.id,
          label: rider.name,
          sublabel: rider.phone,
          image: rider.avatar,
          badge: badgeText,
          badgeColor: badgeColor
        };
      });
  }, [isDarkMode]);

  const customerOptions: CustomSelectOption[] = customers.map(customer => ({
    value: customer.id,
    label: customer.name,
    sublabel: customer.phone || 'No phone number'
  }));

  const paymentModeOptions: CustomSelectOption[] = [
    { value: 'Cash', label: 'Cash', icon: <DollarSign size={14} className="text-success" /> },
    { value: 'Card', label: 'Card', icon: <DollarSign size={14} className="text-primary" /> },
    { value: 'UPI', label: 'UPI', icon: <DollarSign size={14} className="text-secondary" /> },
    { value: 'Bank Transfer', label: 'Bank', icon: <DollarSign size={14} className="text-primary" /> }
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

    const selectedTableData = availableTables.find((t: any) => t.id === selectedTable?.value);
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

    // 1. Mark table as occupied if DineIn
    if (orderType === 'DineIn' && selectedTable?.value) {
      tableStateManager.updateStatus(String(selectedTable.value), 'occupied');
    }

    // 2. Clear Cart & Reset Form
    setCart([]);
    setSelectedTable(null);
    setSelectedWaiter(null);
    setKotNote('');
    localStorage.removeItem('nexus_pos_selected_table');
  };

  const handleSaveOrder = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty', { position: 'top-right' });
      return;
    }

    // Mark table as occupied
    if (orderType === 'DineIn' && selectedTable?.value) {
      tableStateManager.updateStatus(String(selectedTable.value), 'occupied');
    }

    playBeep();
    toast.success('Order saved successfully!', { position: 'top-right' });

    // Clear state
    setCart([]);
    setSelectedTable(null);
    setSelectedWaiter(null);
    setKotNote('');
    localStorage.removeItem('nexus_pos_selected_table');
  };

  const totals = calculateTotals();

  return (
    <>
      <div className={`flex flex-col lg:flex-row gap-4 lg:gap-0 bg-background overflow-hidden ${isFullscreen ? 'h-full' : 'h-[460px]'}`}>
        {/* Left Section - Products */}
        <div className="flex-1 flex flex-col min-w-0 lg:pr-0 h-full overflow-hidden">

          {/* Search */}
          <div className="mb-3 lg:mb-4 mt-2 lg:mt-3 px-2 flex-shrink-0 max-w-sm">
            <SearchInput

              control={control}
              placeholder="Search Product..."
              inputStyle="w-full rounded-lg border border-border bg-surface text-textPrimary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
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
                  ? 'bg-primary text-white'
                  : 'bg-surface text-textSecondary hover:bg-surface/10'
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
                  className="p-2 lg:p-3 rounded-lg border border-border bg-surface transition-all hover:shadow-lg hover:border-primary"
                >
                  <div className="aspect-square rounded-lg mb-2 flex items-center justify-center bg-background">
                    <ShoppingCart className="text-textSecondary" size={24} />
                  </div>
                  <h3 className="text-xs font-semibold mb-1 line-clamp-2 text-textPrimary">
                    {product.name}
                  </h3>
                  <p className="font-bold text-xs text-primary">
                    {product.price > 0 ? `₹${product.price.toFixed(2)}` : '₹0.00'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Cart */}
        <div className={`w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col border border-border rounded-md ${isFullscreen ? 'h-full ' : 'h-[460px]'} bg-surface overflow-y-auto custom-scrollbar scrollbar-thin`}>
          <div className="p-3 lg:p-4 flex flex-col h-full ">
            <h2 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 flex items-center gap-2 flex-shrink-0 text-textPrimary">
              <ShoppingCart size={20} className="text-primary lg:w-6 lg:h-6" />
              {orderType === 'DineIn' ? 'DINE IN' : orderType === 'TakeAway' ? 'TAKE AWAY' : 'DELIVERY'}
            </h2>

            {/* Order Type Selector */}
            <div className="grid grid-cols-3 gap-2 mb-3 flex-shrink-0 ">
              <button
                onClick={() => setOrderType('DineIn')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${orderType === 'DineIn'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-textSecondary hover:bg-primary/5'
                  }`}
              >
                Dine In
              </button>
              <button
                onClick={() => setOrderType('TakeAway')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${orderType === 'TakeAway'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-textSecondary hover:bg-primary/5'
                  }`}
              >
                Take Away
              </button>
              <button
                onClick={() => setOrderType('Delivery')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${orderType === 'Delivery'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-textSecondary hover:bg-primary/5'
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
                {orderType === 'Delivery' ? (
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <CustomSelect
                        label="Rider"
                        value={selectedRider}
                        onChange={setSelectedRider}
                        options={riderOptions}
                        placeholder="Select Rider"
                        isDarkMode={isDarkMode}
                      />
                    </div>
                    <button
                      onClick={() => selectedRider && onViewRiderDetail?.(String(selectedRider.value))}
                      disabled={!selectedRider}
                      className={`h-10 w-10 flex items-center justify-center rounded-lg border border-border transition-all ${selectedRider
                        ? 'bg-surface hover:bg-primary hover:text-white hover:border-transparent text-textSecondary'
                        : 'bg-background opacity-50 cursor-not-allowed text-textSecondary'
                        }`}
                      title="View Rider Details"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                ) : (
                  <CustomSelect
                    label="Waiter"
                    value={selectedWaiter}
                    onChange={setSelectedWaiter}
                    options={waiterOptions}
                    placeholder="Select Waiter"
                    isDarkMode={isDarkMode}
                  />
                )}
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
                      className="absolute right-1 top-[calc(50%+10px)] -translate-y-1/2 p-1 rounded bg-primary text-white hover:opacity-90 transition-colors z-10"
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
            <div className="grid grid-cols-2 gap-1 lg:gap-2 pb-2 border-b border-border mb-2 text-[10px] lg:text-xs font-semibold flex-shrink-0">
              <div className="text-textSecondary">Items</div>
              <div className="flex justify-between">
                <div className="text-center text-textSecondary">Quantity</div>
                <div className="text-right text-textSecondary">Price</div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto mb-3 lg:mb-4 scrollbar-hidden min-h-[100px]">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-textSecondary/50">
                  <ShoppingCart size={36} className="lg:w-12 lg:h-12 mb-2 opacity-50" />
                  <p className="text-xs lg:text-sm">No Products in Cart</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="grid grid-cols-2 gap-1 lg:gap-2 py-2 lg:py-3 border-b border-border items-center">
                    <div className="flex items-center gap-1">
                      <div className={`text-[10px] lg:text-xs text-textPrimary break-words line-clamp-2 max-w-[120px] lg:max-w-none`} title={item.product.name}>
                        {item.product.name.length > 50 ? `${item.product.name.substring(0, 47)}...` : item.product.name}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center justify-center gap-0.5 lg:gap-1">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded ${isDarkMode ? 'bg-surface' : 'bg-background'} hover:bg-primary hover:text-white transition-colors`}>
                          <Minus size={10} className="lg:w-3 lg:h-3" />
                        </button>
                        <span className="w-6 lg:w-8 text-center text-xs lg:text-sm font-medium text-textPrimary">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded ${isDarkMode ? 'bg-surface' : 'bg-background'} hover:bg-primary hover:text-white transition-colors`}>
                          <Plus size={10} className="lg:w-3 lg:h-3" />
                        </button>
                      </div>
                      <div className="text-right text-xs lg:text-sm font-semibold text-textPrimary">
                        {(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 pb-3 lg:pb-4 border-t border-border pt-3 lg:pt-4 flex-shrink-0">
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-textSecondary">Items Count: {totals.itemsCount}</span>
                <span className="font-semibold text-textPrimary">Subtotal: ₹{totals.subtotal.toFixed(2)}</span>
              </div>

              {/* Service Charge */}
              <div className="grid grid-cols-2 gap-2 text-[10px] lg:text-xs">
                <div>
                  <label className="text-textSecondary block mb-1">Sr Ch %</label>
                  <input
                    type="number"
                    value={serviceChargePercent}
                    onChange={(e) => setServiceChargePercent(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-border text-xs bg-surface text-textPrimary placeholder-textSecondary/50"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-textSecondary block mb-1">Sr Ch Amount</label>
                  <input
                    type="number"
                    value={serviceChargeAmount}
                    disabled
                    className="w-full px-2 py-1 rounded border border-border text-xs cursor-not-allowed opacity-75 bg-surface text-textPrimary placeholder-textSecondary/50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Tax */}
              <div className="grid grid-cols-2 gap-2 text-[10px] lg:text-xs">
                <div>
                  <label className="text-textSecondary block mb-1">Tax %</label>
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-border text-xs bg-surface text-textPrimary placeholder-textSecondary/50"
                    placeholder="16"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-textSecondary block mb-1">Tax Amount</label>
                  <input
                    type="number"
                    value={taxAmount}
                    disabled
                    className="w-full px-2 py-1 rounded border border-border text-xs cursor-not-allowed opacity-75 bg-surface text-textPrimary placeholder-textSecondary/50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Discount */}
              <div className="grid grid-cols-2 gap-2 text-[10px] lg:text-xs">
                <div>
                  <label className="text-textSecondary block mb-1">Dis %</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-border text-xs bg-surface text-textPrimary placeholder-textSecondary/50"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-textSecondary block mb-1">Dis Amount</label>
                  <input
                    type="number"
                    value={discountAmount}
                    disabled
                    className="w-full px-2 py-1 rounded border border-border text-xs cursor-not-allowed opacity-75 bg-surface text-textPrimary placeholder-textSecondary/50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Calculated Values Display */}
              <div className={`text-xs space-y-1 pt-2 border-t border-border`}>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Service Charge:</span>
                  <span className="text-textPrimary">₹{totals.serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Tax:</span>
                  <span className="text-textPrimary">₹{totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Discount:</span>
                  <span className="text-textPrimary">-₹{totals.discount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Grand Total */}
            <div className="bg-primary text-white p-3 lg:p-4 rounded-lg mb-3 lg:mb-4 flex justify-between items-center flex-shrink-0 shadow-lg">
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
                  <label className="block text-xs font-medium mb-1 text-textSecondary">Payment Amount</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-surface text-textPrimary placeholder-textSecondary/50"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-textSecondary">Cashback</label>
                  <input
                    type="number"
                    value={totals.cashback.toFixed(2)}
                    readOnly
                    className="w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border border-border text-sm outline-none bg-background text-textPrimary"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* KOT Note */}
            <div className="flex-shrink-0">
              <label className="block text-xs font-medium mb-1 text-textSecondary">KOT Note</label>
              <textarea
                value={kotNote}
                onChange={(e) => setKotNote(e.target.value)}
                placeholder="KOT Note"
                className="w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border border-border bg-surface text-textPrimary text-xs lg:text-sm flex-shrink-0 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                rows={2}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 lg:gap-2 flex-shrink-0">
              <button
                onClick={handleSendToKitchen}
                className="px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium truncate bg-secondary text-white hover:opacity-90"
              >
                Send To Kitchen
              </button>
              <button
                onClick={handleSaveOrder}
                className="px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium bg-primary text-white hover:opacity-90"
              >
                Save
              </button>
              <button className="px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium truncate bg-background border border-border text-textSecondary hover:bg-surface">
                KOT Print
              </button>
              <button className="px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium truncate bg-background border border-border text-textSecondary hover:bg-surface">
                KDS Print
              </button>
            </div>
          </div>
        </div>
      </div >
      <Toaster />
    </>
  );
};
