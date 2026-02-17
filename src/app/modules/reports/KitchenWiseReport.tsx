import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ChefHat,
  Package,
  DollarSign,
  Clock,
  Search,
  Grid as GridIcon,
  List as ListIcon,
  UtensilsCrossed,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { createColumnHelper, useReactTable, getCoreRowModel, getExpandedRowModel } from '@tanstack/react-table';
import { SearchableDropdown } from '@/src/components/SearchableDropdown';
import { ExportButton } from '@/src/components/ExportButton';
import InfiniteTable from '@/src/components/InfiniteTable';
import { mockKitchenSales, mockProducts, type KitchenSaleTransaction, type KitchenSaleReportData } from '@/src/app/modules/pos/mockData';

const kitchenOptions = [
  { value: 'all', label: 'All Kitchens' },
  { value: 'Main Kitchen', label: 'Main Kitchen' },
  { value: 'Pizza Station', label: 'Pizza Station' },
  { value: 'Grill Station', label: 'Grill Station' },
  { value: 'Beverage Station', label: 'Beverage Station' },
];

const kdsOptions = [
  { value: 'all', label: 'All KDS' },
  { value: 'Main Kitchen', label: 'Main Kitchen' },
  { value: 'Pizza Station', label: 'Pizza Station' },
  { value: 'Grill Station', label: 'Grill Station' },
  { value: 'Beverage Station', label: 'Beverage Station' },
];

/**
 * Interface extended to include transactions for nested view
 */
interface ExtendedKitchenSaleReportData extends KitchenSaleReportData {
  transactions: KitchenSaleTransaction[];
}

