import React from 'react';
import { DeliveryView } from '../app/modules/Delivery';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Delivery() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <DeliveryView isDarkMode={isDarkMode} />
    </Layout>
  );
}