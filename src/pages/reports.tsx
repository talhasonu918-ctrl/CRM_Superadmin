import React from 'react';
import { ReportsView } from '../app/modules/Reports';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Reports() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <ReportsView isDarkMode={isDarkMode} />
    </Layout>
  );
}