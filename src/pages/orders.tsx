import React from 'react';
import { OrdersView } from '../app/modules/Orders';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Orders() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <OrdersView isDarkMode={isDarkMode} />
    </Layout>
  );
}