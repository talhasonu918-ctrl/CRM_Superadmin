import React from 'react';
import { OrderHistoryView } from '@/src/app/modules/pos/form/OrderHistoryView';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function OrderHistory() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <OrderHistoryView isDarkMode={isDarkMode} />
    </Layout>
  );
}