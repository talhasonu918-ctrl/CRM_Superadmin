import React, { useState } from 'react';
import PurchaseOrderTable from './table/table'; // use default export from table
import { ExportButton } from '../../../../components/ExportButton';
import { stockReportColumns } from './table/columns';

const StockReportPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [totals, setTotals] = React.useState({ totalRetail: 0, totalCost: 0 });
  const [tableData, setTableData] = useState<any[]>([]); // State to hold table data

  const headers = stockReportColumns().map((col) => col.header as string);

  return (
    <div className="purchase-order-page">
      <h1 className="text-2xl font-bold mb-4">Stock Report</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-md p-4 bg-blue-50">
          <p className="text-sm text-blue-700">Total Cost Price</p>
          <p className="text-2xl font-semibold">{totals.totalCost.toFixed(2)} PKR</p>
        </div>
        <div className="rounded-md p-4 bg-blue-50">
          <p className="text-sm text-blue-700">Total Retail Price</p>
          <p className="text-2xl font-semibold">{totals.totalRetail.toFixed(2)} PKR</p>
        </div>
      </div>

      <PurchaseOrderTable
        isDarkMode={isDarkMode}
        onTotalsChange={(t) => setTotals(t)}
        onDataChange={(data) => setTableData(data)} // Pass data to state
      />
    </div>
  );
};

export default StockReportPage;

