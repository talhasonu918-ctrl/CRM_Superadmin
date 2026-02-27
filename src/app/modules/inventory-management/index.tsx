'use client';

import React, { useState, useMemo } from 'react';
import {   UserPlus,   Layers,   Archive,   FileBarChart,   Presentation,   FileText,   FilePlus,   Package,   ArrowLeft, ChevronRight } from 'lucide-react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { getThemeColors } from '../../../theme/colors';
import { GridView, GridViewItem } from '../../../components/GridView';

// Import sub-views
import { StockLocationView } from './stock-location';
import { StocksGRNView } from './stocks-grn';
import { StockTransferView } from './stock-transfer';
import { StockAdjustmentView } from './stock-adjustment';
import { StockVarianceView } from './stock-variance';
import { PurchaseOrderView } from './purchase-order';
import { DemandView } from './demand';
import StockReportView  from './stock-report';
import { StockMovementReportView } from './stock-movement-report';
import InventoryProductsView from './inventory-products';

type ViewType = 'dashboard' | 'stock-location' | 'stocks-grn' | 'stock-transfer' | 'stock-adjustment' | 'stock-variance' | 'purchase-order' | 'demand' | 'stock-report' | 'stock-movement-report' | 'inventory-products';

 const InventoryManagementView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const theme = getThemeColors(isDarkMode);

  const inventoryItems = useMemo(() => [
    { id: 'stock-location', title: 'Stock Location', icon: <UserPlus size={28} /> },
    { id: 'stocks-grn', title: 'Stocks / GRN', icon: <Layers size={28} /> },
    { id: 'stock-transfer', title: 'Stock Transfer', icon: <Archive size={28} /> },
    { id: 'stock-adjustment', title: 'Stock Adjustment', icon: <FileBarChart size={28} /> },
    { id: 'stock-variance', title: 'Stock Variance', icon: <Presentation size={28} /> },
    { id: 'purchase-order', title: 'Purchase Order', icon: <FileText size={28} /> },
    { id: 'demand', title: 'Demand', icon: <FilePlus size={28} /> },
    { id: 'stock-report', title: 'Stock Report', icon: <FileText size={28} /> },
    { id: 'stock-movement-report', title: 'Stock Movement Report', icon: <Presentation size={28} /> },
    { id: 'inventory-products', title: 'Inventory Products', icon: <Package size={28} /> },
  ], []);

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Module Name',
      cell: ({ row }: any) => {
        const item = row.original;
        return (
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div className={theme.primary.text}>
                {React.isValidElement(item.icon) ? (
                  React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })
                ) : item.icon ? (
                  (() => {
                    const IconComp = item.icon as any;
                    return <IconComp size={18} />;
                  })()
                ) : null}
              </div>
            </div>
            <span className={`text-sm font-medium ${theme.text.primary}`}>{item.title}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      cell: () => (
        <div className="flex justify-end items-center gap-2">
          <span className={`text-xs font-semibold ${theme.primary.text}`}>Open Module</span>
          <ChevronRight size={16} className={theme.primary.text} />
        </div>
      ),
    },
  ], [isDarkMode, theme]);

  const table = useReactTable({
    data: inventoryItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderView = () => {
    switch (activeView) {
      case 'stock-location': return <StockLocationView isDarkMode={isDarkMode} />;
      case 'stocks-grn': return <StocksGRNView isDarkMode={isDarkMode} />;
      case 'stock-transfer': return <StockTransferView isDarkMode={isDarkMode} />;
      case 'stock-adjustment': return <StockAdjustmentView isDarkMode={isDarkMode} />;
      case 'stock-variance': return <StockVarianceView isDarkMode={isDarkMode} />;
      case 'purchase-order': return <PurchaseOrderView isDarkMode={isDarkMode} />;
      case 'demand': return <DemandView isDarkMode={isDarkMode} />;
      case 'stock-report': return <StockReportView isDarkMode={isDarkMode} />;
      case 'stock-movement-report': return <StockMovementReportView isDarkMode={isDarkMode} />;
      case 'inventory-products': return <InventoryProductsView isDarkMode={isDarkMode} />;
      default:
        return (
          <div className="p-4 sm:p-5">
            <GridView
              title="Inventory Management System"
              isDarkMode={isDarkMode}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              items={inventoryItems}
              onItemClick={(item: GridViewItem) => setActiveView(item.id as ViewType)}
              table={table}
              itemName="modules"
              gridClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
              renderCustomCard={(item: GridViewItem) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewType)}
                  className={`flex flex-col items-center justify-center p-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border ${
                    isDarkMode 
                      ? 'bg-[#16191F] border-slate-800 hover:border-primary/50 text-white' 
                      : 'bg-white border-slate-100 hover:border-primary/50 text-slate-900  shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    <div className="text-primary">
                      {React.isValidElement(item.icon) ? (
                        item.icon
                      ) : item.icon ? (
                        (() => {
                          const IconComp = item.icon as any;
                          return <IconComp size={28} />;
                        })()
                      ) : null}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-center tracking-tight">{item.title}</span>
                </button>
              )}
            />
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0F1115]' : 'bg-white'}`}>
      {activeView !== 'dashboard' && (
        <div className="p-4 flex items-center gap-4 bg-transparent">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'
            }`}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      )}
      {renderView()}
    </div>
  );
};

export default InventoryManagementView;

