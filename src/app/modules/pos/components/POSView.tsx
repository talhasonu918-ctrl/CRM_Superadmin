import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { mockProducts, categories, mockTables } from '../mockData';
import { Search, ShoppingCart, Plus, Minus, X, DollarSign, UserPlus } from 'lucide-react';
import { AddCustomerModal } from './AddCustomerModal';
import { getThemeColors } from '../../../../theme/colors';

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
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedWaiter, setSelectedWaiter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  
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
    const discount = 0;
    const tax = 0;
    return { itemsCount, subtotal, discount, tax, total: subtotal - discount + tax };
  };

  const totals = calculateTotals();

  return (
    <div className={`flex h-[calc(100vh-2rem)] overflow-hidden ${theme.neutral.background}`}>
      {/* Left Section - Products */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pr-0">
        
        {/* <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap">
            <Plus size={18} />
            <span className="font-medium">New Order</span>
          </button>
          <button className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
            Tables <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded text-sm">0</span>
          </button>
          <button className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
            Delivery <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded text-sm">0</span>
          </button>
          <button className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
            Take Away <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded text-sm">0</span>
          </button>
          <button className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
            Order Queue <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded text-sm">0</span>
          </button>
        </div> */}

        {/* Search */}
        <div className="relative mb-4 px-2 flex-shrink-0">
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
        <div className="flex gap-2 px-2 mb-4 overflow-x-auto pb-2  flex-shrink-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCategory === category
                  ? `${theme.primary.main} text-white`
                  : `${theme.neutral.card} ${theme.text.tertiary} ${theme.neutral.hover}`
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className={`p-3 rounded-lg border transition-all hover:shadow-lg ${theme.neutral.card} ${theme.border.secondary} hover:${theme.primary.border}`}
              >
                <div className={`aspect-square rounded-lg mb-2 flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <ShoppingCart className={theme.text.muted} size={32} />
                </div>
                <h3 className={`text-sm font-semibold mb-1 line-clamp-2 ${theme.text.primary}`}>
                  {product.name}
                </h3>
                <p className="text-orange-600 font-bold text-sm">
                  {product.price > 0 ? `${product.price.toFixed(2)}` : '0.00'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Cart */}
      <div className={`w-80 lg:w-96 flex-shrink-0 flex flex-col border-l ${theme.border.main} ${theme.neutral.card} overflow-y-auto scrollbar-thin`}>
        <div className="p-3 lg:p-4 flex flex-col h-full">
          <h2 className={`text-lg lg:text-xl font-bold mb-3 lg:mb-4 flex items-center gap-2 flex-shrink-0 ${theme.text.primary}`}>
            <ShoppingCart size={20} className="text-orange-500 lg:w-6 lg:h-6" />
            DINE IN
          </h2>

          {/* Select Dropdowns */}
          <div className="space-y-2 lg:space-y-3 mb-3 lg:mb-4 flex-shrink-0">
            <select 
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className={`w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border text-sm ${theme.input.background} ${theme.border.input} ${theme.input.text}`}
            >
              <option value="">Select Table</option>
              {availableTables.map(table => (
                <option key={table.id} value={table.id}>{table.number} - {table.capacity} seats</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              <select 
                value={selectedWaiter}
                onChange={(e) => setSelectedWaiter(e.target.value)}
                className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border text-sm ${theme.input.background} ${theme.border.input} ${theme.input.text}`}
              >
                <option value="">Waiter</option>
                {waiters.map(waiter => (
                  <option key={waiter.id} value={waiter.id}>{waiter.name}</option>
                ))}
              </select>
              <div className="relative">
                <select 
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className={`w-full px-2 lg:px-3 py-1.5 lg:py-2 pr-8 rounded-lg border text-sm ${theme.input.background} ${theme.border.input} ${theme.input.text}`}
                >
                  <option value="">Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCustomerModal(true)}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded ${theme.button.primary} transition-colors`}
                  title="Add Customer"
                >
                  <UserPlus size={14} />
                </button>
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
          <div className="flex-1 overflow-y-auto mb-3 lg:mb-4 scrollbar-thin min-h-[100px]">
            {cart.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full ${theme.text.muted}`}>
                <ShoppingCart size={36} className="lg:w-12 lg:h-12 mb-2 opacity-50" />
                <p className="text-xs lg:text-sm">No Products in Cart</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className={`grid grid-cols-4 gap-1 lg:gap-2 py-2 lg:py-3 border-b ${theme.border.secondary}`}>
                  <div className={`text-[10px] lg:text-xs ${theme.text.primary} truncate`}>{item.product.name}</div>
                  <div className="flex items-center justify-center gap-0.5 lg:gap-1">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} hover:${theme.primary.main} hover:text-white transition-colors`}>
                      <Minus size={10} className="lg:w-3 lg:h-3" />
                    </button>
                    <span className={`w-6 lg:w-8 text-center text-xs lg:text-sm font-medium ${theme.text.primary}`}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} hover:${theme.primary.main} hover:text-white transition-colors`}>
                      <Plus size={10} className="lg:w-3 lg:h-3" />
                    </button>
                  </div>
                  <div className={`text-center text-[10px] lg:text-xs ${theme.text.tertiary}`}>0</div>
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
              <span className={`font-semibold ${theme.text.primary}`}>Subtotal: {totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 lg:gap-2 text-[10px] lg:text-xs">
              <div className={theme.text.tertiary}>Sr Ch %<br/><span className={theme.text.primary}>0</span></div>
              <div className={theme.text.tertiary}>Sr Ch<br/><span className={theme.text.primary}>0</span></div>
              <div className={theme.text.tertiary}>Tax %<br/><span className={theme.text.primary}>16</span></div>
              <div className={theme.text.tertiary}>Tax<br/><span className={theme.text.primary}>0</span></div>
            </div>
            <div className="grid grid-cols-2 gap-1 lg:gap-2 text-[10px] lg:text-xs">
              <div className={theme.text.tertiary}>Dis<br/><span className={theme.text.primary}>0</span></div>
              <div className={theme.text.tertiary}>Dis<br/><span className={theme.text.primary}>0</span></div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="bg-orange-600 text-white p-3 lg:p-4 rounded-lg mb-3 lg:mb-4 flex justify-between items-center flex-shrink-0">
            <span className="text-sm lg:text-base font-semibold">Grand Total</span>
            <span className="text-xl lg:text-2xl font-bold">PKR {totals.total.toFixed(2)}</span>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-2 gap-2 mb-3 lg:mb-4 text-xs lg:text-sm flex-shrink-0">
            <div>
              <span className={theme.text.tertiary}>Payment Mode</span>
              <div className={`font-semibold ${theme.text.primary}`}>Cash</div>
            </div>
            <div>
              <span className={theme.text.tertiary}>Payment</span>
              <div className={`font-semibold ${theme.text.primary}`}>0</div>
            </div>
            <div>
              <span className={theme.text.tertiary}>Cash Back</span>
              <div className={`font-semibold ${theme.text.primary}`}>0.00</div>
            </div>
          </div>

          {/* KOT Note */}
          <textarea
            placeholder="KOT Note"
            className={`w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border mb-3 lg:mb-4 resize-none text-xs lg:text-sm flex-shrink-0 ${theme.input.background} ${theme.border.input} ${theme.input.text} ${theme.input.placeholder}`}
            rows={2}
          />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 lg:gap-2 flex-shrink-0">
            <button className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium truncate ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}>
              Send To Kitchen
            </button>
            <button className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium ${theme.button.primary}`}>
              Save
            </button>
            <button className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium truncate ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}>
              KOT Print
            </button>
            <button className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors text-[10px] lg:text-sm font-medium truncate ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}>
              KDS Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
