import React from 'react';
import { OrdersView } from '@/src/app/modules/Orders';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Orders() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <OrdersView isDarkMode={isDarkMode} />
    </Layout>
  );
}