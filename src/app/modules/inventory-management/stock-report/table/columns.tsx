import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';
// Use `any` for rows in this purchase-order columns file to avoid coupling
// to the user type from the shared hook.
import { getThemeColors } from '../../../../../theme/colors';

interface UserColumnProps {
  onEdit?: (row: any, rowIndex?: number) => void;
  onView?: (row: any, rowIndex?: number) => void;
  onDelete?: (row: any, rowIndex?: number) => void;
  isDarkMode?: boolean;
}

export const userColumns = ({ onEdit, onView, onDelete, isDarkMode = false }: UserColumnProps = {}): ColumnDef<any>[] => {
  const theme = getThemeColors(isDarkMode);
  return [
    {
      accessorKey: 'productName',
      header: 'Product Name',
      size: 160,
      cell: ({ row }) => {
        const name = row.original?.productName;
        return (
          <span
            className={`font-semibold text-xs sm:text-sm block truncate max-w-[140px] sm:max-w-none ${theme.text.primary}`}
            title={name}
          >
            {name || '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'uom',
      header: 'UOM',
      size: 90,
      cell: ({ getValue }) => <span>{(getValue() as string) ?? '-'}</span>,
    },
   
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      size: 100,
      cell: ({ getValue }) => <span>{(getValue() as number) ?? '-'}</span>,
    },
    {
      accessorKey: 'bonusQty',
      header: () => <span className="whitespace-nowrap">Bonus Qty</span>,
      size: 120,
      cell: ({ getValue }) => <span>{(getValue() as number) ?? '-'}</span>,
    },
    {
      accessorKey: 'costPrice',
      header: 'Cost Price',
      size: 120,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span>;
      },
    },
    {
      accessorKey: 'saleTax',
      header: 'Sale Tax',
      size: 100,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span>;
      },
    },
    {
      accessorKey: 'totalCost',
      header: 'Total Cost',
      size: 120,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span>;
      },
    },
    {
      accessorKey: 'discount',
      header: 'Discount',
      size: 100,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span>;
      },
    },
    {
      accessorKey: 'netCost',
      header: 'Net Cost',
      size: 120,
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 100,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView?.(user, row.index)}
              className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-blue-900/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit?.(user, row.index)}
              className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-orange-900/20 text-orange-400' : 'hover:bg-orange-50 text-orange-600'}`}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete?.(user, row.index)}
              className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];
};

// Stock report specific columns and mock data
export const stockReportColumns = (isDarkMode = false): ColumnDef<any>[] => {
  const theme = getThemeColors(isDarkMode);
  return [
    { accessorKey: 'productId', header: 'Product ID', size: 120 },
    { accessorKey: 'product', header: 'Product', size: 220 },
    { accessorKey: 'category', header: 'Category', size: 150 },
    { accessorKey: 'subCategory', header: 'Sub Category', size: 150 },
    { accessorKey: 'costPrice', header: 'Cost Price', size: 120, cell: ({ getValue }) => {
      const v = getValue() as number | undefined; return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span> } },
    { accessorKey: 'salePrice', header: 'Sale Price', size: 120, cell: ({ getValue }) => {
      const v = getValue() as number | undefined; return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span> } },
    { accessorKey: 'retailPrice', header: 'Retail', size: 120, cell: ({ getValue }) => {
      const v = getValue() as number | undefined; return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span> } },
    { accessorKey: 'stockStatus', header: 'Stock In/Out', size: 120 },
    { accessorKey: 'uom', header: 'UOM', size: 90 },
    { accessorKey: 'availableStock', header: 'Available Stock', size: 120 },
    { accessorKey: 'totalRetailPrice', header: 'Total Retail Price', size: 160, cell: ({ getValue }) => {
      const v = getValue() as number | undefined; return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span> } },
    { accessorKey: 'totalCostPrice', header: 'Total Cost Price', size: 160, cell: ({ getValue }) => {
      const v = getValue() as number | undefined; return <span>{typeof v === 'number' ? `Rs. ${v.toFixed(2)}` : '-'}</span> } },
  ];
};

// Generate 10 sample rows
export const mockStockReportData = (() => {
  const items = [
    { id: 'P001', name: 'Margherita Pizza', category: 'Pizza', sub: 'Classic', cost: 250, sale: 400, retail: 450, uom: 'pcs', stock: 20 },
    { id: 'P002', name: 'Pepperoni Pizza', category: 'Pizza', sub: 'Spicy', cost: 270, sale: 420, retail: 470, uom: 'pcs', stock: 15 },
    { id: 'P003', name: 'Cheeseburger', category: 'Burgers', sub: 'Beef', cost: 150, sale: 260, retail: 300, uom: 'pcs', stock: 30 },
    { id: 'P004', name: 'Veg Burger', category: 'Burgers', sub: 'Veg', cost: 120, sale: 220, retail: 250, uom: 'pcs', stock: 25 },
    { id: 'P005', name: 'Chicken Wings', category: 'Wings', sub: 'Spicy', cost: 200, sale: 350, retail: 380, uom: 'plate', stock: 12 },
    { id: 'P006', name: 'French Fries', category: 'Sides', sub: 'Regular', cost: 60, sale: 120, retail: 140, uom: 'box', stock: 50 },
    { id: 'P007', name: 'Coke', category: 'Drinks', sub: 'Cold', cost: 30, sale: 80, retail: 90, uom: 'bottle', stock: 100 },
    { id: 'P008', name: 'Garlic Bread', category: 'Sides', sub: 'Garlic', cost: 80, sale: 150, retail: 170, uom: 'pcs', stock: 18 },
    { id: 'P009', name: 'Pasta Alfredo', category: 'Pasta', sub: 'Creamy', cost: 220, sale: 380, retail: 410, uom: 'plate', stock: 10 },
    { id: 'P010', name: 'Chocolate Brownie', category: 'Dessert', sub: 'Chocolate', cost: 90, sale: 180, retail: 200, uom: 'pcs', stock: 22 },
  ];

  const today = new Date().toISOString().slice(0, 10);

  return items.map((it, idx) => ({
    productId: it.id,
    product: it.name,
    category: it.category,
    subCategory: it.sub,
    costPrice: it.cost,
    salePrice: it.sale,
    retailPrice: it.retail,
    stockStatus: it.stock > 0 ? 'In Stock' : 'Out of Stock',
    uom: it.uom,
    availableStock: it.stock,
    totalRetailPrice: +(it.retail * it.stock),
    totalCostPrice: +(it.cost * it.stock),
    // Spread dates across the last 5 days so filtering has some range
    date: new Date(Date.now() - (idx % 5) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) || today,
  }));
})();
