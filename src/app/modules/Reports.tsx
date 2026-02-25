'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, Bike, Receipt, Clock, ChefHat, 
  Users, DollarSign, User, Layers, LayoutGrid, List, ChevronRight
} from 'lucide-react';
import ItemWiseReport from './reports/item-wise-sale';
import RiderWiseReport from './reports/rider-report';
import TransactionReport from './reports/transaction';
import { HiOutlineArrowLeft } from "react-icons/hi";
import KitchenWiseReport from './reports/kitchen-wise-sale';
import KitchenOrderReadyTimeReport from './reports/kitchen-order-ready-time';
import {
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import InfiniteTable from '../../components/InfiniteTable';
import { getThemeColors } from '../../theme/colors';

// Placeholder component for other reports
const ComingSoonReport: React.FC<{ isDarkMode: boolean; title: string }> = ({ isDarkMode, title }) => {
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  return (
    <div className="space-y-4">
      <div className={`${cardStyle} rounded-lg p-8 border ${borderStyle} text-center`}>
        <div className="mb-4">
          <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${textStyle}`}>{title}</h3>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Coming Soon
        </p>
      </div>
    </div>
  );
};

export const ReportsView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const theme = getThemeColors(isDarkMode);
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const reportCards = useMemo(() => [
    { id: 'item-wise', name: 'Item Wise Sale Report', icon: FileText, color: 'text-white', bgColor: 'bg-primary' },
    { id: 'transaction', name: 'Transaction Report', icon: Receipt, color: 'text-white', bgColor: 'bg-primary' },
    { id: 'kitchen-wise', name: 'Kitchen Wise Sale Report', icon: FileText, color: 'text-white', bgColor: 'bg-primary' },
    { id: 'kitchen-ready-time', name: 'Kitchen Order Ready Time Report', icon: FileText, color: 'text-white', bgColor: 'bg-primary' },
    { id: 'rider-wise', name: 'Rider Report', icon: Bike, color: 'text-white', bgColor: 'bg-primary' },
  ], []);

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Report Name',
      cell: ({ row }: any) => {
        const report = row.original;
        const Icon = report.icon;
        return (
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <Icon size={18} className={theme.primary.text} />
            </div>
            <span className={`text-sm font-medium ${theme.text.primary}`}>{report.name}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      cell: () => (
        <div className="flex justify-end items-center gap-2">
          <span className={`text-xs font-semibold ${theme.primary.text}`}>View Report</span>
          <ChevronRight size={16} className={theme.primary.text} />
        </div>
      ),
    },
  ], [isDarkMode, theme]);

  const table = useReactTable({
    data: reportCards,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderReportDetail = () => {
    switch (selectedReport) {
      case 'item-wise':
        return <ItemWiseReport isDarkMode={isDarkMode} />;
      case 'rider-wise':
        return <RiderWiseReport isDarkMode={isDarkMode} />;
      case 'transaction':
        return <TransactionReport isDarkMode={isDarkMode} />;
      case 'kitchen-wise':
        return <KitchenWiseReport isDarkMode={isDarkMode} />;
      case 'kitchen-ready-time':
        return <KitchenOrderReadyTimeReport isDarkMode={isDarkMode} />;
      default:
        return (
          <div className={`${cardStyle} rounded-lg p-8 border ${borderStyle} text-center`}>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Report coming soon
            </p>
          </div>
        );
    }
  };

  // If a report is selected, show the detail view
  if (selectedReport) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <button
            onClick={() => setSelectedReport(null)}
            className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg border ${borderStyle} ${cardStyle} hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-base`}
          >
            <HiOutlineArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-base ">Back to Reports</span>
          </button>
          <div>
            <h2 className="text-[18px] sm:text-4xl font-medium tracking-tight  whitespace-nowrap sm:whitespace-normal">
              {reportCards.find(r => r.id === selectedReport)?.name}
            </h2>
          </div>
        </div>
        {renderReportDetail()}
      </div>
    );
  }

  // Grid view of all reports
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl sm:text-3xl font-medium tracking-tight">Reports</h2>
          <p className="text-slate-400 text-sm font-medium">Comprehensive business analytics and insights</p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg border-2 transition-all duration-200 ${viewMode === 'grid' 
              ? `${theme.primary.text} ${theme.primary.border} ${theme.neutral.card} shadow-sm` 
              : `${theme.text.tertiary} ${theme.border.main} ${theme.neutral.card} opacity-60 hover:opacity-100`
            }`}
            title="Grid View"
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg border-2 transition-all duration-200 ${viewMode === 'list' 
              ? `${theme.primary.text} ${theme.primary.border} ${theme.neutral.card} shadow-sm` 
              : `${theme.text.tertiary} ${theme.border.main} ${theme.neutral.card} opacity-60 hover:opacity-100`
            }`}
            title="List View"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {reportCards.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`${cardStyle} rounded-lg p-6 border ${borderStyle} hover:shadow-lg transition-all cursor-pointer hover:scale-105 flex flex-col items-center justify-center text-center gap-3 min-h-[140px]`}
              >
                <div className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <h3 className={`text-sm font-medium ${textStyle}`}>{report.name}</h3>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`overflow-hidden rounded-xl border ${theme.border.main} ${theme.neutral.card}`}>
          <InfiniteTable
            table={table}
            isDarkMode={isDarkMode}
            className="max-h-none"
            total={reportCards.length}
            itemName="reports"
            rows={table.getRowModel().rows.map(row => ({
              ...row,
              onClick: () => setSelectedReport(row.original.id)
            } as any))}
          />
        </div>
      )}
    </div>
  );
};
