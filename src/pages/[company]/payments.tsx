import React from 'react';
import { PaymentView } from '@/src/app/modules/Payments';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Payments() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <PaymentView isDarkMode={isDarkMode} />
    </Layout>
  );
}