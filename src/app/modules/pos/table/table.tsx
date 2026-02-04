import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Order } from '../types';
import { Search, Grid, List, Calendar, Settings } from 'lucide-react';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';
interface OrderQueueTableProps {
  isDarkMode?: boolean;
  orders: Order[];
  onPayment: (order: Order) => void;
  onMarkPaid: (order: Order) => void;
  onEdit: (order: Order) => void;
  onCancel: (order: Order) => void;
  onPrint: (order: Order) => void;
}

interface FilterFormData {
  search: string;
  searchTable: string;
  searchUser: string;
  dateFrom: string;
  dateTo: string;
  invoiceType: string;
}

export const OrderQueueTable: React.FC<OrderQueueTableProps> = ({
  isDarkMode = false,
  orders,
  onPayment,
  onMarkPaid,
  onEdit,
  onCancel,
  onPrint,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  
  const { control, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      searchTable: '',
      searchUser: '',
      dateFrom: '2026-01-30',
      dateTo: '2026-01-30',
      invoiceType: '',
    },
  });

  const filters = watch();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = !filters.search || 
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesTable = !filters.searchTable || 
        order.tableId?.toLowerCase().includes(filters.searchTable.toLowerCase());
      
      const matchesInvoiceType = !filters.invoiceType || order.type === filters.invoiceType;

      return matchesSearch && matchesTable && matchesInvoiceType;
    });
  }, [orders, filters]);

  const allColumns = [
    { id: 'orderNo', label: 'Order No' },
    { id: 'staff', label: 'Staff' },
    { id: 'tableNo', label: 'Table No' },
    { id: 'floorNo', label: 'Floor No' },
    { id: 'type', label: 'Type' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'customer', label: 'Customer' },
    { id: 'discount', label: 'Discount' },
    { id: 'netSale', label: 'Net Sale' },
    { id: 'paid', label: 'Paid' },
    { id: 'cashback', label: 'Cashback' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' },
  ];

  const isColumnVisible = (columnId: string) => !hiddenColumns.includes(columnId);

  const toggleColumn = (columnId: string) => {
    setHiddenColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-lg`}>
      {/* Filters - Responsive */}
      <div className="p-4 space-y-3">
        {/* First Row: View Toggle + Search Inputs */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          {/* View Mode Toggle */}
          <div className={`flex gap-1 p-1 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} w-fit`}>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid size={16} />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Search Inputs */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                  <input
                    {...field}
                    type="text"
                    placeholder="Search"
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 placeholder-gray-400'
                    }`}
                  />
                </div>
              )}
            />

            <Controller
              name="searchTable"
              control={control}
              render={({ field }) => (
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                  <input
                    {...field}
                    type="text"
                    placeholder="Search Table"
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 placeholder-gray-400'
                    }`}
                  />
                </div>
              )}
            />
          </div>
        </div>

        {/* Second Row: Date Range, Invoice Type, and Columns */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <Controller
            name="dateFrom"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  From
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} pointer-events-none`} size={16} />
                  <input
                    {...field}
                    type="date"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </div>
            )}
          />

          <Controller
            name="dateTo"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  To
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} pointer-events-none`} size={16} />
                  <input
                    {...field}
                    type="date"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </div>
            )}
          />

          <Controller
            name="invoiceType"
            control={control}
            render={({ field }) => (
              <select 
                {...field}
                className={`h-[42px] px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all min-w-[180px] ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="">Select Invoice Type</option>
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            )}
          />

          {/* Column Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className={`h-[42px] px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <HiAdjustmentsHorizontal size={18} />
              
            </button>

                {/* Column Toggle Dropdown */}
                {showColumnToggle && (
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg border z-50 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Toggle Columns
                      </h3>
                    </div>
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {allColumns.map((column) => (
                        <label
                          key={column.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isColumnVisible(column.id)}
                            onChange={() => toggleColumn(column.id)}
                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {column.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className={`sticky top-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <tr className={`text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                {isColumnVisible('orderNo') && <th className="px-4 py-3">Order No</th>}
                {isColumnVisible('staff') && <th className="px-4 py-3">Staff</th>}
                {isColumnVisible('tableNo') && <th className="px-4 py-3">Table No</th>}
                {isColumnVisible('floorNo') && <th className="px-4 py-3">Floor No</th>}
                {isColumnVisible('type') && <th className="px-4 py-3">Type</th>}
                {isColumnVisible('quantity') && <th className="px-4 py-3">Quantity</th>}
                {isColumnVisible('customer') && <th className="px-4 py-3">Customer</th>}
                {isColumnVisible('discount') && <th className="px-4 py-3">Discount</th>}
                {isColumnVisible('netSale') && <th className="px-4 py-3">Net Sale</th>}
                {isColumnVisible('paid') && <th className="px-4 py-3">Paid</th>}
                {isColumnVisible('cashback') && <th className="px-4 py-3">Cashback</th>}
                {isColumnVisible('createdAt') && <th className="px-4 py-3">Created At</th>}
                {isColumnVisible('status') && <th className="px-4 py-3">Status</th>}
                {isColumnVisible('actions') && <th className="px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className={`border-b ${
                    isDarkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {isColumnVisible('orderNo') && (
                    <td className="px-4 py-3">
                      <span className="text-blue-500 hover:underline cursor-pointer font-medium">
                        {order.orderNumber}
                      </span>
                    </td>
                  )}
                  {isColumnVisible('staff') && <td className="px-4 py-3">Admin</td>}
                  {isColumnVisible('tableNo') && <td className="px-4 py-3">{order.tableId}</td>}
                  {isColumnVisible('floorNo') && (
                    <td className="px-4 py-3">
                      {order.tableId?.startsWith('G') ? 'Ground' : '1st Floor'}
                    </td>
                  )}
                  {isColumnVisible('type') && (
                    <td className="px-4 py-3 capitalize">
                      {order.type.replace('-', ' ')}
                    </td>
                  )}
                  {isColumnVisible('quantity') && <td className="px-4 py-3">{order.items?.length || 0}</td>}
                  {isColumnVisible('customer') && <td className="px-4 py-3">{order.customerName || '-'}</td>}
                  {isColumnVisible('discount') && <td className="px-4 py-3">₹{order.discount.toFixed(2)}</td>}
                  {isColumnVisible('netSale') && <td className="px-4 py-3 font-medium">₹{order.grandTotal.toFixed(2)}</td>}
                  {isColumnVisible('paid') && <td className="px-4 py-3">₹0.00</td>}
                  {isColumnVisible('cashback') && <td className="px-4 py-3">₹{order.cashBack.toFixed(2)}</td>}
                  {isColumnVisible('createdAt') && <td className="px-4 py-3 whitespace-nowrap">{order.createdAt}</td>}
                  {isColumnVisible('status') && (
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        order.status === 'ready' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {order.status === 'ready' ? 'Ready/ForPickup' : 'InProgress'}
                      </span>
                    </td>
                  )}
                  {isColumnVisible('actions') && (
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onPayment(order)}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs font-medium whitespace-nowrap"
                          >
                            Payment
                          </button>
                          <button 
                            onClick={() => onMarkPaid(order)}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs font-medium whitespace-nowrap"
                          >
                            Mark Paid
                          </button>
                          <button 
                            onClick={() => onEdit(order)}
                            className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium whitespace-nowrap ${
                              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onCancel(order)}
                            className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium whitespace-nowrap ${
                              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => onPrint(order)}
                            className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium whitespace-nowrap ${
                              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            Invoice Print
                          </button>
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-lg border p-4 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } hover:shadow-lg transition-all`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-blue-500 hover:underline cursor-pointer font-semibold text-sm">
                    {order.orderNumber}
                  </span>
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {order.createdAt}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'ready' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {order.status === 'ready' ? 'Ready' : 'In Progress'}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Table</div>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.tableId}</div>
                </div>
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Floor</div>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {order.tableId?.startsWith('G') ? 'Ground' : '1st Floor'}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Type</div>
                  <div className={`font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {order.type.replace('-', ' ')}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Items</div>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {order.items?.length || 0}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Net Sale</div>
                  <div className={`font-bold text-orange-500`}>₹{order.grandTotal.toFixed(2)}</div>
                </div>
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Customer</div>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {order.customerName || '-'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onPayment(order)}
                    className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs font-medium"
                  >
                    Payment
                  </button>
                  <button 
                    onClick={() => onMarkPaid(order)}
                    className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs font-medium"
                  >
                    Mark Paid
                  </button>
                  <button 
                    onClick={() => onEdit(order)}
                    className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Edit
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onCancel(order)}
                    className={`flex-1 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => onPrint(order)}
                    className={`flex-1 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Invoice Print
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={`mt-4 p-4 border-t text-sm ${
        isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'
      }`}>
        <div className="flex justify-between items-center">
          <span>Showing {filteredOrders.length} orders</span>
          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
            Total: {filteredOrders.length} orders
          </span>
        </div>
      </div>
    </div>
  );
};
