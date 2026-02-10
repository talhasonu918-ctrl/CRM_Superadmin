import React from 'react';
import { POSModule } from '@/src/app/modules/pos';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function POS() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <POSModule isDarkMode={isDarkMode} />
    </Layout>
  );
}
