import React from 'react';
import { CustomerCRMView } from '../app/modules/CustomerCRM';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Customers() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <CustomerCRMView isDarkMode={isDarkMode} />
    </Layout>
  );
}