import React from 'react';
import { ReportsView } from '@/src/app/modules/Reports';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Reports() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <ReportsView isDarkMode={isDarkMode} />
    </Layout>
  );
}