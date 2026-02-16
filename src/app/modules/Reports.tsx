'use client';

import React, { useState } from 'react';
import { 
  FileText, Bike, Receipt, Clock, ChefHat, 
  Users, DollarSign, User, Layers
} from 'lucide-react';
import ItemWiseReport from './reports/ItemWiseReport';
import RiderWiseReport from './reports/RiderWiseReport';
import TransactionReport from './reports/TransactionReport';
import KitchenWiseReport from './reports/KitchenWiseReport';
import KitchenOrderReadyTimeReport from './reports/KitchenOrderReadyTimeReport';

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

  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const reportCards = [
    { id: 'item-wise', name: 'Item Wise Sale Report', icon: FileText, color: 'text-white', bgColor: 'bg-primary dark:bg-priamry' },
    { id: 'transaction', name: 'Transaction Report', icon: Receipt, color: 'text-white', bgColor: 'bg-primary dark:bg-priamry' },
    // { id: 'category-wise', name: 'Category Wise Sale Report', icon: Layers, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'customer-ledger', name: 'Customer Ledger', icon: User, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'supplier-ledger', name: 'Supplier Ledger', icon: User, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'waiter', name: 'Waiter Report', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'user-wise-sale', name: 'User Wise Sale Report', icon: User, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'supplier-wise-purchase', name: 'Supplier Wise Purchase Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'item-location-transfer', name: 'Item Wise Location Transfer Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'location-item-transfer', name: 'Location Wise Item Transfer Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'sales-summary', name: 'Sales Summary', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'discount', name: 'Discount Report', icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'customer-wise-sale', name: 'Customer Wise Sale Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'item-recipe-consumption', name: 'Item Wise Recipe Consumption Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'item-sale-details', name: 'Item Wise Sale Details Report', icon: FileText, color: 'text-primary', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'gross-profit', name: 'Gross Profit Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'payment-mode-wise', name: 'Payment Mode Wise Sale Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'invoice-type-wise', name: 'Invoice Type Wise Sale Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'user-item-sale', name: 'User Wise Item Sale Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'item-wise-purchase', name: 'Item Wise Purchase Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'kitchen-wise', name: 'Kitchen Wise Sale Report', icon: FileText, color: 'text-white', bgColor: 'bg-primary dark:bg-priamry' },
    // { id: 'hourly-wise', name: 'Hourly Wise Sale Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'deals', name: 'Deals Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    // { id: 'cancellation', name: 'Cancellation Report', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'kitchen-ready-time', name: 'Kitchen Order Ready Time Report', icon: FileText, color: 'text-white', bgColor: 'bg-primary dark:bg-primary' },
    // { id: 'pl', name: 'P&L Report', icon: Layers, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'rider-wise', name: 'Rider Report', icon: Bike, color: 'text-white', bgColor: 'bg-primary dark:bg-primary' },
  ];

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
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedReport(null)}
            className={`px-4 py-2 rounded-lg border ${borderStyle} ${cardStyle} hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Reports
          </button>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Reports</h2>
          <p className="text-slate-400 text-sm font-medium">Comprehensive business analytics and insights</p>
        </div>
      </div>

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
              <h3 className={`text-sm font-semibold ${textStyle}`}>{report.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};
