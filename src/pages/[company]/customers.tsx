import React from 'react';
import { CustomerCRMView } from '@/src/app/modules/CustomerCRM';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Customers() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <CustomerCRMView isDarkMode={isDarkMode} />
    </Layout>
  );
}