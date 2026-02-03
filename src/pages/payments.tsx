import React from 'react';
import { PaymentView } from '../app/modules/Payments';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Payments() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <PaymentView isDarkMode={isDarkMode} />
    </Layout>
  );
}