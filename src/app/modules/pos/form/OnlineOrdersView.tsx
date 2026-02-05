import React from 'react';
import { mockOnlineOrders } from '../mockData';
import { OrderQueueTable } from '../table/table';
import { getThemeColors } from '../../../../theme/colors';

interface OnlineOrdersViewProps {
  isDarkMode?: boolean;
}

export const OnlineOrdersView: React.FC<OnlineOrdersViewProps> = ({ isDarkMode = false }) => {
  const theme = getThemeColors(isDarkMode);

  const handlePayment = (order: any) => {
    console.log('Payment for online order:', order);
  };

  const handleMarkPaid = (order: any) => {
    console.log('Mark paid online order:', order);
  };

  const handleEdit = (order: any) => {
    console.log('Edit online order:', order);
  };

  const handleCancel = (order: any) => {
    console.log('Cancel online order:', order);
  };

  const handlePrint = (order: any) => {
    console.log('Print online order:', order);
  };

  return (
    <div className={`min-h-[calc(100vh-16rem)] p-3 sm:p-4 lg:p-6 ${theme.neutral.background}`}>
      <div className="mb-4 lg:mb-6">
        <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${theme.text.primary}`}>Online Orders</h2>
        <p className={`text-sm ${theme.text.secondary}`}>Manage incoming online orders and delivery requests</p>
      </div>

      <OrderQueueTable
        orders={mockOnlineOrders}
        onPayment={handlePayment}
        onMarkPaid={handleMarkPaid}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onPrint={handlePrint}
      />
    </div>
  );
};