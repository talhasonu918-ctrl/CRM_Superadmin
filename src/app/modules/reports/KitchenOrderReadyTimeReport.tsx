'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  Clock,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { 
  createColumnHelper, 
  useReactTable, 
  getCoreRowModel, 
  getExpandedRowModel 
} from '@tanstack/react-table';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { ExportButton } from '@/src/components/ExportButton';
import InfiniteTable from '@/src/components/InfiniteTable';
import { 
  mockKitchenOrderReadyTime, 
  type KitchenOrderReadyTimeData 
} from '@/src/app/modules/pos/mockData';

const orderTypeOptions = [
  { value: 'all', label: 'All Order Types' },
  { value: 'TakeAway', label: 'TakeAway' },
  { value: 'DineIn', label: 'DineIn' },
  { value: 'Delivery', label: 'Delivery' },
];

// Grid View Card Component
const KitchenOrderCard: React.FC<{
  item: KitchenOrderReadyTimeData;
  isDarkMode: boolean;
}> = ({ item, isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle} hover:shadow-lg transition-all group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            item.status === 'Late' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            <Clock size={20} />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate ${textStyle}`}>INV: {item.invoiceId}</h3>
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
              item.orderType === 'Delivery' ? 'bg-blue-100 text-blue-700' :
              item.orderType === 'DineIn' ? 'bg-green-100 text-green-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {item.orderType}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isExpanded ? 'text-primary' : 'text-gray-400'} transition-colors`}
          title={isExpanded ? "Hide Details" : "View Details"}
        >
          {isExpanded ? <ChevronUp size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-textSecondary">Order No</span>
          <span className={`font-semibold ${textStyle}`}>{item.orderNo}</span>
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-textSecondary">Table / Waiter</span>
          <span className={`font-medium ${textStyle}`}>{item.tableNo} / {item.waiter}</span>
        </div>
        
        <div className={`h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-textSecondary uppercase font-bold tracking-wider">Delay Time</span>
          <span className={`font-black text-lg ${item.status === 'Late' ? 'text-red-500' : 'text-primary'}`}>
            {item.delayTime || '00:00:00'}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className={`mt-4 pt-3 border-t ${borderStyle}`}>
          <h4 className={`text-xs font-semibold mb-2 ${textStyle} uppercase`}>Items Checklist</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {item.items.map((prod, idx) => (
              <div key={idx} className={`p-2 rounded-lg text-xs ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} flex justify-between items-center`}>
                <div className="min-w-0 flex-1">
                  <span className={`font-medium ${textStyle} truncate block`}>{prod.productName}</span>
                  <span className="text-textSecondary text-[10px]">Qty: {prod.quantity}</span>
                </div>
                <span className="text-primary font-bold shrink-0">{prod.readyTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const columnHelper = createColumnHelper<KitchenOrderReadyTimeData>();

const KitchenOrderReadyTimeReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-16');
  const [dateTo, setDateTo] = useState('2026-02-16');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderType, setSelectedOrderType] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter Data
  const { filteredData, stats } = useMemo(() => {
    const data = mockKitchenOrderReadyTime.filter(item => {
      // Date filter
      const itemDate = new Date(item.date);
      const start = dateFrom ? new Date(dateFrom) : null;
      const end = dateTo ? new Date(dateTo) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      const matchesDate = (!start || itemDate >= start) && (!end || itemDate <= end);

      // Search filter
      const matchesSearch = !searchTerm || 
        item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.waiter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rider.toLowerCase().includes(searchTerm.toLowerCase());

      // Order Type filter
      const matchesType = selectedOrderType === 'all' || item.orderType === selectedOrderType;

      return matchesDate && matchesSearch && matchesType;
    });

    const totalInvoices = data.length;
    const lateInvoices = data.filter(i => i.status === 'Late').length;
    const onTimeInvoices = data.filter(i => i.status === 'On Time').length;

    return { 
      filteredData: data, 
      stats: { totalInvoices, lateInvoices, onTimeInvoices } 
    };
  }, [dateFrom, dateTo, searchTerm, selectedOrderType]);

  const columns = useMemo(() => [
    columnHelper.accessor('invoiceId', { 
      header: 'Invoice ID', 
      cell: (info) => <span className="font-semibold text-primary">{info.getValue()}</span> 
    }),
    columnHelper.accessor('orderType', { 
      header: 'Order Type',
      cell: (info) => (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
          info.getValue() === 'Delivery' ? 'bg-blue-100 text-blue-700' :
          info.getValue() === 'DineIn' ? 'bg-green-100 text-green-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('orderNo', { header: 'Order No' }),
    columnHelper.accessor('waiter', { header: 'Waiter' }),
    columnHelper.accessor('rider', { header: 'Rider' }),
    columnHelper.accessor('tableNo', { header: 'Table No' }),
    columnHelper.accessor('delayTime', { 
      header: 'Delay Time',
      cell: (info) => (
        <span className={info.row.original.status === 'Late' ? 'text-red-500 font-bold' : 'text-textSecondary'}>
          {info.getValue() || '-'}
        </span>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => row.toggleExpanded()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
            title={row.getIsExpanded() ? "Hide Items" : "View Items"}
          >
            {row.getIsExpanded() ? <ChevronUp size={18} /> : <Eye size={18} />}
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      )
    })
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const renderSubComponent = ({ row }: { row: any }) => {
    const items = row.original.items;
    return (
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-sm font-bold mb-3 ${textStyle}`}>Order Items Checklist</h4>
        <div className={`rounded-lg border ${borderStyle} overflow-hidden bg-white dark:bg-gray-800`}>
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3 text-right">Ready Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className={`px-4 py-2 font-medium ${textStyle}`}>{item.productName}</td>
                  <td className={`px-4 py-2 text-center text-textSecondary`}>{item.quantity}</td>
                  <td className={`px-4 py-2 text-right text-primary font-semibold`}>{item.readyTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* <h2 className={`text-xl font-bold ${textStyle}`}>Kitchen Order Ready Time Report</h2> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Total Invoices', value: stats.totalInvoices.toFixed(2), icon: <ListIcon size={18} className="text-primary" /> },
          { label: 'Total Late Invoices', value: stats.lateInvoices.toFixed(2), icon: <Clock size={18} className="text-red-500" /> },
          { label: 'Total On Time Invoices', value: stats.onTimeInvoices.toFixed(2), isPrimary: true },
        ].map((item, idx) => (
          <div key={idx} className={`${item.isPrimary ? 'bg-primary/10 border-primary/20' : cardStyle} rounded-xl p-4 sm:p-6 border ${item.isPrimary ? 'border-primary/20' : borderStyle} hover:shadow-sm transition-all group`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[10px] sm:text-xs font-semibold ${item.isPrimary ? 'text-primary' : 'text-textSecondary uppercase'}`}>{item.label}</span>
            </div>
            <div className={`text-xl sm:text-2xl font-black ${item.isPrimary ? 'text-primary' : textStyle}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters Area */}
      <div className={`${cardStyle} rounded-xl p-4  sm:p-6 border ${borderStyle}`}>
        <div className="flex flex-col lg:flex-row items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block uppercase">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm h-[42px]`}
              />
            </div>
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block uppercase">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm h-[42px]`}
              />
            </div>
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block uppercase">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Invoice/Waiter/Rider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm h-[42px]`}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block uppercase">Order Type</label>
              <SearchableDropdown
                options={orderTypeOptions}
                value={selectedOrderType}
                onChange={setSelectedOrderType}
                placeholder="Select Order Type"
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          <ExportButton 
            filename="Kitchen_ReadyTime_Report"
            title="Kitchen Order Ready Time Report"
            headers={['Invoice ID', 'Order Type', 'Order No', 'Waiter', 'Rider', 'Table No', 'Delay Time', 'Status']}
            data={filteredData.map(item => [
              item.invoiceId,
              item.orderType,
              item.orderNo,
              item.waiter,
              item.rider,
              item.tableNo,
              item.delayTime || '00:00:00',
              item.status
            ])}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-bold ${textStyle}`}>Kitchen Order Details</h2>
        <div className={`flex items-center gap-2  dark:bg-[#232a36] rounded-lg px-2 py-1`}>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded border ${borderStyle} ${viewMode === 'list' ? 'bg-primary text-white border-primary' : `${cardStyle}`}`}
            title="List View"
          >
            <ListIcon size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded border ${borderStyle} ${viewMode === 'grid' ? 'bg-primary text-white border-primary' : `${cardStyle}`}`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Data Section */}
      {viewMode === 'list' ? (
        <div className={`rounded-xl border ${borderStyle} shadow-sm overflow-hidden`}>
          <InfiniteTable
            table={table}
            isDarkMode={isDarkMode}
            total={filteredData.length}
            isLoading={false}
            renderSubComponent={renderSubComponent}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <KitchenOrderCard key={item.id} item={item} isDarkMode={isDarkMode} />
          ))}
          {filteredData.length === 0 && (
            <div className={`col-span-full ${cardStyle} rounded-xl border ${borderStyle} p-12 text-center`}>
              <p className="text-textSecondary">No order found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KitchenOrderReadyTimeReport;
