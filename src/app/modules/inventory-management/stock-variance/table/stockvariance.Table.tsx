import React, { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InfiniteTable from '../../../../../components/InfiniteTable';
import { ColumnToggle } from '../../../../../components/ColumnToggle';
import { useInfiniteTable } from '../../../../../hooks/useInfiniteTable';
import { getThemeColors } from '../../../../../theme/colors';
import { SearchInput } from '../../../../../components/SearchInput';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { format } from "date-fns";
import {useEffect} from "react";
 
const PAGE_SIZE = 20;

const generateSampleVariance = (count: number) => {
	const products = [
		'Margherita Pizza', 'Pepperoni Pizza', 'Cheeseburger', 'Veg Burger', 'Chicken Wings',
		'French Fries', 'Coke', 'Garlic Bread', 'Pasta Alfredo', 'Chocolate Brownie'
	];

	return Array.from({ length: count }).map((_, idx) => {
		const p = products[idx % products.length];
		const today = Date.now();
		const daysAgo = idx % 30;
		const date = new Date(today - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0,10);

		return {
			id: `sv-${idx+1}`,
			productName: p,
			uom: idx % 2 === 0 ? 'pcs' : 'plate',
			convUnit: 1,
			costPrice: 100 + (idx % 5) * 10,
			openingStock: 10 + idx,
			purchasingStock: (idx % 3) * 2,
			stockUsage: (idx % 4),
			stockWastage: (idx % 2),
			stockAdjustment: 0,
			availableStock: 10 + (idx % 7),
			actualClosing: 8 + (idx % 5),
			varianceQty: ((idx % 3) - 1),
			stockValue: ((100 + (idx % 5) * 10) * (8 + (idx % 5))).toFixed(2),
			variancePercent: (((idx % 3) - 1) / Math.max(1, 8 + (idx % 5)) * 100).toFixed(2),
			date,
		};
	});
};

const columns = (isDarkMode = false) => [
	{ accessorKey: 'productName', header: 'Product Name', size: 220 },
	{ accessorKey: 'uom', header: 'UOM', size: 80 },
	{ accessorKey: 'convUnit', header: 'Conv Unit', size: 90 },
	{ accessorKey: 'costPrice', header: 'Cost Price', size: 120 },
	{ accessorKey: 'openingStock', header: 'Opening Stock', size: 120 },
	{ accessorKey: 'purchasingStock', header: 'Purchasing Stock', size: 140 },
	{ accessorKey: 'stockUsage', header: 'Stock Usage', size: 120 },
	{ accessorKey: 'stockWastage', header: 'Stock Wastage', size: 120 },
	{ accessorKey: 'stockAdjustment', header: 'Stock Adjustment', size: 140 },
	{ accessorKey: 'availableStock', header: 'Available Stock', size: 140 },
	{ accessorKey: 'actualClosing', header: 'Actual Closing', size: 120 },
	{ accessorKey: 'varianceQty', header: 'Variance Qty', size: 120 },
	{ accessorKey: 'stockValue', header: 'Stock Value', size: 140 },
	{ accessorKey: 'variancePercent', header: 'Variance %', size: 120 },
	{ accessorKey: 'date', header: 'Date', size: 120 },
];

const StockVarianceTable: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
	const theme = getThemeColors(isDarkMode);
	const cardStyle = `rounded-xl shadow-sm p-6 ${theme.neutral.background}`;
	const inputStyle = `px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${theme.input.background} ${theme.border.input} ${theme.text.primary}`;

	const { control, watch, setValue } = useForm({
		defaultValues: {
			searchTerm: '',
			fromDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
			toDate: format(new Date(), "yyyy-MM-dd"),
		},
	});

	const searchTerm = watch('searchTerm');
	const fromDate = watch("fromDate");
	const toDate = watch("toDate");

	const [activeButton, setActiveButton] = useState<string>('Description');

	const handleButtonClick = (buttonName: string) => {
		setActiveButton(buttonName);
		console.log(`${buttonName} clicked`);
	};

	const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
		productName: true,
		uom: true,
		convUnit: true,
		costPrice: true,
		openingStock: true,
		purchasingStock: true,
		stockUsage: true,
		stockWastage: true,
		stockAdjustment: true,
		availableStock: true,
		actualClosing: true,
		varianceQty: true,
		stockValue: true,
		variancePercent: true,
		date: true,
	});

	const [rowsData, setRowsData] = useState<any[]>(() => generateSampleVariance(PAGE_SIZE));

	const { table, isLoading, hasNextPage, loadMore } = useInfiniteTable<any>({
		columns: columns(isDarkMode),
		data: rowsData,
		pageSize: PAGE_SIZE,
	});

	const today = new Date();
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(today.getDate() - 30);

	const [dateRange, setDateRange] = useState({
		from: format(thirtyDaysAgo, "yyyy-MM-dd"),
		to: format(today, "yyyy-MM-dd"),
	});

	useEffect(() => {
		// Automatically filter data when the component mounts with the default date range
		setRowsData(
			generateSampleVariance(PAGE_SIZE).filter((row) => {
				const rowDate = new Date(row.date);
				return rowDate >= new Date(fromDate) && rowDate <= new Date(toDate);
			})
		);
	}, [fromDate, toDate]);

	const handleDateChange = (field: "fromDate" | "toDate", value: string) => {
		setValue(field, value);
		setRowsData(
			generateSampleVariance(PAGE_SIZE).filter((row) => {
				const rowDate = new Date(row.date);
				return rowDate >= new Date(fromDate) && rowDate <= new Date(toDate);
			})
		);
	};

	const filtered = useMemo(() => {
		if (!table.getRowModel) return [];
		let rows = table.getRowModel().rows;

		if (searchTerm) {
			const s = searchTerm.toLowerCase();
			rows = rows.filter(r => (r.original.productName || '').toLowerCase().includes(s) || (r.original.uom || '').toLowerCase().includes(s));
		}

		if (dateRange.from && dateRange.to) {
			rows = rows.filter((r) => {
				const rowDate = new Date(r.original.date);
				return rowDate >= new Date(dateRange.from) && rowDate <= new Date(dateRange.to);
			});
		}

		return rows;
	}, [table, searchTerm, dateRange]);

	const toggleColumn = (id: string) => setColumnVisibility(prev => ({ ...prev, [id]: !prev[id] }));

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [description, setDescription] = useState('');

	const handleSaveDescription = () => {
		console.log('Description saved:', description);
		setIsModalOpen(false);
	};

	return (
		<div className={cardStyle}>
			<div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-6">
  <button
    className={`
      flex-1 sm:flex-none
      text-xs sm:text-sm
      px-3 sm:px-4
      py-2 sm:h-10
      rounded-lg
      transition-colors
      whitespace-nowrap
      ${
        activeButton === "Description"
          ? `${theme.button.primary} border`
          : `${theme.text.primary} border ${theme.border.input}`
      }
    `}
    onClick={() => {
      handleButtonClick("Description");
      setIsModalOpen(true);
    }}
  >
    Description
  </button>

  <button
    className={`
      flex-1 sm:flex-none
      text-xs sm:text-sm
      px-3 sm:px-4
      py-2 sm:h-10
      rounded-lg
      transition-colors
      whitespace-nowrap
      ${
        activeButton === "Add All Product"
          ? `${theme.button.primary} border`
          : `${theme.text.primary} border ${theme.border.input}`
      }
    `}
    onClick={() => handleButtonClick("Add All Product")}
  >
    Add All Product
  </button>
</div>
			<ReusableModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="Add Description"
				isDarkMode={isDarkMode}
			>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full h-32 p-2 border rounded-md"
					placeholder="Enter description here..."
				/>
				<div className="flex justify-end mt-4">
					<button
						onClick={handleSaveDescription}
						className={`px-4 py-2 rounded-lg ${theme.button.primary} hover:${theme.button.hover}`}
					>
						Save
					</button>
				</div>
			</ReusableModal>

			<div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">

  <SearchInput
    control={control}
    placeholder="Search products..."
    inputStyle={inputStyle}
    isDarkMode={isDarkMode}
  />

  <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full sm:w-auto">
    <div className="flex flex-col w-full sm:w-auto">
      <label className="text-xs text-gray-500 mb-1">From</label>
      <Controller
        name="fromDate"
        control={control}
        render={({ field }) => (
          <input
            type="date"
            {...field}
            className={`${inputStyle} h-10 w-full sm:w-auto`}
            onChange={(e) => handleDateChange("fromDate", e.target.value)}
          />
        )}
      />
    </div>

    <div className="flex flex-col w-full sm:w-auto">
      <label className="text-xs text-gray-500 mb-1">To</label>
      <Controller
        name="toDate"
        control={control}
        render={({ field }) => (
          <input
            type="date"
            {...field}
            className={`${inputStyle} h-10 w-full sm:w-auto`}
            onChange={(e) => handleDateChange("toDate", e.target.value)}
          />
        )}
      />
    </div>

    <button
      className={`sm:px-6 px-2 h-10 rounded-lg transition-colors ${theme.button.primary} hover:${theme.button.hover}`}
      type="button"
      onClick={() => {
        setRowsData(
          generateSampleVariance(PAGE_SIZE).filter((row) => {
            const rowDate = new Date(row.date);
            return rowDate >= new Date(fromDate) && rowDate <= new Date(toDate);
          })
        );
      }}
    >
      Update
    </button>
  </div>
</div>

			<InfiniteTable
				table={table}
				isLoading={isLoading}
				hasNextPage={hasNextPage}
				onLoadMore={undefined}
				itemName="stock variance rows"
				emptyComponent={<div className={`text-center py-8 ${theme.text.tertiary}`}>No variance rows found</div>}
				columnVisibility={columnVisibility}
				rows={searchTerm ? filtered : undefined}
				className="max-h-[600px]"
				isDarkMode={isDarkMode}
			/>
		</div>
	);
};

export default StockVarianceTable;
