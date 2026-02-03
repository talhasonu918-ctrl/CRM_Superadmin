import React from 'react';
import { mockQueueOrders } from '../mockData';
import { OrderQueueTable } from '../table/table';
import { getThemeColors } from '../../../../theme/colors';

interface OrderQueueViewProps {
  isDarkMode?: boolean;
}

export const OrderQueueView: React.FC<OrderQueueViewProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);
  const handlePayment = (order: any) => {
    console.log('Payment for order:', order);
  };

  const handleMarkPaid = (order: any) => {
    console.log('Mark paid order:', order);
  };

  const handleEdit = (order: any) => {
    console.log('Edit order:', order);
  };

  const handleCancel = (order: any) => {
    console.log('Cancel order:', order);
  };

  const handlePrint = (order: any) => {
    console.log('Print order:', order);
  };

  return (
    <div className={`min-h-[calc(100vh-16rem)] p-6 ${theme.neutral.background}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
          Current Order 
        </h1>
      </div>

      <OrderQueueTable
        isDarkMode={isDarkMode}
        orders={mockQueueOrders}
        onPayment={handlePayment}
        onMarkPaid={handleMarkPaid}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onPrint={handlePrint}
      />
    </div>
  );
};
