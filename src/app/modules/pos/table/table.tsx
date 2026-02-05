import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Order } from '../types';
import { Search, Grid, List, Calendar } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../theme/colors';
import { ColumnToggle } from '../../../../components/ColumnToggle';
interface OrderQueueTableProps {
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
  orders,
  onPayment,
  onMarkPaid,
  onEdit,
  onCancel,
  onPrint,
}) => {
  const { isDarkMode } = useTheme();
  const theme = getThemeColors(isDarkMode);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
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
    <div className={`${theme.neutral.card} rounded-lg shadow-lg`}>
      {/* Header with Title, Search, and View Toggle */}
      <div className={`p-3 sm:p-4 ${theme.border.main}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <h1 className={`text-xl sm:text-2xl font-bold whitespace-nowrap ${theme.text.primary}`}>
            Current Order
          </h1>

          <div className="flex items-center w-full sm:w-auto justify-end gap-3 sm:gap-4 sm:ml-auto">
            {/* Search */}
            <div className="flex-1 sm:flex-none sm:w-64">
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.secondary}`} size={16} />
                    <input
                      {...field}
                      type="text"
                      placeholder="Search"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none ${theme.input.border} ${theme.input.background} ${theme.input.text} ${theme.input.placeholder} focus:ring-2 ${theme.primary.ring} transition-all`}
                    />
                  </div>
                )}
              />
            </div>

            {/* View Toggle */}
            <div className={`flex gap-1 p-1 border rounded-lg ${theme.neutral.backgroundSecondary} ${theme.border.secondary} flex-shrink-0`}>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'list'
                  ? `${theme.primary.main} text-white shadow-sm`
                  : `${theme.text.secondary} ${theme.neutral.hover}`
                  }`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'grid'
                  ? `${theme.primary.main} text-white shadow-sm`
                  : `${theme.text.secondary} ${theme.neutral.hover}`
                  }`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Responsive */}
      <div className="p-3 sm:p-4">
        {/* Date Range, Table Search, Invoice Type, and Columns */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-end">
          {/* Date Range - Horizontal on all screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 lg:flex-none lg:w-auto">
            <Controller
              name="dateFrom"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <label className={`text-xs font-medium ${theme.text.secondary}`}>
                    From
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.secondary} pointer-events-none`} size={16} />
                    <input
                      {...field}
                      type="date"
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 ${theme.primary.ring} transition-all ${theme.input.background} ${theme.input.border} ${theme.input.text}`}
                    />
                  </div>
                </div>
              )}
            />

            <Controller
              name="dateTo"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <label className={`text-xs font-medium ${theme.text.secondary}`}>
                    To
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.secondary} pointer-events-none`} size={16} />
                    <input
                      {...field}
                      type="date"
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 ${theme.primary.ring} transition-all ${theme.input.background} ${theme.input.border} ${theme.input.text}`}
                    />
                  </div>
                </div>
              )}
            />
          </div>

          {/* Table Search */}
          <Controller
            name="searchTable"
            control={control}
            render={({ field }) => (
              <div className="relative flex-1 lg:w-48">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                <input
                  {...field}
                  type="text"
                  placeholder="Search Table"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 ${theme.primary.ring} transition-all ${theme.input.background} ${theme.input.border} ${theme.input.text} ${theme.input.placeholder}`}
                />
              </div>
            )}
          />

          {/* Invoice Type */}
          <Controller
            name="invoiceType"
            control={control}
            render={({ field }) => (
              <div className="relative flex-1 lg:w-48">
                <select
                  {...field}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 ${theme.primary.ring} transition-all appearance-none ${theme.input.background} ${theme.input.border} ${theme.input.text}`}
                >
                  <option value="">Select Invoice Type</option>
                  <option value="Dine In">Dine In</option>
                  <option value="TakeAway">TakeAway</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>
            )}
          />

          {/* Column Toggle */}
          <ColumnToggle
            columns={allColumns}
            hiddenColumns={hiddenColumns}
            onToggleColumn={toggleColumn}
            isDarkMode={isDarkMode}
            className="flex ml-auto w-fit  justify-end items-end"
          />
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className={`sticky top-0 ${theme.neutral.backgroundSecondary}`}>
              <tr className={`text-left text-xs font-semibold ${theme.text.secondary}`}>
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
            <tbody className={`text-sm ${theme.text.secondary}`}>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b ${isDarkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${order.status === 'ready'
                        ? `${theme.status.success.bg} ${theme.status.success.text}`
                        : `${theme.status.warning.bg} ${theme.status.warning.text}`
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
                            className={`px-3 py-1.5 ${theme.secondary.main} text-white rounded-md ${theme.secondary.hover} transition-colors text-xs font-medium whitespace-nowrap`}
                          >
                            Payment
                          </button>
                          <button
                            onClick={() => onMarkPaid(order)}
                            className={`px-3 py-1.5 ${theme.secondary.main} text-white rounded-md ${theme.secondary.hover} transition-colors text-xs font-medium whitespace-nowrap`}
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => onEdit(order)}
                            className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium whitespace-nowrap ${theme.button.secondary}`}
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onCancel(order)}
                            className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium whitespace-nowrap ${theme.button.secondary}`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => onPrint(order)}
                            className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium whitespace-nowrap ${theme.button.secondary}`}
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
        <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-3 lg:gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-lg border p-4 ${theme.neutral.card} ${theme.border.secondary} hover:shadow-lg transition-all`}
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'ready'
                  ? `${theme.status.success.bg} ${theme.status.success.text}`
                  : `${theme.status.warning.bg} ${theme.status.warning.text}`
                  }`}>
                  {order.status === 'ready' ? 'Ready' : 'In Progress'}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className={`text-xs ${theme.text.muted}`}>Table</div>
                  <div className={`font-medium ${theme.text.primary}`}>{order.tableId}</div>
                </div>
                <div>
                  <div className={`text-xs ${theme.text.muted}`}>Floor</div>
                  <div className={`font-medium ${theme.text.primary}`}>
                    {order.tableId?.startsWith('G') ? 'Ground' : '1st Floor'}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${theme.text.muted}`}>Type</div>
                  <div className={`font-medium capitalize ${theme.text.primary}`}>
                    {order.type.replace('-', ' ')}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${theme.text.muted}`}>Items</div>
                  <div className={`font-medium ${theme.text.primary}`}>
                    {order.items?.length || 0}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${theme.text.muted}`}>Net Sale</div>
                  <div className={`font-bold ${theme.primary.text}`}>₹{order.grandTotal.toFixed(2)}</div>
                </div>
                <div>
                  <div className={`text-xs ${theme.text.muted}`}>Customer</div>
                  <div className={`font-medium ${theme.text.primary}`}>
                    {order.customerName || '-'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onPayment(order)}
                    className={`flex-1 px-3 py-1.5 ${theme.secondary.main} text-white rounded-md ${theme.secondary.hover} transition-colors text-xs font-medium`}
                  >
                    Payment
                  </button>
                  <button
                    onClick={() => onMarkPaid(order)}
                    className={`flex-1 px-3 py-1.5 ${theme.secondary.main} text-white rounded-md ${theme.secondary.hover} transition-colors text-xs font-medium`}
                  >
                    Mark Paid
                  </button>
                  <button
                    onClick={() => onEdit(order)}
                    className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${theme.button.secondary}`}
                  >
                    Edit
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onCancel(order)}
                    className={`flex-1 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${theme.button.secondary}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onPrint(order)}
                    className={`flex-1 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${theme.button.secondary}`}
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
      <div className={`mt-4 p-4 border-t text-sm ${theme.border.main} ${theme.text.secondary}`}>
        <div className="flex justify-between items-center">
          <span>Showing {filteredOrders.length} orders</span>
          <span className={theme.text.muted}>
            Total: {filteredOrders.length} orders
          </span>
        </div>
      </div>
    </div>
  );
};
