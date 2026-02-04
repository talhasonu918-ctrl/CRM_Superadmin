import React from 'react';
import KitchenDisplayView from '../app/modules/kitchen-order-display';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function KitchenDisplay() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <KitchenDisplayView isDarkMode={isDarkMode} />
    </Layout>
  );
}
