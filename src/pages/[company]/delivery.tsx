import React from 'react';
import { DeliveryView } from '@/src/app/modules/Delivery';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Delivery() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <DeliveryView isDarkMode={isDarkMode} />
    </Layout>
  );
}