// Grid View Card Component
const KitchenSaleCard: React.FC<{
  item: ExtendedKitchenSaleReportData;
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
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <UtensilsCrossed size={20} className="text-primary sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate ${textStyle}`}>{item.kdsName}</h3>
            <span className="text-xs text-textSecondary truncate block">Products: {item.totalProducts}</span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isExpanded ? 'text-primary' : 'text-gray-400'} transition-colors`}
          title={isExpanded ? "Hide Products" : "Show Products"}
        >
          {isExpanded ? <ChevronUp size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-textSecondary">Net Sale</span>
          <span className="font-bold text-base sm:text-lg text-primary">PKR {(item.netSale ?? 0).toFixed(2)}</span>
        </div>
        <div className={`h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />

        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Quantity Sold</span>
            <span className="font-semibold text-textPrimary truncate block">{item.totalSoldQuantity ?? 0}</span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-textSecondary block mb-1">Gross Sale</span>
            <span className="font-semibold text-textPrimary truncate block">PKR {(item.grossSale ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Expanded Product Details */}
      {isExpanded && (
        <div className={`mt-4 pt-3 border-t ${borderStyle}`}>
          <h4 className={`text-xs font-semibold mb-2 ${textStyle}`}>Product Breakdown</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {item.transactions.map((t, idx) => (
              <div key={idx} className={`p-2 rounded-lg text-xs ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium ${textStyle} line-clamp-1`}>{t.productName}</span>
                  <span className="text-primary font-bold shrink-0">PKR {t.amount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center text-textSecondary text-[10px]">
                  <span>Qty: {t.quantity}</span>
                  <span>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const columnHelper = createColumnHelper<ExtendedKitchenSaleReportData>();

const KitchenWiseReport: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [dateFrom, setDateFrom] = useState('2026-02-16');
  const [dateTo, setDateTo] = useState('2026-02-16');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedKDS, setSelectedKDS] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Generate product options from mockProducts
  const productOptions = useMemo(() => [
    { value: 'all', label: 'All Products' },
    ...mockProducts.map(product => ({
      value: product.id,
      label: product.name
    }))
  ], []);

  // Filter and Aggregate Data
  const { aggregatedData, totals } = useMemo(() => {
    let filteredTransactions = mockKitchenSales;

    // 1. Date Filter
    if (dateFrom || dateTo) {
      filteredTransactions = filteredTransactions.filter(item => {
        const itemDate = new Date(item.date);
        const start = dateFrom ? new Date(dateFrom) : null;
        const end = dateTo ? new Date(dateTo) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        return (!start || itemDate >= start) && (!end || itemDate <= end);
      });
    }

    // 2. Product Filter
    if (selectedProduct !== 'all') {
      filteredTransactions = filteredTransactions.filter(item => item.productId === selectedProduct);
    }

    // 3. KDS Filter
    if (selectedKDS !== 'all') {
      filteredTransactions = filteredTransactions.filter(item => item.kdsName === selectedKDS);
    }

    // Aggregate by KDS Name
    const aggregationMap = new Map<string, ExtendedKitchenSaleReportData>();

    filteredTransactions.forEach(t => {
      const existing = aggregationMap.get(t.kdsName) || {
        id: Math.random(), // Temporary ID
        kdsName: t.kdsName,
        totalProducts: 0,
        totalSoldQuantity: 0,
        grossSale: 0,
        totalSaleTax: 0,
        totalDiscount: 0,
        netSale: 0,
        transactions: [] // Initialize transactions array
      };

      existing.totalProducts += 1; // Assuming 1 row = 1 product entry
      existing.totalSoldQuantity += t.quantity;
      existing.grossSale += t.amount;
      existing.totalSaleTax += t.tax;
      existing.totalDiscount += t.discount;
      existing.netSale += (t.amount + t.tax - t.discount);
      existing.transactions.push(t); // Add transaction to array

      aggregationMap.set(t.kdsName, existing);
    });

    const data = Array.from(aggregationMap.values());

    // Calculate Global Totals
    const calculatedTotals = data.reduce((acc, curr) => ({
      totalSoldQuantity: acc.totalSoldQuantity + curr.totalSoldQuantity,
      grossSale: acc.grossSale + curr.grossSale,
      saleTax: acc.saleTax + curr.totalSaleTax,
      discount: acc.discount + curr.totalDiscount,
      netSale: acc.netSale + curr.netSale,
    }), {
      totalSoldQuantity: 0,
      grossSale: 0,
      saleTax: 0,
      discount: 0,
      netSale: 0
    });

    return { aggregatedData: data, totals: calculatedTotals };
  }, [dateFrom, dateTo, selectedProduct, selectedKDS]);

  const columns = useMemo(() => [
    columnHelper.accessor('kdsName', { header: 'Kds Name', cell: (info) => info.getValue() || 'N/A' }),
    columnHelper.accessor('totalProducts', { header: 'Total Products', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('totalSoldQuantity', { header: 'Total Sold Quantity', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('grossSale', { header: 'Gross Sale', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('totalSaleTax', { header: 'Total Sale Tax', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('totalDiscount', { header: 'Total Discount', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.accessor('netSale', { header: 'Net Sale', cell: (info) => (info.getValue() ?? 0).toFixed(2) }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => row.toggleExpanded()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            title={row.getIsExpanded() ? "Collapse" : "View Details"}
          >
            {row.getIsExpanded() ? <ChevronUp size={18} /> : <Eye size={18} />}
          </button>
          <button
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
            title="Delete Record"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }),
  ], []);

  const table = useReactTable({
    data: aggregatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  /**
   * Sub-component to render the nested table of transactions
   */
  const renderSubComponent = ({ row }: { row: any }) => {
    const transactions = row.original.transactions as KitchenSaleTransaction[];

    return (
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-sm font-bold mb-3 ${textStyle}`}>
          Product Breakdown: {row.original.kdsName}
        </h4>
        <div className={`rounded-lg border ${borderStyle} overflow-hidden`}>
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Quantity</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Tax</th>
                <th className="px-4 py-3 text-right">Discount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((t, idx) => (
                <tr key={idx} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                  <td className={`px-4 py-2 font-medium ${textStyle}`}>{t.productName}</td>
                  <td className={`px-4 py-2 text-textSecondary`}>{t.date}</td>
                  <td className={`px-4 py-2 text-right text-textPrimary`}>{t.quantity}</td>
                  <td className={`px-4 py-2 text-right text-primary font-bold`}>{t.amount.toFixed(2)}</td>
                  <td className={`px-4 py-2 text-right text-textSecondary`}>{t.tax.toFixed(2)}</td>
                  <td className={`px-4 py-2 text-right text-textSecondary`}>{t.discount.toFixed(2)}</td>
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
      {/* Header Section (Stats Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Total Sold Quantity', value: (totals.totalSoldQuantity ?? 0).toFixed(2) },
          { label: 'Gross Sale', value: (totals.grossSale ?? 0).toFixed(2) },
          { label: 'Sale Tax', value: (totals.saleTax ?? 0).toFixed(2) },
          { label: 'Discount', value: (totals.discount ?? 0).toFixed(2) },
          { label: 'Net Sale', value: (totals.netSale ?? 0).toFixed(2), isPrimary: true },
        ].map((item, idx) => (
          <div key={idx} className={`${item.isPrimary ? 'bg-primary/10 border-primary/20' : cardStyle} rounded-xl p-4 sm:p-6 border ${item.isPrimary ? 'border-primary/20' : borderStyle} hover:shadow-sm transition-all group`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[10px] sm:text-xs font-semibold ${item.isPrimary ? 'text-primary' : (item.label === 'Total Sold Quantity' || item.label === 'Gross Sale' ? 'text-primary' : 'text-textSecondary')}`}>{item.label}</span>
            </div>
            <div className={`text-xl sm:text-2xl font-black truncate ${item.isPrimary ? 'text-primary' : (item.label === 'Total Sold Quantity' || item.label === 'Gross Sale' ? 'text-primary' : textStyle)}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className={`${cardStyle} rounded-xl p-4 sm:p-6 border ${borderStyle}`}>
        <div className="flex flex-col lg:flex-row items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
            {/* From Date */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm`}
              />
            </div>
            {/* To Date */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${borderStyle} ${isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-gray-900'} focus:ring-1 focus:ring-primary outline-none text-sm`}
              />
            </div>
            {/* Select Product */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block">Product</label>
              <SearchableDropdown
                options={productOptions}
                value={selectedProduct}
                onChange={setSelectedProduct}
                placeholder="Select Product"
                isDarkMode={isDarkMode}
              />
            </div>
            {/* Select KDS Name */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-textSecondary mb-1 block">KDS</label>
              <SearchableDropdown
                options={kdsOptions}
                value={selectedKDS}
                onChange={setSelectedKDS}
                placeholder="Select KDS Name"
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          <ExportButton 
            filename="KitchenWise_Sale_Report"
            title="Kitchen Wise Sale Report"
            headers={['Kds Name', 'Total Products', 'Total Sold Quantity', 'Gross Sale', 'Total Sale Tax', 'Total Discount', 'Net Sale']}
            data={aggregatedData.map(item => [
              item.kdsName || 'N/A',
              (item.totalProducts ?? 0).toFixed(2),
              (item.totalSoldQuantity ?? 0).toFixed(2),
              (item.grossSale ?? 0).toFixed(2),
              (item.totalSaleTax ?? 0).toFixed(2),
              (item.totalDiscount ?? 0).toFixed(2),
              (item.netSale ?? 0).toFixed(2)
            ])}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-bold ${textStyle}`}>Kitchen Wise Sale Report</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded border ${borderStyle} ${viewMode === 'list' ? 'bg-primary text-white border-primary' : `${cardStyle}`}`}
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded border ${borderStyle} ${viewMode === 'grid' ? 'bg-primary text-white border-primary' : `${cardStyle}`}`}
            >
              <GridIcon size={18} />
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className={`rounded-xl border ${borderStyle} overflow-hidden`}>
            <InfiniteTable
              table={table}
              isDarkMode={isDarkMode}
              total={aggregatedData.length}
              itemName="records"
              renderSubComponent={renderSubComponent}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {aggregatedData.map((item) => (
              <KitchenSaleCard key={item.id} item={item} isDarkMode={isDarkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenWiseReport;

