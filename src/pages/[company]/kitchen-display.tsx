import React from 'react';
import KitchenDisplayView from '@/src/app/modules/kitchen-order-display/KDSWrapper';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function KitchenDisplay() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <KitchenDisplayView isDarkMode={isDarkMode} />
    </Layout>
  );
}
